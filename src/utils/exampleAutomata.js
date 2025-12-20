// Example automata definitions for testing and demonstration

export const exampleAutomata = {


  // NFA: Accepts strings containing "ab"
  containsAB: {
    name: "Contains substring 'ab'",
    states: ["q0", "q1", "q2"],
    alphabet: ["a", "b"],
    start: "q0",
    accepting: ["q2"],
    transitions: {
      q0: { "a": ["q0", "q1"], "b": ["q0"] },
      q1: { "b": ["q2"] },
      q2: { "a": ["q2"], "b": ["q2"] }
    },
    positions: {
      q0: { x: 100, y: 200 },
      q1: { x: 300, y: 200 },
      q2: { x: 500, y: 200 }
    }
  },

  // NFA with epsilon: Accepts strings matching (a|b)*abb
  epsilonExample: {
    name: "Strings ending with 'abb' (with ε-transitions)",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["a", "b"],
    start: "q0",
    accepting: ["q3"],
    transitions: {
      q0: { "a": ["q0", "q1"], "b": ["q0"], "ε": [] },
      q1: { "b": ["q2"], "ε": [] },
      q2: { "b": ["q3"], "ε": [] },
      q3: { "ε": [] }
    },
    positions: {
      q0: { x: 100, y: 200 },
      q1: { x: 250, y: 200 },
      q2: { x: 400, y: 200 },
      q3: { x: 550, y: 200 }
    }
  }
};

// Get list of example names
export const getExampleNames = () => {
  return Object.keys(exampleAutomata).map(key => ({
    key,
    name: exampleAutomata[key].name
  }));
};

// Get example by key
export const getExample = (key) => {
  return exampleAutomata[key] || null;
};
