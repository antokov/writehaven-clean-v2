/**
 * Epigram Parser Utility
 * Parses :::epigram blocks from text content
 */

/**
 * Parse epigrams from text and return structured data
 * @param {string} text - The raw text content
 * @returns {Array} Array of epigram objects with position info
 */
export function parseEpigrams(text) {
  const epigramRegex = /:::epigram\n([\s\S]*?):::/g;
  const epigrams = [];
  let match;

  while ((match = epigramRegex.exec(text)) !== null) {
    const content = match[1].trim();
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);

    // Last line starting with — or – is the source
    let epigramText = '';
    let source = '';

    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      if (lastLine.startsWith('—') || lastLine.startsWith('–') || lastLine.startsWith('-')) {
        source = lastLine.replace(/^[—–-]\s*/, '');
        epigramText = lines.slice(0, -1).join('\n');
      } else {
        epigramText = lines.join('\n');
      }
    }

    epigrams.push({
      fullMatch: match[0],
      text: epigramText,
      source: source,
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }

  return epigrams;
}

/**
 * Convert text with :::epigram blocks to HTML for rendering
 * @param {string} text - The raw text content
 * @param {boolean} isPreview - Whether to use preview styling
 * @returns {string} HTML string with epigrams converted
 */
export function renderEpigramsToHTML(text, isPreview = false) {
  const className = isPreview ? 'epigram-preview' : 'epigram-block';

  return text.replace(/:::epigram\n([\s\S]*?):::/g, (match, content) => {
    const lines = content.trim().split('\n').map(line => line.trim()).filter(line => line);

    let epigramText = '';
    let source = '';

    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      if (lastLine.startsWith('—') || lastLine.startsWith('–') || lastLine.startsWith('-')) {
        source = lastLine.replace(/^[—–-]\s*/, '');
        epigramText = lines.slice(0, -1).join('\n');
      } else {
        epigramText = lines.join('\n');
      }
    }

    const sourceHTML = source
      ? `<div class="epigram-source">${escapeHtml(source)}</div>`
      : '';

    return `
      <div class="${className}">
        <div class="epigram-text">${escapeHtml(epigramText)}</div>
        ${sourceHTML}
      </div>
    `;
  });
}

/**
 * Convert React elements with epigrams rendered
 * @param {string} text - The raw text content
 * @param {boolean} isPreview - Whether to use preview styling
 * @returns {Array} Array of text and React elements
 */
export function renderEpigramsToReact(text, isPreview = false) {
  const parts = [];
  const epigramRegex = /:::epigram\n([\s\S]*?):::/g;
  let lastIndex = 0;
  let match;

  while ((match = epigramRegex.exec(text)) !== null) {
    // Add text before epigram
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }

    // Parse epigram
    const content = match[1].trim();
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);

    let epigramText = '';
    let source = '';

    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      if (lastLine.startsWith('—') || lastLine.startsWith('–') || lastLine.startsWith('-')) {
        source = lastLine.replace(/^[—–-]\s*/, '');
        epigramText = lines.slice(0, -1).join('\n');
      } else {
        epigramText = lines.join('\n');
      }
    }

    parts.push({
      type: 'epigram',
      text: epigramText,
      source: source,
      isPreview: isPreview
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }

  return parts;
}

/**
 * Check if cursor is inside an epigram block
 * @param {string} text - The full text content
 * @param {number} cursorPosition - Current cursor position
 * @returns {Object|null} Epigram info if cursor is inside one, null otherwise
 */
export function getCursorEpigram(text, cursorPosition) {
  const epigrams = parseEpigrams(text);

  for (const epigram of epigrams) {
    if (cursorPosition >= epigram.startIndex && cursorPosition <= epigram.endIndex) {
      return epigram;
    }
  }

  return null;
}

/**
 * Insert epigram template at cursor position
 * @param {string} text - Current text content
 * @param {number} cursorPosition - Where to insert
 * @returns {Object} New text and cursor position
 */
export function insertEpigramTemplate(text, cursorPosition) {
  const template = `:::epigram
"Your epigram text here..."
— Source
:::`;

  const before = text.substring(0, cursorPosition);
  const after = text.substring(cursorPosition);

  // Add newlines for proper spacing
  const prefix = before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
  const suffix = after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n';

  const newText = before + prefix + template + suffix + after;
  const newCursorPos = cursorPosition + prefix.length + ':::epigram\n'.length;

  return {
    text: newText,
    cursorPosition: newCursorPos
  };
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate epigram syntax
 * @param {string} text - Text to validate
 * @returns {Array} Array of validation errors
 */
export function validateEpigramSyntax(text) {
  const errors = [];
  const openTags = (text.match(/:::epigram/g) || []).length;
  const closeTags = (text.match(/:::/g) || []).length - openTags;

  if (openTags !== closeTags) {
    errors.push({
      type: 'unmatched_tags',
      message: 'Unmatched epigram tags. Each :::epigram must be closed with :::'
    });
  }

  // Check for nested epigrams
  const nestedRegex = /:::epigram[\s\S]*?:::epigram/;
  if (nestedRegex.test(text)) {
    errors.push({
      type: 'nested_epigrams',
      message: 'Nested epigrams are not allowed'
    });
  }

  return errors;
}
