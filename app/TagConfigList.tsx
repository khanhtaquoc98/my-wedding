"use client";

import React, { useState } from 'react';

interface TagConfigListProps {
  tags: string[];
  onUpdate: (newTags: string[]) => void;
  placeholder: string;
  colors?: Record<string, { bgColor: string; textColor: string }>;
  onUpdateColors?: (newColors: Record<string, { bgColor: string; textColor: string }>) => void;
}

export default function TagConfigList({ tags, onUpdate, placeholder, colors, onUpdateColors }: TagConfigListProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onUpdate([...tags, trimmed]);
      if (colors && onUpdateColors) {
        onUpdateColors({
          ...colors,
          [trimmed]: { bgColor: '#e4ede7', textColor: '#3d5e48' }
        });
      }
      setInputValue('');
    }
  };

  return (
    <div>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="formInput"
          style={{ flex: 1 }}
        />
        <button 
          type="submit" 
          className="btn btnPrimary"
          style={{ whiteSpace: 'nowrap' }}
        >
          Thêm
        </button>
      </form>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tags.map(tag => {
          const color = (colors && colors[tag]) || { bgColor: '#e4ede7', textColor: '#3d5e48' };
          
          return (
            <div 
              key={tag} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--sage-50)',
                border: '1px solid var(--border)'
              }}
            >
              {/* Category tag preview */}
              <span 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: color.bgColor, 
                  color: color.textColor, 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 600,
                  maxWidth: '150px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {tag}
              </span>

              {/* Color Configuration Pickers */}
              {colors && onUpdateColors && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-muted)' }}>Nền:</span>
                    <input 
                      type="color" 
                      value={color.bgColor} 
                      onChange={(e) => {
                        const newColors = { ...colors };
                        newColors[tag] = { ...color, bgColor: e.target.value };
                        onUpdateColors(newColors);
                      }}
                      style={{ width: '22px', height: '22px', border: '1px solid var(--border)', padding: 0, cursor: 'pointer', borderRadius: '4px', background: 'transparent' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-muted)' }}>Chữ:</span>
                    <input 
                      type="color" 
                      value={color.textColor} 
                      onChange={(e) => {
                        const newColors = { ...colors };
                        newColors[tag] = { ...color, textColor: e.target.value };
                        onUpdateColors(newColors);
                      }}
                      style={{ width: '22px', height: '22px', border: '1px solid var(--border)', padding: 0, cursor: 'pointer', borderRadius: '4px', background: 'transparent' }}
                    />
                  </div>
                </div>
              )}

              {/* Delete button */}
              <button 
                type="button" 
                onClick={() => {
                  onUpdate(tags.filter(t => t !== tag));
                  if (colors && onUpdateColors) {
                    const newColors = { ...colors };
                    delete newColors[tag];
                    onUpdateColors(newColors);
                  }
                }}
                className="btn btnDanger"
                style={{ 
                  padding: '4px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  lineHeight: 1
                }}
                title="Xóa"
              >
                &times;
              </button>
            </div>
          );
        })}
        {tags.length === 0 && (
          <span style={{ color: 'var(--accent-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>Chưa cấu hình tùy chọn nào</span>
        )}
      </div>
    </div>
  );
}
