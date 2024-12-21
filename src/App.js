import './App.css';
import React, { useState } from "react";
import schema from "./schema";
import DynamicFormGenerator from "./DynamicFormGenerator";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (data) => {
    alert(`Form Submitted: ${JSON.stringify(data, null, 2)}`);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleDarkMode} 
          className={`py-2 px-4 rounded-full ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
      <DynamicFormGenerator schema={schema} onSubmit={handleSubmit} darkMode={darkMode} />
    </div>
  );
}

export default App;