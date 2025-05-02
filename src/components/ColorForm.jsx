import React from 'react';

const ColorForm = ({ name, onNameChange, onSubmit, isLoading }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="input-group">
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={name} 
        onChange={onNameChange}
        onKeyPress={handleKeyPress}
        className="name-input"
      />
      <button 
        onClick={onSubmit}
        className="submit-btn"
        disabled={isLoading}
      >
        {isLoading ? 'Assigning...' : 'Get My Color'}
      </button>
    </div>
  );
};

export default ColorForm;