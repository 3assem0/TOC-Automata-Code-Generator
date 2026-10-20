// Code generators for Python, JavaScript, and Java

// Sample inputs built from the automaton's own alphabet, so the demo output is meaningful
const sampleTests = (alphabet) => {
  const syms = alphabet.length ? alphabet : ['a'];
  const joined = syms.join('');
  const tests = ['', ...syms, joined, [...syms].reverse().join(''), joined + joined, syms[0].repeat(3)];
  return [...new Set(tests)];
};
const testList = (alphabet) => sampleTests(alphabet).map(t => `"${t}"`).join(', ');

/**
 * Generate Python code from automata
 */
export const generatePython = (automata) => {
  const { states, alphabet, start, accepting, transitions } = automata;
  
  // Determine if it's a DFA or NFA
  const isNFA = checkIfNFA(transitions);
  
  if (isNFA) {
    return generatePythonNFA(automata);
  } else {
    return generatePythonDFA(automata);
  }
};

const generatePythonDFA = (automata) => {
  const { states, alphabet, start, accepting, transitions } = automata;
  
  let code = `# DFA Implementation\n`;
  code += `# States: ${states.join(', ')}\n`;
  code += `# Alphabet: ${alphabet.join(', ')}\n`;
  code += `# Start: ${start}\n`;
  code += `# Accepting: ${accepting.join(', ')}\n\n`;
  
  code += `def run_automaton(input_string):\n`;
  code += `    """\n`;
  code += `    Run the DFA on the input string.\n`;
  code += `    Returns True if accepted, False otherwise.\n`;
  code += `    """\n`;
  code += `    state = "${start}"\n`;
  code += `    \n`;
  code += `    for symbol in input_string:\n`;
  code += `        # Transition logic\n`;
  
  // Generate transition logic
  let stateIndex = 0;
  for (const state of states) {
    const stateTransitions = transitions[state] || {};
    const ifStmt = stateIndex === 0 ? 'if' : 'elif';
    code += `        ${ifStmt} state == "${state}":\n`;
    
    let symbolIndex = 0;
    let hasTransitions = false;
    for (const symbol of alphabet) {
      if (stateTransitions[symbol]) {
        const nextState = Array.isArray(stateTransitions[symbol]) 
          ? stateTransitions[symbol][0] 
          : stateTransitions[symbol];
        const subIfStmt = symbolIndex === 0 ? 'if' : 'elif';
        code += `            ${subIfStmt} symbol == "${symbol}":\n`;
        code += `                state = "${nextState}"\n`;
        hasTransitions = true;
        symbolIndex++;
      }
    }
    
    if (hasTransitions) {
      code += `            else:\n`;
      code += `                return False  # Invalid symbol\n`;
    } else {
      code += `            return False  # No transitions defined\n`;
    }
    stateIndex++;
  }
  
  code += `    \n`;
  code += `    # Check if final state is accepting\n`;
  code += `    return state in [${accepting.map(s => `"${s}"`).join(', ')}]\n\n`;
  
  code += `# Test examples\n`;
  code += `if __name__ == "__main__":\n`;
  code += `    test_strings = [${testList(alphabet)}]\n`;
  code += `    for test in test_strings:\n`;
  code += `        result = run_automaton(test)\n`;
  code += `        print(f"'{test}' -> {result}")\n`;
  
  return code;
};

