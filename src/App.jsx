import React, { useState, useEffect } from 'react';
import './App.css';
import ColorPalette from './components/ColorPalette';
import ColorForm from './components/ColorForm';
import ColorSuccess from './components/ColorSuccess';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL";

function App() {
  const [name, setName] = useState('');
  const [assigned, setAssigned] = useState(() => JSON.parse(localStorage.getItem('assigned')) || null);
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!assigned) {
      loadColors();
    }
  }, [assigned]);

  const loadColors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      setColors(data);
    } catch (err) {
      setError('Failed to load colors. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ name });
      const res = await fetch(SCRIPT_URL, {
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

  const handleReset = () => {
    localStorage.removeItem('assigned');
    setAssigned(null);
    setName('');
    loadColors();
  };

  if (assigned) {
    return <ColorSuccess assigned={assigned} onReset={handleReset} />;
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Choose Your Color</h1>
        <p className="subtitle">Enter your name to get a unique color assignment</p>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        <ColorPalette colors={colors} />

        <ColorForm
          name={name}
          onNameChange={(e) => setName(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;