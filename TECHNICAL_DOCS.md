#  Technical Documentation - Automata Code Generator

This document provides a technical overview of the **Automata Code Generator** codebase, explaining the file structure, key components, and logic flow.

##  Project Structure

```
TOC project/
├── src/
│   ├── components/       # UI Components
│   │   ├── AutomataEditor.jsx  # Main visual canvas (React Flow)
│   │   ├── ControlPanel.jsx    # Sidebar for managing states/exports
│   │   ├── Simulator.jsx       # Input testing and visualization logic
│   │   ├── CodeGenerator.jsx   # Code preview and download UI
│   │   ├── ExampleLoader.jsx   # Dropdown to load sample automata
│   │   └── StateNode.jsx       # Custom node component for React Flow
│   ├── utils/            # Helper Functions
│   │   ├── codeGenerators.js   # Logic to generate Python/JS/Java code
│   │   ├── automataValidator.js# Validation logic (e.g., checking for start state)
│   │   └── exampleAutomata.js  # Pre-defined JSON data for examples
│   ├── App.jsx           # Main application controller & state manager
│   ├── main.jsx          # Entry point (React DOM rendering)
│   ├── App.css           # Global and component-specific styles
│   └── index.css         # Base styles and CSS variables (Theming)
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite build configuration
```

##  Key Components

### 1. `App.jsx`
- **Role**: The "Brain" of the application.
- **Responsibilities**:
  - Manages the global state of `nodes` and `edges` (using `reactflow` hooks).
  - Maintains the `automata` object (a simplified representation of the graph for logic processing).
  - Handles global actions like "Clear Canvas" and data synchronization between the visual graph and the logical model.

### 2. `AutomataEditor.jsx`
- **Role**: The Visual Interface.
- **Tech**: Built on top of **React Flow**.
- **Responsibilities**:
  - Renders the interactive canvas.
  - Handles drag-and-drop connections.
  - Uses `StateNode.jsx` to render custom-styled circular nodes.
  - Updates visual styles (e.g., highlighting active states during simulation).

### 3. `Simulator.jsx`
- **Role**: The Testing Engine.
- **Logic**:
  - Implements **DFA** (Deterministic) and **NFA** (Non-Deterministic) simulation algorithms.
  - Handles **Epsilon Closures** for NFA traversal.
  - **State**: Tracks `currentStep`, `executionPath`, and `result` (Accepted/Rejected).
  - **Interaction**: Provides "Step Forward/Backward" controls to visualize the path.

### 4. `CodeGenerator.jsx`
- **Role**: The Compiler.
- **Logic**:
  - Takes the `automata` object as input.
  - Calls functions from `utils/codeGenerators.js` to produce stringified code.
  - Provides UI for selecting languages and downloading files.

### 5. `ControlPanel.jsx`
- **Role**: The User Dashboard.
- **Responsibilities**:
  - Inputs for adding new states.
  - Buttons for toggling "Start" and "Accepting" properties on selected nodes.
  - Triggers for JSON and PNG export (using `html-to-image`).

##  Core Logic (`src/utils/`)

### `codeGenerators.js`
Contains pure functions that transform the automata data structure into source code strings.
- `generatePython(automata)`: Creates a Python class with `transition` dictionary.
- `generateJavaScript(automata)`: Creates a JS object and validation function.
- `generateJava(automata)`: Creates a Java class with a `HashMap` for transitions.

### `automataValidator.js`
Ensures the automaton is valid before simulation or generation.
- Checks for: Missing start state, unreachable states, or invalid transitions.

##  Styling & Theming
- **`index.css`**: Defines CSS variables for the color palette (Light AI Theme).
  - `--primary-color`, `--bg-primary`, `--text-primary`, etc.
- **`App.css`**: Contains layout styles (Grid/Flexbox) and component-specific styling (Glassmorphism effects, buttons, inputs).

##  Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Graph Library**: React Flow
- **Styling**: CSS3 (Variables, Flexbox, Grid)
- **Export**: `html-to-image` (for PNG), `file-saver` (implied logic for downloads)
