import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import MarkmapHooks from './markmap-hooks';
import MarkmapClass from './markmap-class';
import './style.css';

function App() {
  const [type, setType] = useState('hooks');

  const Component = type === 'hooks' ? MarkmapHooks : MarkmapClass;
  return (
    <div className="flex flex-col h-screen p-2">
      <select
        className="border border-gray-400"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="hooks">Hooks</option>
        <option value="class">Class</option>
      </select>
      <Component />
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
