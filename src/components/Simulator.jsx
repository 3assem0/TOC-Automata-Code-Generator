import React, { useState, useEffect } from 'react';

/**
 * Simulator component
 * Tests input strings against the automaton and visualizes the execution
 */
const Simulator = ({ automata, onStateHighlight }) => {
  const [inputString, setInputString] = useState('');
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [executionPath, setExecutionPath] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // A previous run's result no longer applies once the automaton is edited
  useEffect(() => {
    setResult(null);
    setCurrentStep(0);
    setExecutionPath([]);
    onStateHighlight([]);
  }, [automata, onStateHighlight]);

  const simulateDFA = (input) => {
    const { start, transitions, accepting } = automata;
    let state = start;
    const path = [state];

    for (const symbol of input) {
      if (transitions[state] && transitions[state][symbol]) {
        const next = transitions[state][symbol];
        state = Array.isArray(next) ? next[0] : next;
        path.push(state);
      } else {
        return { accepted: false, path, error: `No transition for '${symbol}' from ${state}` };
      }
    }

    return { accepted: accepting.includes(state), path, finalState: state };
  };

  const simulateNFA = (input) => {
    const { start, transitions, accepting } = automata;
    
    // Epsilon closure helper
    const epsilonClosure = (states) => {
      const closure = new Set(states);
      const stack = [...states];
      
      while (stack.length > 0) {
        const state = stack.pop();
        if (transitions[state] && transitions[state]['ε']) {
          let epsStates = transitions[state]['ε'];
          if (!Array.isArray(epsStates)) epsStates = [epsStates];
          
          for (const epsState of epsStates) {
            if (!closure.has(epsState)) {
              closure.add(epsState);
              stack.push(epsState);
            }
          }
        }
      }
      return closure;
    };

    let currentStates = epsilonClosure(new Set([start]));
    const path = [[...currentStates]];

    for (const symbol of input) {
      const nextStates = new Set();
      
      for (const state of currentStates) {
        if (transitions[state] && transitions[state][symbol]) {
          let trans = transitions[state][symbol];
          if (!Array.isArray(trans)) trans = [trans];
          trans.forEach(s => nextStates.add(s));
        }
      }

      currentStates = epsilonClosure(nextStates);
      path.push([...currentStates]);

      if (currentStates.size === 0) {
        return { accepted: false, path, error: `No valid transitions for '${symbol}'` };
      }
    }

    const accepted = [...currentStates].some(state => accepting.includes(state));
    return { accepted, path, finalStates: [...currentStates] };
  };

  const handleSimulate = () => {
    if (!automata || !automata.transitions) {
      setResult({ error: 'No automaton loaded' });
      return;
    }

    // Check if NFA
    const isNFA = checkIfNFA(automata.transitions);
    const simResult = isNFA ? simulateNFA(inputString) : simulateDFA(inputString);
    
    setResult(simResult);
    setExecutionPath(simResult.path);
    setCurrentStep(0);
    setIsSimulating(false);

    // Highlight initial state
    if (simResult.path && simResult.path.length > 0) {
      const initialStates = Array.isArray(simResult.path[0]) ? simResult.path[0] : [simResult.path[0]];
      onStateHighlight(initialStates);
    }
  };

  const handleStepForward = () => {
    if (currentStep < executionPath.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const states = Array.isArray(executionPath[nextStep]) 
        ? executionPath[nextStep] 
        : [executionPath[nextStep]];
      onStateHighlight(states);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const states = Array.isArray(executionPath[prevStep]) 
        ? executionPath[prevStep] 
        : [executionPath[prevStep]];
      onStateHighlight(states);
    }
  };

  const handleReset = () => {
    setInputString('');
    setResult(null);
    setCurrentStep(0);
    setExecutionPath([]);
    setIsSimulating(false);
    onStateHighlight([]);
  };

  const checkIfNFA = (transitions) => {
    for (const state in transitions) {
      for (const symbol in transitions[state]) {
        if (symbol === 'ε') return true;
        const next = transitions[state][symbol];
        if (Array.isArray(next) && next.length > 1) return true;
      }
    }
    return false;
  };

  return (
    <div className="simulator">
      <h3> Test Automaton</h3>
      
      <div className="simulator-input">
        <input
          type="text"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          placeholder="Enter test string..."
          className="input-field"
        />
        <button onClick={handleSimulate} className="btn btn-primary">
          Run
        </button>
        <button onClick={handleReset} className="btn btn-secondary">
          Reset
        </button>
      </div>

      {result && (
        <div className="simulator-result">
          <div className={`result-badge ${result.accepted ? 'accepted' : 'rejected'}`}>
            {result.accepted ? '✓ ACCEPTED' : '✗ REJECTED'}
          </div>
          
          {result.error && (
            <div className="error-message">
              ⚠️ {result.error}
            </div>
          )}

          {executionPath.length > 0 && (
            <div className="execution-controls">
              <div className="step-info">
                Step {currentStep + 1} of {executionPath.length}{' · '}
                {Array.isArray(executionPath[currentStep]) ? (
                  <span className="current-states">
                    States: {executionPath[currentStep].join(', ')}
                  </span>
                ) : (
                  <span className="current-states">
                    State: {executionPath[currentStep]}
                  </span>
                )}
              </div>
              <div className="step-buttons">
                <button
                  onClick={handleStepBackward}
                  disabled={currentStep === 0}
                  className="btn btn-small"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleStepForward}
                  disabled={currentStep === executionPath.length - 1}
                  className="btn btn-small"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Simulator;
