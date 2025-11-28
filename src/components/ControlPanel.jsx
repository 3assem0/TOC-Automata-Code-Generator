import React, { useState } from 'react';
import { toPng } from 'html-to-image';

/**
 * Control panel for automata editor
 * Provides tools to add/remove states, set properties, and export
 */
const ControlPanel = ({ 
  onAddState, 
  onRemoveState, 
  onSetStart, 
  onSetAccepting, 
  onExportJSON, 
  onExportPNG,
  onClear,
  selectedNode,
  automata 
}) => {
  const [newStateName, setNewStateName] = useState('');
  const [transitionSymbol, setTransitionSymbol] = useState('');

  const handleAddState = () => {
    if (newStateName.trim()) {
      onAddState(newStateName.trim());
      setNewStateName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddState();
    }
  };

  const handleExportPNG = async () => {
    const element = document.querySelector('.react-flow');
    if (element) {
      try {
        const dataUrl = await toPng(element, {
          backgroundColor: '#ffffff',
          quality: 1.0,
          style: { transform: 'scale(1)' } // Ensure correct scaling
        });
        
        const link = document.createElement('a');
        link.download = 'automaton.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export PNG:', err);
      }
    }
  };

  return (
    <div className="control-panel">
      <h3>🛠️ Controls</h3>
      
      {/* Main Actions Grid */}
      <div className="control-grid">
        {/* Add State */}
        <div className="control-section">
          <h4><span className="icon">➕</span> Add State</h4>
          <div className="input-group">
            <input
              type="text"
              value={newStateName}
              onChange={(e) => setNewStateName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Name (e.g., q0)"
              className="input-field"
            />
            <button onClick={handleAddState} className="btn btn-primary icon-btn">
              Add
            </button>
          </div>
        </div>

        {/* Clear Canvas */}
        <div className="control-section">
          <h4><span className="icon">🗑️</span> Actions</h4>
          <button onClick={onClear} className="btn btn-danger btn-block">
            Clear Canvas
          </button>
        </div>
      </div>

      {/* State Properties */}
      {selectedNode && (
        <div className="control-section highlight-section">
          <h4><span className="icon">✨</span> Selected: <span className="highlight-text">{selectedNode.data.label}</span></h4>
          <div className="button-group vertical">
            <button
              onClick={() => onSetStart(selectedNode.id)}
              className={`btn ${selectedNode.data.isStart ? 'btn-success' : 'btn-secondary'}`}
              disabled={selectedNode.data.isStart}
            >
              {selectedNode.data.isStart ? '✓ Start State' : 'Set as Start State'}
            </button>
            <button
              onClick={() => onSetAccepting(selectedNode.id)}
              className={`btn ${selectedNode.data.isAccepting ? 'btn-success' : 'btn-secondary'}`}
            >
              {selectedNode.data.isAccepting ? '✓ Accepting State' : 'Set as Accepting State'}
            </button>
            <button
              onClick={() => onRemoveState(selectedNode.id)}
              className="btn btn-danger"
            >
              Remove State
            </button>
          </div>
        </div>
      )}

      {/* Transition Symbol Helper */}
      <div className="control-section info-section">
        <h4><span className="icon">ℹ️</span> Tips</h4>
        <div className="symbol-info">
          <p>• Click edge to edit label</p>
          <p>• Use <code>ε</code> for epsilon</p>
          <p>• Comma for multiple symbols</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="control-section">
        <h4><span className="icon">💾</span> Export</h4>
        <div className="button-group">
          <button onClick={onExportJSON} className="btn btn-secondary">
            JSON
          </button>
          <button onClick={handleExportPNG} className="btn btn-secondary">
            PNG Image
          </button>
        </div>
      </div>

      {/* Automata Info */}
      {automata && automata.states && automata.states.length > 0 && (
        <div className="control-section automata-info">
          <h4>📊 Info</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">States:</span>
              <span className="info-value">{automata.states.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Alphabet:</span>
              <span className="info-value">{automata.alphabet.join(', ') || 'None'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Start:</span>
              <span className="info-value">{automata.start || 'Not set'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Accepting:</span>
              <span className="info-value">{automata.accepting.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
