#  Automata Code Generator - Project Overview

## What is this website?
The **Automata Code Generator** is a powerful, interactive web application designed to help students, developers, and computer science enthusiasts design, test, and implement **Finite Automata** (DFA/NFA) visually.

Instead of writing complex state machine logic by hand, you can simply **draw** your automaton on a canvas and let the tool generate the code for you!

##  Key Features

### 1. Visual Automata Editor
- **Interactive Canvas**: Click and drag to move states.
- **Add/Remove States**: Easily create new states (e.g., `q0`, `q1`) and remove them.
- **Draw Transitions**: Connect states with drag-and-drop lines to define transitions.
- **Epsilon Transitions**: Support for NFA (Non-Deterministic Finite Automata) with `ε` transitions.
- **Start & Accepting States**: Mark states as "Start" or "Accepting" with a single click.

### 2. Real-Time Simulation
- **Test Your Design**: Enter any input string (e.g., `10101`) to see if your automaton accepts or rejects it.
- **Step-by-Step Visualization**: Watch the simulator highlight the active states as it processes each character of your input.
- **Instant Feedback**: Get clear "ACCEPTED" or "REJECTED" results with detailed error messages if something goes wrong.

### 3. Multi-Language Code Generation
- **Auto-Generate Code**: Instantly convert your visual design into working code.
- **Supported Languages**:
  -  **Python**: Clean, class-based implementation.
  -  **JavaScript**: Ready-to-use function for web or Node.js.
  -  **Java**: Object-oriented implementation for enterprise use.
- **Downloadable**: Copy the code to your clipboard or download it as a file.

### 4. Export & Share
- **Save as JSON**: Export your automaton structure to save your work and load it later.
- **Export as PNG**: Download a high-quality image of your diagram for reports or presentations.

##  How to Use

1.  **Design**: Use the **Controls** panel to add states. Click on a state to set it as "Start" or "Accepting". Drag between states to add transitions.
2.  **Test**: Go to the **Test Automaton** panel, type an input string, and click "Run". Use "Next" and "Previous" to step through the execution.
3.  **Generate**: Select your desired language in the **Generate Code** panel and copy the result.
4.  **Export**: Use the **Export** buttons to save your work as an image or a data file.

---
*Built with React, React Flow, and modern web technologies.*