const generatePythonNFA = (automata) => {
  const { states, alphabet, start, accepting, transitions } = automata;
  
  let code = `# NFA Implementation\n`;
  code += `# States: ${states.join(', ')}\n`;
  code += `# Alphabet: ${alphabet.join(', ')}\n`;
  code += `# Start: ${start}\n`;
  code += `# Accepting: ${accepting.join(', ')}\n\n`;
  
  code += `def epsilon_closure(states_set, transitions):\n`;
  code += `    """Compute epsilon closure of a set of states."""\n`;
  code += `    closure = set(states_set)\n`;
  code += `    stack = list(states_set)\n`;
  code += `    \n`;
  code += `    while stack:\n`;
  code += `        state = stack.pop()\n`;
  code += `        if state in transitions and 'ε' in transitions[state]:\n`;
  code += `            epsilon_states = transitions[state]['ε']\n`;
  code += `            if not isinstance(epsilon_states, list):\n`;
  code += `                epsilon_states = [epsilon_states]\n`;
  code += `            for eps_state in epsilon_states:\n`;
  code += `                if eps_state not in closure:\n`;
  code += `                    closure.add(eps_state)\n`;
  code += `                    stack.append(eps_state)\n`;
  code += `    return closure\n\n`;
  
  code += `def run_automaton(input_string):\n`;
  code += `    """\n`;
  code += `    Run the NFA on the input string.\n`;
  code += `    Returns True if accepted, False otherwise.\n`;
  code += `    """\n`;
  code += `    transitions = ${JSON.stringify(transitions, null, 8).replace(/"([^"]+)":/g, "'$1':")}\n`;
  code += `    \n`;
  code += `    current_states = epsilon_closure({"${start}"}, transitions)\n`;
  code += `    \n`;
  code += `    for symbol in input_string:\n`;
  code += `        next_states = set()\n`;
  code += `        for state in current_states:\n`;
  code += `            if state in transitions and symbol in transitions[state]:\n`;
  code += `                trans = transitions[state][symbol]\n`;
  code += `                if isinstance(trans, list):\n`;
  code += `                    next_states.update(trans)\n`;
  code += `                else:\n`;
  code += `                    next_states.add(trans)\n`;
  code += `        current_states = epsilon_closure(next_states, transitions)\n`;
  code += `        \n`;
  code += `        if not current_states:\n`;
  code += `            return False\n`;
  code += `    \n`;
  code += `    # Check if any current state is accepting\n`;
  code += `    accepting_states = {${accepting.map(s => `"${s}"`).join(', ')}}\n`;
  code += `    return bool(current_states & accepting_states)\n\n`;
  
  code += `# Test examples\n`;
  code += `if __name__ == "__main__":\n`;
  code += `    test_strings = [${testList(alphabet)}]\n`;
  code += `    for test in test_strings:\n`;
  code += `        result = run_automaton(test)\n`;
  code += `        print(f"'{test}' -> {result}")\n`;
  
  return code;
};

/**
 * Generate JavaScript code from automata
 */
export const generateJavaScript = (automata) => {
  const { states, alphabet, start, accepting, transitions } = automata;
  
  const isNFA = checkIfNFA(transitions);
  
  if (isNFA) {
    return generateJavaScriptNFA(automata);
  } else {
    return generateJavaScriptDFA(automata);
  }
};

const generateJavaScriptDFA = (automata) => {
  const { states, alphabet, start, accepting, transitions } = automata;
  
  let code = `// DFA Implementation\n`;
  code += `// States: ${states.join(', ')}\n`;
  code += `// Alphabet: ${alphabet.join(', ')}\n`;
  code += `// Start: ${start}\n`;
  code += `// Accepting: ${accepting.join(', ')}\n\n`;
  
  code += `function runAutomaton(inputString) {\n`;
  code += `  /**\n`;
  code += `   * Run the DFA on the input string.\n`;
  code += `   * Returns true if accepted, false otherwise.\n`;
  code += `   */\n`;
  code += `  let state = "${start}";\n`;
  code += `  \n`;
  code += `  for (const symbol of inputString) {\n`;
  code += `    // Transition logic\n`;
  
  // Generate transition logic
  let stateIndex = 0;
  for (const state of states) {
    const stateTransitions = transitions[state] || {};
    const ifStmt = stateIndex === 0 ? 'if' : 'else if';
    code += `    ${ifStmt} (state === "${state}") {\n`;
    
    let symbolIndex = 0;
    let hasTransitions = false;
    for (const symbol of alphabet) {
      if (stateTransitions[symbol]) {
        const nextState = Array.isArray(stateTransitions[symbol]) 
          ? stateTransitions[symbol][0] 
          : stateTransitions[symbol];
        const subIfStmt = symbolIndex === 0 ? 'if' : 'else if';
        code += `      ${subIfStmt} (symbol === "${symbol}") {\n`;
        code += `        state = "${nextState}";\n`;
        code += `      } `;
        hasTransitions = true;
        symbolIndex++;
      }
    }
    
    if (hasTransitions) {
      code += `else {\n`;
      code += `        return false; // Invalid symbol\n`;
      code += `      }\n`;
    } else {
      code += `      return false; // No transitions defined\n`;
    }
    code += `    }\n`;
    stateIndex++;
  }
  
  code += `  }\n`;
  code += `  \n`;
  code += `  // Check if final state is accepting\n`;
  code += `  return [${accepting.map(s => `"${s}"`).join(', ')}].includes(state);\n`;
  code += `}\n\n`;
  
  code += `// Test examples\n`;
  code += `const testStrings = [${testList(alphabet)}];\n`;
  code += `testStrings.forEach(test => {\n`;
  code += `  const result = runAutomaton(test);\n`;
  code += `  console.log(\`'\${test}' -> \${result}\`);\n`;
  code += `});\n`;
  
  return code;
};

