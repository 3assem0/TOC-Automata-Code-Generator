// Example automata definitions for testing and demonstration

export const exampleAutomata = {
  // DFA: Accepts binary strings ending in "01"
  binaryEndingIn01: {
    name: "Binary strings ending in '01'",
    states: ["q0", "q1", "q2"],
    alphabet: ["0", "1"],
    start: "q0",
    accepting: ["q2"],
    transitions: {
      q0: { "0": "q1", "1": "q0" },
      q1: { "0": "q1", "1": "q2" },
      q2: { "0": "q1", "1": "q0" }
    },
    positions: {
      q0: { x: 100, y: 200 },
      q1: { x: 300, y: 200 },
      q2: { x: 500, y: 200 }
    }
  },

  // DFA: Accepts strings with even number of 'a's
  evenAs: {
    name: "Even number of 'a's",
    states: ["q0", "q1"],
    alphabet: ["a", "b"],
    start: "q0",
    accepting: ["q0"],
    transitions: {
      q0: { "a": "q1", "b": "q0" },
      q1: { "a": "q0", "b": "q1" }
    },
    positions: {
      q0: { x: 200, y: 200 },
      q1: { x: 400, y: 200 }
    }
  },

  // DFA: Accepts strings divisible by 3 (binary)
  divisibleBy3: {
    name: "Binary numbers divisible by 3",
    states: ["q0", "q1", "q2"],
    alphabet: ["0", "1"],
    start: "q0",
    accepting: ["q0"],
    transitions: {
      q0: { "0": "q0", "1": "q1" },
      q1: { "0": "q2", "1": "q0" },
      q2: { "0": "q1", "1": "q2" }
    },
    positions: {
      q0: { x: 300, y: 100 },
      q1: { x: 450, y: 250 },
      q2: { x: 150, y: 250 }
    }
  },

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
