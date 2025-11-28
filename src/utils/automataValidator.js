// Validates automata structure and returns errors if any

export const validateAutomata = (automata) => {
  const errors = [];

  // Check if automata object exists
  if (!automata) {
    return ["Automata is null or undefined"];
  }

  // Check for required fields
  if (!automata.states || automata.states.length === 0) {
    errors.push("Automata must have at least one state");
  }

  if (!automata.start) {
    errors.push("Automata must have a start state");
  }

  if (!automata.accepting) {
    errors.push("Automata must have accepting states defined (can be empty array)");
  }

  if (!automata.alphabet || automata.alphabet.length === 0) {
    errors.push("Automata must have at least one symbol in the alphabet");
  }

  if (!automata.transitions) {
    errors.push("Automata must have transitions defined");
  }

  // Validate start state exists in states
  if (automata.start && automata.states && !automata.states.includes(automata.start)) {
    errors.push(`Start state '${automata.start}' is not in the list of states`);
  }

  // Validate accepting states exist in states
  if (automata.accepting && automata.states) {
    automata.accepting.forEach(state => {
      if (!automata.states.includes(state)) {
        errors.push(`Accepting state '${state}' is not in the list of states`);
      }
    });
  }

  // Validate transitions
  if (automata.transitions && automata.states) {
    Object.keys(automata.transitions).forEach(state => {
      if (!automata.states.includes(state)) {
        errors.push(`Transition from unknown state '${state}'`);
      }
    });
  }

  return errors;
};

// Check if automata is a DFA (deterministic)
export const isDFA = (automata) => {
  if (!automata.transitions) return false;

  for (const state in automata.transitions) {
    for (const symbol in automata.transitions[state]) {
      const next = automata.transitions[state][symbol];
      // If transition leads to multiple states or has epsilon, it's NFA
      if (Array.isArray(next) && next.length > 1) {
        return false;
      }
      if (symbol === 'ε' || symbol === 'epsilon') {
        return false;
      }
    }
  }
  return true;
};

// Get alphabet from transitions
export const extractAlphabet = (transitions) => {
  const alphabet = new Set();
  
  for (const state in transitions) {
    for (const symbol in transitions[state]) {
      if (symbol !== 'ε' && symbol !== 'epsilon') {
        alphabet.add(symbol);
      }
    }
  }
  
  return Array.from(alphabet).sort();
};