const generateJavaScriptNFA = (automata) => {
  const { states, alphabet, start, accepting, transitions } = automata;
  
  let code = `// NFA Implementation\n`;
  code += `// States: ${states.join(', ')}\n`;
  code += `// Alphabet: ${alphabet.join(', ')}\n`;
  code += `// Start: ${start}\n`;
  code += `// Accepting: ${accepting.join(', ')}\n\n`;
  
  code += `function epsilonClosure(statesSet, transitions) {\n`;
  code += `  /**\n`;
  code += `   * Compute epsilon closure of a set of states.\n`;
  code += `   */\n`;
  code += `  const closure = new Set(statesSet);\n`;
  code += `  const stack = [...statesSet];\n`;
  code += `  \n`;
  code += `  while (stack.length > 0) {\n`;
  code += `    const state = stack.pop();\n`;
  code += `    if (transitions[state] && transitions[state]['ε']) {\n`;
  code += `      let epsilonStates = transitions[state]['ε'];\n`;
  code += `      if (!Array.isArray(epsilonStates)) {\n`;
  code += `        epsilonStates = [epsilonStates];\n`;
  code += `      }\n`;
  code += `      for (const epsState of epsilonStates) {\n`;
  code += `        if (!closure.has(epsState)) {\n`;
  code += `          closure.add(epsState);\n`;
  code += `          stack.push(epsState);\n`;
  code += `        }\n`;
  code += `      }\n`;
  code += `    }\n`;
  code += `  }\n`;
  code += `  return closure;\n`;
  code += `}\n\n`;
  
  code += `function runAutomaton(inputString) {\n`;
  code += `  /**\n`;
  code += `   * Run the NFA on the input string.\n`;
  code += `   * Returns true if accepted, false otherwise.\n`;
  code += `   */\n`;
  code += `  const transitions = ${JSON.stringify(transitions, null, 2)};\n`;
  code += `  \n`;
  code += `  let currentStates = epsilonClosure(new Set(["${start}"]), transitions);\n`;
  code += `  \n`;
  code += `  for (const symbol of inputString) {\n`;
  code += `    const nextStates = new Set();\n`;
  code += `    for (const state of currentStates) {\n`;
  code += `      if (transitions[state] && transitions[state][symbol]) {\n`;
  code += `        const trans = transitions[state][symbol];\n`;
  code += `        if (Array.isArray(trans)) {\n`;
  code += `          trans.forEach(s => nextStates.add(s));\n`;
  code += `        } else {\n`;
  code += `          nextStates.add(trans);\n`;
  code += `        }\n`;
  code += `      }\n`;
  code += `    }\n`;
  code += `    currentStates = epsilonClosure(nextStates, transitions);\n`;
  code += `    \n`;
  code += `    if (currentStates.size === 0) {\n`;
  code += `      return false;\n`;
  code += `    }\n`;
  code += `  }\n`;
  code += `  \n`;
  code += `  // Check if any current state is accepting\n`;
  code += `  const acceptingStates = new Set([${accepting.map(s => `"${s}"`).join(', ')}]);\n`;
  code += `  for (const state of currentStates) {\n`;
  code += `    if (acceptingStates.has(state)) {\n`;
  code += `      return true;\n`;
  code += `    }\n`;
  code += `  }\n`;
  code += `  return false;\n`;
  code += `}\n\n`;
  
  code += `// Test examples\n`;
  code += `const testStrings = [${testList(alphabet)}];\n`;
  code += `testStrings.forEach(test => {\n`;
  code += `  const result = runAutomaton(test);\n`;
  code += `  console.log(\`'\${test}' -> \${result}\`);\n`;
  code += `});\n`;
  
  return code;
};

/**
 * Generate Java code from automata
 */
export const generateJava = (automata) => {
  const { states, alphabet, start, accepting, transitions } = automata;
  
  const isNFA = checkIfNFA(transitions);
  
  if (isNFA) {
    return generateJavaNFA(automata);
  } else {
    return generateJavaDFA(automata);
  }
};

