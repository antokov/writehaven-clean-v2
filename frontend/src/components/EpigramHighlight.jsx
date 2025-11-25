import React, { useEffect, useRef, useState } from 'react';
import { parseEpigrams } from '../utils/epigramParser';
import '../styles/epigram.css';

/**
 * EpigramHighlight Component
 * Adds visual highlighting overlay for epigrams in a textarea
 */
export default function EpigramHighlight({ value, textareaRef }) {
  const highlightRef = useRef(null);
  const [epigrams, setEpigrams] = useState([]);

  useEffect(() => {
    if (value) {
      const parsed = parseEpigrams(value);
      setEpigrams(parsed);
    } else {
      setEpigrams([]);
    }
  }, [value]);

  // Sync scroll position between textarea and highlight layer
  useEffect(() => {
    const textarea = textareaRef?.current;
    const highlight = highlightRef.current;

    if (!textarea || !highlight) return;

    const syncScroll = () => {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener('scroll', syncScroll);
    return () => textarea.removeEventListener('scroll', syncScroll);
  }, [textareaRef]);

  if (epigrams.length === 0) {
    return null;
  }

  // Create highlighted text with markers
  const renderHighlightedText = () => {
    if (!value) return '';

    let result = [];
    let lastIndex = 0;

    epigrams.forEach((epigram, idx) => {
      // Add text before epigram
      if (epigram.startIndex > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {value.substring(lastIndex, epigram.startIndex)}
          </span>
        );
      }

      // Add epigram block
      result.push(
        <span key={`epigram-${idx}`} className="epigram-highlight-marker">
          {epigram.fullMatch}
        </span>
      );

      lastIndex = epigram.endIndex;
    });

    // Add remaining text
    if (lastIndex < value.length) {
      result.push(
        <span key="text-end">
          {value.substring(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div
      ref={highlightRef}
      className="epigram-highlight-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        color: 'transparent',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        padding: 'inherit',
        border: '1px solid transparent',
      }}
    >
      {renderHighlightedText()}
    </div>
  );
}
