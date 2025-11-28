import React, { useState } from 'react';

/**
 * Example loader component
 * Allows users to load pre-built example automata
 */
const ExampleLoader = ({ onLoadExample }) => {
  const [selectedExample, setSelectedExample] = useState('');

  const examples = [
    { key: 'binaryEndingIn01', name: "Binary strings ending in '01'" },
    { key: 'evenAs', name: "Even number of 'a's" },
    { key: 'divisibleBy3', name: 'Binary numbers divisible by 3' },
    { key: 'containsAB', name: "Contains substring 'ab' (NFA)" },
    { key: 'epsilonExample', name: "Strings ending with 'abb' (ε-NFA)" }
  ];

  const handleLoad = () => {
    if (selectedExample) {
      onLoadExample(selectedExample);
    }
  };

  return (
    <div className="example-loader">
      <h3> Load Example</h3>
      <div className="example-controls">
        <select
          value={selectedExample}
          onChange={(e) => setSelectedExample(e.target.value)}
          className="example-select"
        >
          <option value="">Choose an example...</option>
          {examples.map(ex => (
            <option key={ex.key} value={ex.key}>
              {ex.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleLoad}
          disabled={!selectedExample}
          className="btn btn-secondary"
        >
          Load
        </button>
      </div>
    </div>
  );
};

export default ExampleLoader;