const generateJavaDFA = (automata) => {
  const { states, alphabet, start, accepting, transitions } = automata;
  
  let code = `// DFA Implementation\n`;
  code += `// States: ${states.join(', ')}\n`;
  code += `// Alphabet: ${alphabet.join(', ')}\n`;
  code += `// Start: ${start}\n`;
  code += `// Accepting: ${accepting.join(', ')}\n\n`;
  
  code += `import java.util.*;\n\n`;
  code += `public class DFA {\n`;
  code += `    /**\n`;
  code += `     * Run the DFA on the input string.\n`;
  code += `     * Returns true if accepted, false otherwise.\n`;
  code += `     */\n`;
  code += `    public static boolean runAutomaton(String inputString) {\n`;
  code += `        String state = "${start}";\n`;
  code += `        \n`;
  code += `        for (char c : inputString.toCharArray()) {\n`;
  code += `            String symbol = String.valueOf(c);\n`;
  code += `            \n`;
  code += `            // Transition logic\n`;
  code += `            boolean transitioned = false;\n`;
  code += `            \n`;
  
  // Generate transition logic
  let stateIndex = 0;
  for (const s of states) { // Renamed 'state' to 's' to avoid conflict with 'state' variable in generated Java code
    const stateTransitions = transitions[s] || {};
    const ifStmt = stateIndex === 0 ? "if" : "else if";
    code += `            ${ifStmt} (state.equals("${s}")) {\n`;
    
    let symbolIndex = 0;
    let hasTransitions = false;
    for (const sym of alphabet) { // Renamed 'symbol' to 'sym' to avoid conflict with 'symbol' variable in generated Java code
      if (stateTransitions[sym]) {
        const nextState = Array.isArray(stateTransitions[sym]) 
          ? stateTransitions[sym][0] 
          : stateTransitions[sym];
        const subIfStmt = symbolIndex === 0 ? "if" : "else if";
        code += `                ${subIfStmt} (symbol.equals("${sym}")) {\n`;
        code += `                    state = "${nextState}";\n`;
        code += `                    transitioned = true;\n`; // Mark as transitioned
        code += `                } `;
        hasTransitions = true;
        symbolIndex++;
      }
    }
    
    if (hasTransitions) {
      code += `else {\n`;
      code += `                    return false; // Invalid symbol for this state\n`;
      code += `                }\n`;
    } else {
      code += `                return false; // No transitions defined for this state\n`;
    }
    code += `            }\n`;
    stateIndex++;
  }
  
  code += `            if (!transitioned) {\n`;
  code += `                return false; // No transition found for current state and symbol\n`;
  code += `            }\n`;
  code += `        }\n`;
  code += `        \n`;
  code += `        // Check if final state is accepting\n`;
  code += `        Set<String> acceptingStates = new HashSet<>(Arrays.asList(${accepting.map(s => `"${s}"`).join(', ')}));\n`;
  code += `        return acceptingStates.contains(state);\n`;
  code += `    }\n\n`;
  
  code += `    public static void main(String[] args) {\n`;
  code += `        String[] testStrings = {${testList(alphabet)}};\n`;
  code += `        for (String test : testStrings) {\n`;
  code += `            boolean result = runAutomaton(test);\n`;
  code += `            System.out.println("'" + test + "' -> " + result);\n`;
  code += `        }\n`;
  code += `    }\n`;
  code += `}\n`;
  
  return code;
};

