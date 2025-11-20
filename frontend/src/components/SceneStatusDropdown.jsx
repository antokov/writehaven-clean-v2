import React, { useState, useRef, useEffect } from 'react';
import { BsLightbulb, BsFileText, BsPencil, BsArrowRepeat, BsStars, BsCheckCircle } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import './SceneStatusDropdown.css';

const STATUS_OPTIONS_BASE = [
  { value: 'Idea', label: 'Idea', color: '#6b7280', icon: BsLightbulb },
  { value: 'Outlined', label: 'Outlined', color: '#3b82f6', icon: BsFileText },
  { value: 'Drafting', label: 'Drafting', color: '#f59e0b', icon: BsPencil },
  { value: 'Revising', label: 'Revising', color: '#f97316', icon: BsArrowRepeat },
  { value: 'Polished', label: 'Polished', color: '#22c55e', icon: BsStars },
  { value: 'Final', label: 'Final', color: '#a855f7', icon: BsCheckCircle },
];

// Export base options without descriptions for use in other components
export const STATUS_OPTIONS = STATUS_OPTIONS_BASE;

export default function SceneStatusDropdown({ value, onChange }) {
  const { t } = useTranslation();

  // Add translated descriptions to status options
  const statusOptionsWithDescriptions = STATUS_OPTIONS_BASE.map(option => ({
    ...option,
    description: t(`writing.sceneStatus.${option.value}`)
  }));

  const currentStatus = statusOptionsWithDescriptions.find(s => s.value === value) || statusOptionsWithDescriptions[0];
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHoveredOption(null);
        setShowTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleOptionHover = (option) => {
    setHoveredOption(option);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
  };

  const handleOptionLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowTooltip(false);
    setHoveredOption(null);
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setHoveredOption(null);
    setShowTooltip(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  return (
    <div className="scene-status-dropdown" ref={dropdownRef}>
      <button
        className="scene-status-select"
        style={{
          borderLeft: `5px solid ${currentStatus.color}`,
        }}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {React.createElement(currentStatus.icon, { className: 'status-icon', style: { color: currentStatus.color } })}
        <span>{currentStatus.label}</span>
      </button>

      {isOpen && (
        <>
          <div className="status-dropdown-menu">
            {statusOptionsWithDescriptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.value}
                  className={`status-option ${option.value === value ? 'active' : ''}`}
                  style={{
                    borderLeft: `5px solid ${option.color}`,
                  }}
                  onClick={() => handleOptionClick(option)}
                  onMouseEnter={() => handleOptionHover(option)}
                  onMouseLeave={handleOptionLeave}
                  data-option-index={index}
                >
                  <IconComponent className="status-icon" style={{ color: option.color }} />
                  <span>{option.label}</span>
                </div>
              );
            })}
          </div>
          {showTooltip && hoveredOption && (
            <div
              className="status-tooltip"
              style={{
                top: `${44 + statusOptionsWithDescriptions.findIndex(opt => opt.value === hoveredOption.value) * 40}px`
              }}
            >
              <strong>{hoveredOption.label}</strong> – {hoveredOption.description}
            </div>
          )}
        </>
      )}
    </div>
  );
}
