import React, { useState, useEffect } from 'react';
import './App.css';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxjAtbfThvYscQoca9b6CM52QCfiXK4UXrvsF00wbmMVYf9QVZMPhT_BYzpjhcHGCI/exec";

function App() {
  const [name, setName] = useState('');
  const [assigned, setAssigned] = useState(() => JSON.parse(localStorage.getItem('assigned')) || null);
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!assigned) {
      setIsLoading(true);
      fetch(SCRIPT_URL)
        .then(res => res.json())
        .then(data => {
          setColors(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError('Failed to load colors. Please refresh the page.');
          setIsLoading(false);
        });
    }
  }, [assigned]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ name });
      const res = await fetch(`${SCRIPT_URL}`, {
        method: 'POST',
        body: params,
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAssigned(data);
      localStorage.setItem('assigned', JSON.stringify(data));
    } catch (err) {
      setError(err.message || 'Failed to assign color. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (assigned) {
    return (
      <div className="container success-screen">
        <div className="card">
          <h1 className="title">Thanks, {assigned.name}!</h1>
          <div
            className="color-display"
            style={{
              backgroundColor: assigned.hex,
              boxShadow: `0 0 20px ${assigned.hex}66`
            }}
          >
            <span className="color-name">{assigned.color}</span>
            <span className="color-hex">{assigned.hex}</span>
          </div>
          <p className="success-message">Your unique color has been saved.</p>
          <button
            className="reset-btn"
            onClick={() => {
              localStorage.removeItem('assigned');
              setAssigned(null);
            }}
          >
            Choose Another Color
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Choose Your Color</h1>
        <p className="subtitle">Enter your name to get a unique color assignment</p>

        {isLoading && <div className="loader"></div>}
        {error && <div className="error-message">{error}</div>}

        <div className="palette">
          {colors.map(c => (
            <div
              key={c.color}
              className="swatch"
              style={{
                backgroundColor: c.hex,
                transform: `rotate(${Math.random() * 10 - 5}deg)`
              }}
              title={`${c.color} (${c.hex})`}
            >
              <span className="swatch-initial">{c.color[0]}</span>
            </div>
          ))}
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="name-input"
            onKeyPress={e => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Assigning...' : 'Get My Color'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;