const generateJavaNFA = (automata) => {
  const { states, alphabet, start, accepting, transitions } = automata;
  
  let code = `// NFA Implementation\n`;
  code += `// States: ${states.join(', ')}\n`;
  code += `// Alphabet: ${alphabet.join(', ')}\n`;
  code += `// Start: ${start}\n`;
  code += `// Accepting: ${accepting.join(', ')}\n\n`;
  
  code += `import java.util.*;\n\n`;
  code += `public class NFA {\n`;
  code += `    private static Map<String, Map<String, Object>> transitions;\n\n`;
  
  code += `    static {\n`;
  code += `        transitions = new HashMap<>();\n`;
  // Index-based variable names: state names aren't always valid Java identifiers (e.g. "s-1", "2")
  states.forEach((state, i) => {
    if (transitions[state]) {
      const varName = `trans${i}`;
      code += `        Map<String, Object> ${varName} = new HashMap<>();\n`;
      for (const symbol in transitions[state]) {
        const next = transitions[state][symbol];
        if (Array.isArray(next)) {
          code += `        ${varName}.put("${symbol}", Arrays.asList(${next.map(s => `"${s}"`).join(', ')}));\n`;
        } else {
          code += `        ${varName}.put("${symbol}", "${next}");\n`;
        }
      }
      code += `        transitions.put("${state}", ${varName});\n`;
    }
  });
  code += `    }\n\n`;
  
  code += `    private static Set<String> epsilonClosure(Set<String> statesSet) {\n`;
  code += `        Set<String> closure = new HashSet<>(statesSet);\n`;
  code += `        Stack<String> stack = new Stack<>();\n`;
  code += `        stack.addAll(statesSet);\n`;
  code += `        \n`;
  code += `        while (!stack.isEmpty()) {\n`;
  code += `            String state = stack.pop();\n`;
  code += `            if (transitions.containsKey(state) && transitions.get(state).containsKey("ε")) {\n`;
  code += `                Object epsObj = transitions.get(state).get("ε");\n`;
  code += `                List<String> epsilonStates = new ArrayList<>();\n`;
  code += `                if (epsObj instanceof List) {\n`;
  code += `                    epsilonStates = (List<String>) epsObj;\n`;
  code += `                } else {\n`;
  code += `                    epsilonStates.add((String) epsObj);\n`;
  code += `                }\n`;
  code += `                for (String epsState : epsilonStates) {\n`;
  code += `                    if (!closure.contains(epsState)) {\n`;
  code += `                        closure.add(epsState);\n`;
  code += `                        stack.push(epsState);\n`;
  code += `                    }\n`;
  code += `                }\n`;
  code += `            }\n`;
  code += `        }\n`;
  code += `        return closure;\n`;
  code += `    }\n\n`;
  
  code += `    public static boolean runAutomaton(String inputString) {\n`;
  code += `        Set<String> currentStates = epsilonClosure(new HashSet<>(Arrays.asList("${start}")));\n`;
  code += `        \n`;
  code += `        for (char c : inputString.toCharArray()) {\n`;
  code += `            String symbol = String.valueOf(c);\n`;
  code += `            Set<String> nextStates = new HashSet<>();\n`;
  code += `            \n`;
  code += `            for (String state : currentStates) {\n`;
  code += `                if (transitions.containsKey(state) && transitions.get(state).containsKey(symbol)) {\n`;
  code += `                    Object transObj = transitions.get(state).get(symbol);\n`;
  code += `                    if (transObj instanceof List) {\n`;
  code += `                        nextStates.addAll((List<String>) transObj);\n`;
  code += `                    } else {\n`;
  code += `                        nextStates.add((String) transObj);\n`;
  code += `                    }\n`;
  code += `                }\n`;
  code += `            }\n`;
  code += `            \n`;
  code += `            currentStates = epsilonClosure(nextStates);\n`;
  code += `            if (currentStates.isEmpty()) {\n`;
  code += `                return false;\n`;
  code += `            }\n`;
  code += `        }\n`;
  code += `        \n`;
  code += `        Set<String> acceptingStates = new HashSet<>(Arrays.asList(${accepting.map(s => `"${s}"`).join(', ')}));\n`;
  code += `        for (String state : currentStates) {\n`;
  code += `            if (acceptingStates.contains(state)) {\n`;
  code += `                return true;\n`;
  code += `            }\n`;
  code += `        }\n`;
  code += `        return false;\n`;
  code += `    }\n\n`;
  
  code += `    public static void main(String[] args) {\n`;
  code += `        String[] testStrings = {${testList(alphabet)}};\n`;
  code += `        for (String test : testStrings) {\n`;
  code += `            boolean result = runAutomaton(test);\n`;
  code += `            System.out.println("'" + test + "' -> " + result);\n`;
  code += `        }\n`;
  code += `    }\n`;
  code += `}\n`;
  
  return code;
};

/**
 * Helper function to check if automata is NFA
 */
const checkIfNFA = (transitions) => {
  for (const state in transitions) {
    for (const symbol in transitions[state]) {
      // Check for epsilon transitions
      if (symbol === 'ε' || symbol === 'epsilon') {
        return true;
      }
      // Check for multiple next states
      const next = transitions[state][symbol];
      if (Array.isArray(next) && next.length > 1) {
        return true;
      }
    }
  }
  return false;
};
