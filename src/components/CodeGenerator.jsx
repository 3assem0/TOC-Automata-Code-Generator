import React, { useState } from 'react';
import { generatePython, generateJavaScript, generateJava } from '../utils/codeGenerators';

/**
 * Code generator and display component
 * Generates code in selected language and provides download functionality
 */
const CodeGenerator = ({ automata }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!automata || !automata.transitions) {
      setGeneratedCode('// No automaton to generate code from');
      return;
    }

    let code = '';
    switch (selectedLanguage) {
      case 'python':
        code = generatePython(automata);
        break;
      case 'javascript':
        code = generateJavaScript(automata);
        break;
      case 'java':
        code = generateJava(automata);
        break;
      default:
        code = '// Unknown language';
    }
    
    setGeneratedCode(code);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const extensions = {
      python: 'py',
      javascript: 'js',
      java: 'java'
    };
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `automaton.${extensions[selectedLanguage]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-generator">
      <h3> Generate Code</h3>
      
      <div className="code-controls">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="language-select"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
        </select>
        
        <button onClick={handleGenerate} className="btn btn-primary">
          Generate
        </button>
        
        {generatedCode && (
          <>
            <button onClick={handleCopy} className="btn btn-secondary">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button onClick={handleDownload} className="btn btn-secondary">
              ⬇️ Download
            </button>
          </>
        )}
      </div>

      {generatedCode && (
        <div className="code-display">
          <pre>
            <code className={`language-${selectedLanguage}`}>
              {generatedCode}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeGenerator;
