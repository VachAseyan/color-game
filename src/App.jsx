import React, { useState, useEffect } from 'react';
import './App.css';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxjAtbfThvYscQoca9b6CM52QCfiXK4UXrvsF00wbmMVYf9QVZMPhT_BYzpjhcHGCI/exec";

function App() {
  const [name, setName] = useState('');
  const [assigned, setAssigned] = useState(() => JSON.parse(localStorage.getItem('assigned')) || null);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (!assigned) {
      fetch(SCRIPT_URL)
        .then(res => res.json())
        .then(setColors);
    }
  }, [assigned]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const params = new URLSearchParams({ name });
    const res = await fetch(`${SCRIPT_URL}`, {
      method: 'POST',
      body: params,
    });
    const data = await res.json();
    if (!data.error) {
      setAssigned(data);
      localStorage.setItem('assigned', JSON.stringify(data));
    }
  };

  if (assigned) {
    return (
      <div className="container">
        <h1>Thanks, {assigned.name}!</h1>
        <div className="color-box" style={{ backgroundColor: assigned.hex }}>
          {assigned.color}
        </div>
        <p>Your color has been saved.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Choose Your Color</h1>
      <div className="palette">
        {colors.map(c => (
          <div key={c.color} className="swatch" style={{ backgroundColor: c.hex }}>
            {c.color[0]}
          </div>
        ))}
      </div>
      <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={handleSubmit}>Get My Color</button>
    </div>
  );
}

export default App;
