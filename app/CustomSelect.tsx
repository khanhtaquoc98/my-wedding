"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: (string | Option)[];
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CustomSelect({ 
  name, 
  value, 
  defaultValue, 
  onChange, 
  options, 
  placeholder, 
  className, 
  style 
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to [{ label, value }]
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return opt;
  });

  // Determine initial value:
  // If controlled, use value. If uncontrolled, use defaultValue. Fallback to first option.
  const initialValue = value !== undefined 
    ? value 
    : (defaultValue !== undefined ? defaultValue : (normalizedOptions[0]?.value || ''));

  const [internalValue, setInternalValue] = useState(initialValue);

  // Synchronize internal state with external value if controlled
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Synchronize internal state if defaultValue changes (e.g. when editing item changes in modals)
  useEffect(() => {
    if (value === undefined && defaultValue !== undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, value]);

  const currentVal = value !== undefined ? value : internalValue;
  const selectedOption = normalizedOptions.find(opt => opt.value === currentVal) || normalizedOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ position: 'relative', width: '100%', ...style }}
      className="customSelectContainer"
    >
      {/* Hidden input to support native form submissions */}
      {name && <input type="hidden" name={name} value={currentVal} />}

      {/* Select button trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={className || "formSelect"}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          textAlign: 'left',
          cursor: 'pointer'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder || 'Chọn...'}
        </span>
        {/* CSS Chevron Arrow */}
        <span style={{
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid var(--sage-700)',
          display: 'inline-block',
          height: 0,
          width: 0,
          marginLeft: '8px',
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 200ms ease'
        }} />
      </button>

      {/* Options list dropdown overlay */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'var(--card-solid)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-sm)',
          marginTop: '6px',
          boxShadow: 'var(--shadow-md)',
          maxHeight: '220px',
          overflowY: 'auto',
          padding: '4px'
        }}>
          {normalizedOptions.map(opt => {
            const isSelected = opt.value === currentVal;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  setInternalValue(opt.value);
                  if (onChange) {
                    onChange(opt.value);
                  }
                  setIsOpen(false);
                }}
                style={{
                  padding: '10px 12px',
                  fontSize: '0.85rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--sage-100)' : 'transparent',
                  color: isSelected ? 'var(--sage-900)' : 'var(--foreground)',
                  fontWeight: isSelected ? 600 : 'normal',
                  transition: 'background 150ms ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'var(--sage-50)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
