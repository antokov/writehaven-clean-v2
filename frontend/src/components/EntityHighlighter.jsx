// frontend/src/components/EntityHighlighter.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EntityHighlighter.css';

/**
 * EntityHighlighter - Highlights PERSON and LOC entities using ContentEditable
 *
 * Props:
 * - sceneId: ID of the current scene
 * - content: The text content to analyze
 * - onChange: Callback when content changes
 * - onCreateCharacter: Callback to create character from entity
 * - onCreateLocation: Callback to create location from entity
 */
export default function EntityHighlighter({
  sceneId,
  projectId,
  content,
  onChange,
  onCreateCharacter,
  onCreateLocation,
  onIgnoreEntity,
  placeholder,
  onBlur,
  onContextMenu,
  entityCheckActive = false,
  ...otherProps
}) {
  const [entities, setEntities] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [mentions, setMentions] = useState([]); // Linked mentions from DB
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [characters, setCharacters] = useState([]); // All characters in project
  const [locations, setLocations] = useState([]); // All locations in project
  const [showRelinkDropdown, setShowRelinkDropdown] = useState(false);

  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false); // Prevent cursor jump
  const navigate = useNavigate();

  // Load mentions when scene changes
  useEffect(() => {
    if (!sceneId) {
      setMentions([]);
      return;
    }

    const loadMentions = async () => {
      try {
        const response = await axios.get(`/api/scenes/${sceneId}/mentions`);
        setMentions(response.data || []);
      } catch (err) {
        console.error('Failed to load mentions:', err);
        setMentions([]);
      }
    };

    loadMentions();
  }, [sceneId]);

  // Load characters and locations when project changes
  useEffect(() => {
    if (!projectId) return;

    const loadEntities = async () => {
      try {
        const [charsRes, locsRes] = await Promise.all([
          axios.get(`/api/projects/${projectId}/characters`),
          axios.get(`/api/projects/${projectId}/world`)
        ]);
        setCharacters(charsRes.data || []);
        setLocations(locsRes.data || []);
      } catch (err) {
        console.error('Failed to load entities:', err);
      }
    };

    loadEntities();
  }, [projectId]);

  // Analyze entities when entityCheckActive is toggled ON or mentions change
  useEffect(() => {
    if (!entityCheckActive) {
      // Clear entities when check is turned off
      setEntities([]);
      setSuggestions([]);
      return;
    }

    if (!sceneId || !content) {
      setEntities([]);
      setSuggestions([]);
      return;
    }

    // Trigger analysis immediately when check is activated or mentions change
    analyzeText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityCheckActive, mentions]); // Removed sceneId to prevent re-analysis on scene change

  // Analyze text via API
  const analyzeText = async () => {
    if (!sceneId || !content || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const response = await axios.post(`/api/scenes/${sceneId}/analyze`, {
        text: content
      });

      const nlpEntities = response.data.entities || [];

      // Find all linked mentions dynamically in current content
      const mentionEntities = [];
      const linkedMentions = mentions.filter(m => m.character_id || m.worldnode_id);

      console.log('Linked mentions from DB:', linkedMentions.length, linkedMentions);

      // Group by entity text to avoid duplicates
      const uniqueLinkedTexts = new Set(linkedMentions.map(m => m.text.toLowerCase()));

      console.log('Unique linked texts:', Array.from(uniqueLinkedTexts));

      // For each unique linked text, find ALL occurrences in current content
      uniqueLinkedTexts.forEach(linkedText => {
        const mention = linkedMentions.find(m => m.text.toLowerCase() === linkedText);
        if (!mention) return;

        // Find all occurrences of this text in content (case-insensitive)
        let startPos = 0;
        const searchText = linkedText;

        while (true) {
          const pos = content.toLowerCase().indexOf(searchText, startPos);
          if (pos === -1) break;

          const endPos = pos + mention.text.length;

          mentionEntities.push({
            text: content.substring(pos, endPos), // Use actual text from content
            label: mention.entity_type,
            start: pos,
            end: endPos,
            // Store linked info directly in the entity
            isLinked: true,
            linkedName: mention.entity_name,
            linkedId: mention.character_id || mention.worldnode_id,
            linkedCharacterId: mention.character_id,
            linkedWorldnodeId: mention.worldnode_id,
            mentionId: mention.id  // Store mention ID for unlinking
          });

          console.log(`Found "${mention.text}" at position ${pos}-${endPos}, linked to "${mention.entity_name}"`);

          startPos = endPos;
        }
      });

      console.log('Mention entities found:', mentionEntities.length);

      // Merge: mentions take priority, add NLP entities that don't overlap
      const mergedEntities = [...mentionEntities];

      nlpEntities.forEach(nlpEntity => {
        // Check if this position is already covered by a mention
        const hasOverlap = mentionEntities.some(
          m => (nlpEntity.start >= m.start && nlpEntity.start < m.end) ||
               (nlpEntity.end > m.start && nlpEntity.end <= m.end)
        );

        if (!hasOverlap) {
          mergedEntities.push({
            ...nlpEntity,
            isLinked: false
          });
        }
      });

      setEntities(mergedEntities);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Failed to analyze text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Create HTML with entity spans
  const createHighlightedHTML = () => {
    if (!content || entities.length === 0) {
      return escapeHTML(content || '');
    }

    let lastIndex = 0;
    const parts = [];

    // Sort entities by start position and filter out invalid ones
    const sortedEntities = [...entities]
      .filter(e => e.start >= 0 && e.end <= content.length && e.start < e.end)
      .sort((a, b) => a.start - b.start);

    sortedEntities.forEach((entity) => {
      // Add text before entity
      if (entity.start > lastIndex) {
        parts.push(escapeHTML(content.substring(lastIndex, entity.start)));
      }

      // Find suggestion for this entity (only if not linked)
      const suggestion = !entity.isLinked ? suggestions.find(
        s => s.start === entity.start && s.end === entity.end
      ) : null;

      // Entity already has linked info from analyzeText
      const isLinked = entity.isLinked || false;

      // Create entity span - NO escaping for the span tags themselves
      const entityText = content.substring(entity.start, entity.end);
      // If linked, show the linked entity name instead of the text
      const displayText = isLinked && entity.linkedName ? entity.linkedName : entityText;

      const className = `entity-mark entity-${entity.label.toLowerCase()}${
        suggestion && !isLinked ? ' has-suggestion' : ''
      }${isLinked ? ' is-linked' : ''}`;

      // Simplified data attribute - only store what we need
      const dataAttr = JSON.stringify({
        text: entityText,
        label: entity.label,
        start: entity.start,
        end: entity.end,
        hasSuggestion: !!suggestion,
        isLinked: isLinked,
        linkedName: entity.linkedName,
        linkedId: entity.linkedId,
        mentionId: entity.mentionId  // Store mention ID for operations
      }).replace(/"/g, '&quot;');

      // Show linked name with icon if linked
      const displayHTML = isLinked
        ? `${escapeHTMLSimple(displayText)} <span class="link-icon">🔗</span>`
        : escapeHTMLSimple(entityText);

      // Entity text itself is escaped, but not the span tags
      parts.push(
        `<span class="${className}" data-entity="${dataAttr}">${displayHTML}</span>`
      );

      lastIndex = entity.end;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(escapeHTML(content.substring(lastIndex)));
    }

    return parts.join('');
  };

  // Escape HTML characters for display
  const escapeHTML = (text) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  };

  // Simple escape for text inside spans (no newline conversion)
  const escapeHTMLSimple = (text) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  // Update editor content with entities
  useEffect(() => {
    if (!editorRef.current || isUpdatingRef.current) return;

    const html = createHighlightedHTML();
    const currentHTML = editorRef.current.innerHTML;

    // Only update if HTML actually changed (normalize whitespace for comparison)
    const normalizedCurrent = currentHTML.replace(/\s+/g, ' ').trim();
    const normalizedNew = html.replace(/\s+/g, ' ').trim();

    if (normalizedCurrent === normalizedNew) return;

    isUpdatingRef.current = true;

    // Save cursor position as text offset (more reliable than node reference)
    const selection = window.getSelection();
    let textOffset = 0;

    if (selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      textOffset = preCaretRange.toString().length;
    }

    // Update content
    editorRef.current.innerHTML = html;

    // Try to restore cursor position by text offset
    try {
      const textContent = editorRef.current.innerText || '';
      const targetOffset = Math.min(textOffset, textContent.length);

      if (targetOffset > 0) {
        const walker = document.createTreeWalker(
          editorRef.current,
          NodeFilter.SHOW_TEXT,
          null
        );

        let currentOffset = 0;
        let node = walker.nextNode();

        while (node) {
          const nodeLength = node.textContent.length;
          if (currentOffset + nodeLength >= targetOffset) {
            const newRange = document.createRange();
            const sel = window.getSelection();
            newRange.setStart(node, Math.min(targetOffset - currentOffset, nodeLength));
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            break;
          }
          currentOffset += nodeLength;
          node = walker.nextNode();
        }
      }
    } catch (e) {
      console.warn('Cursor restoration failed:', e);
    }

    isUpdatingRef.current = false;
  }, [entities, suggestions, mentions]);

  // Handle content changes
  const handleInput = (e) => {
    if (isUpdatingRef.current) return;

    const text = e.target.innerText || '';
    onChange(text);
  };

  // Handle entity click
  const handleClick = (e) => {
    const target = e.target;
    if (target.classList.contains('entity-mark')) {
      e.preventDefault();

      try {
        const entityData = JSON.parse(
          target.getAttribute('data-entity').replace(/&quot;/g, '"')
        );

        // Find the full suggestion if it exists (but not if already linked)
        const suggestion = entityData.hasSuggestion && !entityData.isLinked
          ? suggestions.find(s => s.start === entityData.start && s.end === entityData.end)
          : null;

        setHoveredEntity({
          content: entityData.text,
          label: entityData.label,
          start: entityData.start,
          end: entityData.end,
          suggestion: suggestion,
          isLinked: entityData.isLinked,
          linkedName: entityData.linkedName,
          linkedId: entityData.linkedId,
          mentionId: entityData.mentionId
        });
      } catch (err) {
        console.error('Failed to parse entity data:', err);
      }
    }
  };

  const handleCreateEntity = async (entity) => {
    if (entity.label === 'PERSON' && onCreateCharacter) {
      await onCreateCharacter(entity.content);
    } else if (entity.label === 'LOC' && onCreateLocation) {
      await onCreateLocation(entity.content);
    }

    // Re-analyze after creating
    setTimeout(() => analyzeText(), 500);
    setHoveredEntity(null);
  };

  const handleLinkToExisting = async (entity, suggestion) => {
    try {
      const response = await axios.post(`/api/scenes/${sceneId}/link-entity`, {
        text: entity.content,
        entity_type: entity.label,
        entity_id: suggestion.entity_id
      });

      console.log(`Linked "${entity.content}" to ${suggestion.match_name}:`, response.data);

      // Reload mentions - this will trigger analyzeText via useEffect
      const mentionsResponse = await axios.get(`/api/scenes/${sceneId}/mentions`);
      setMentions(mentionsResponse.data || []);
    } catch (err) {
      console.error('Link entity failed:', err);
    }

    setHoveredEntity(null);
  };

  const handleIgnoreSuggestion = (entity) => {
    // TODO: Mark suggestion as ignored
    console.log('Ignore suggestion:', entity);
    setHoveredEntity(null);
  };

  const handleIgnoreEntity = async (entity) => {
    if (onIgnoreEntity) {
      await onIgnoreEntity(entity.content);
      // Re-analyze after ignoring
      setTimeout(() => analyzeText(), 500);
    }
    setHoveredEntity(null);
  };

  const handleUnlinkEntity = async (entity) => {
    console.log('Unlinking entity:', entity);

    if (!entity.mentionId) {
      console.error('No mention ID found for entity:', entity);
      alert('Fehler: Keine Mention-ID gefunden. Die Entität wurde möglicherweise noch nicht in der Datenbank gespeichert.');
      return;
    }

    try {
      console.log('Calling unlink API for mention ID:', entity.mentionId);
      const response = await axios.post(`/api/mentions/${entity.mentionId}/unlink`);
      console.log('Unlink response:', response.data);

      // Reload mentions - this will trigger analyzeText via useEffect
      const mentionsResponse = await axios.get(`/api/scenes/${sceneId}/mentions`);
      setMentions(mentionsResponse.data || []);
      // Note: No need to call analyzeText() here - useEffect with [mentions] dependency will do it
    } catch (err) {
      console.error('Failed to unlink entity:', err);
      console.error('Error details:', err.response?.data);
      alert('Fehler beim Aufheben der Verlinkung: ' + (err.response?.data?.error || err.message));
    }
    setHoveredEntity(null);
  };

  const handleChangeEntityType = async (entity, newType) => {
    if (!entity.mentionId) {
      console.error('No mention ID found for entity');
      return;
    }

    try {
      await axios.post(`/api/mentions/${entity.mentionId}/change-type`, {
        entity_type: newType
      });

      // Reload mentions - this will trigger analyzeText via useEffect
      const mentionsResponse = await axios.get(`/api/scenes/${sceneId}/mentions`);
      setMentions(mentionsResponse.data || []);
    } catch (err) {
      console.error('Failed to change entity type:', err);
      alert('Failed to change entity type');
    }
    setHoveredEntity(null);
  };

  const handleRelinkEntity = async (entity, newEntityId, newEntityType) => {
    if (!entity.mentionId) {
      console.error('No mention ID found for entity');
      return;
    }

    try {
      await axios.post(`/api/mentions/${entity.mentionId}/relink`, {
        entity_type: newEntityType,
        entity_id: newEntityId
      });

      // Reload mentions - this will trigger analyzeText via useEffect
      const mentionsResponse = await axios.get(`/api/scenes/${sceneId}/mentions`);
      setMentions(mentionsResponse.data || []);
    } catch (err) {
      console.error('Failed to relink entity:', err);
      alert('Failed to relink entity');
    }
    setHoveredEntity(null);
  };

  // Extract className from otherProps to apply to outer container
  const { className: externalClassName, ...restProps } = otherProps;

  return (
    <div className={`${externalClassName || ''} entity-highlighter-container`}>
      <div className={`entity-highlighter-wrapper${entityCheckActive ? ' entity-check-active' : ''}`}>
        {/* ContentEditable editor with entity highlighting */}
        <div
          ref={editorRef}
          className="entity-highlighter-editor"
          contentEditable={!entityCheckActive}
          onInput={handleInput}
          onClick={handleClick}
          onBlur={onBlur}
          onContextMenu={onContextMenu}
          data-placeholder={placeholder}
          suppressContentEditableWarning
          {...restProps}
        />

      {/* Tooltip for entity actions */}
      {hoveredEntity && (
        <div className="entity-tooltip" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}>
          <div className="entity-tooltip-header">
            <strong>{hoveredEntity.content}</strong>
            <span className="entity-type-badge">{hoveredEntity.label}</span>
          </div>

          {hoveredEntity.isLinked ? (
            // Linked entity - show profile link and unlink option
            <div className="entity-actions">
              <p style={{ margin: '8px 0', fontSize: 14, color: 'var(--muted)' }}>
                Verlinkt mit: <strong>{hoveredEntity.linkedName}</strong>
              </p>
              <button
                className="btn-create-entity"
                onClick={() => {
                  const path = hoveredEntity.label === 'PERSON'
                    ? `/app/project/${projectId}/characters`
                    : `/app/project/${projectId}/world`;
                  navigate(path);
                  setHoveredEntity(null);
                }}
                style={{ width: '100%' }}
              >
                Profil öffnen
              </button>
              <button
                className="btn-ignore"
                onClick={() => handleUnlinkEntity(hoveredEntity)}
                style={{ width: '100%', marginTop: '8px' }}
              >
                Verlinkung aufheben
              </button>
              <button
                className="btn-ignore"
                onClick={() => {
                  const newType = hoveredEntity.label === 'PERSON' ? 'LOC' : 'PERSON';
                  handleChangeEntityType(hoveredEntity, newType);
                }}
                style={{ width: '100%', marginTop: '8px' }}
              >
                Als {hoveredEntity.label === 'PERSON' ? 'Ort' : 'Person'} markieren
              </button>
              <button
                className="btn-ignore"
                onClick={() => setShowRelinkDropdown(!showRelinkDropdown)}
                style={{ width: '100%', marginTop: '8px' }}
              >
                Verlinkung ändern
              </button>
              {showRelinkDropdown && (
                <div style={{ marginTop: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--line)', borderRadius: '4px', padding: '4px' }}>
                  {hoveredEntity.label === 'PERSON' ? (
                    characters.length > 0 ? (
                      characters.map(char => (
                        <div
                          key={char.id}
                          onClick={() => handleRelinkEntity(hoveredEntity, char.id, 'PERSON')}
                          style={{
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            background: hoveredEntity.linkedId === char.id ? 'var(--brand)' : 'transparent',
                            color: hoveredEntity.linkedId === char.id ? 'white' : 'var(--text)'
                          }}
                          onMouseEnter={(e) => {
                            if (hoveredEntity.linkedId !== char.id) {
                              e.target.style.background = 'var(--muted-bg)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (hoveredEntity.linkedId !== char.id) {
                              e.target.style.background = 'transparent';
                            }
                          }}
                        >
                          {char.name}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '8px', color: 'var(--muted)' }}>Keine Charaktere vorhanden</div>
                    )
                  ) : (
                    locations.length > 0 ? (
                      locations.map(loc => (
                        <div
                          key={loc.id}
                          onClick={() => handleRelinkEntity(hoveredEntity, loc.id, 'LOC')}
                          style={{
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            background: hoveredEntity.linkedId === loc.id ? 'var(--brand)' : 'transparent',
                            color: hoveredEntity.linkedId === loc.id ? 'white' : 'var(--text)'
                          }}
                          onMouseEnter={(e) => {
                            if (hoveredEntity.linkedId !== loc.id) {
                              e.target.style.background = 'var(--muted-bg)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (hoveredEntity.linkedId !== loc.id) {
                              e.target.style.background = 'transparent';
                            }
                          }}
                        >
                          {loc.title}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '8px', color: 'var(--muted)' }}>Keine Orte vorhanden</div>
                    )
                  )}
                </div>
              )}
            </div>
          ) : hoveredEntity.suggestion ? (
            // Has suggestion - show link option
            <div className="entity-suggestion">
              <p>Similar to: <strong>{hoveredEntity.suggestion.match_name}</strong></p>
              <div className="tooltip-actions">
                <button
                  className="btn-link-entity"
                  onClick={() => handleLinkToExisting(hoveredEntity, hoveredEntity.suggestion)}
                >
                  Link to {hoveredEntity.suggestion.match_name}
                </button>
                <button
                  className="btn-ignore"
                  onClick={() => handleIgnoreSuggestion(hoveredEntity)}
                >
                  Ignore
                </button>
              </div>
            </div>
          ) : (
            // No link, no suggestion - show create and ignore
            <div className="entity-actions">
              <button
                className="btn-create-entity"
                onClick={() => handleCreateEntity(hoveredEntity)}
              >
                + Create as {hoveredEntity.label === 'PERSON' ? 'Character' : 'Location'}
              </button>
              <button
                className="btn-ignore"
                onClick={() => handleIgnoreEntity(hoveredEntity)}
                style={{ width: '100%', marginTop: '8px' }}
              >
                Ignorieren
              </button>
            </div>
          )}

          <button
            className="btn-close-tooltip"
            onClick={() => setHoveredEntity(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Analysis indicator */}
      {/* Analysis indicator */}
      {isAnalyzing && (
        <div className="entity-analysis-indicator">
          Analyzing...
        </div>
      )}
      </div>
    </div>
  );
}
