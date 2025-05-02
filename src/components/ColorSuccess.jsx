import React from 'react';

const ColorSuccess = ({ assigned, onReset }) => {
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
                    onClick={onReset}
                >
                    Choose Another Color
                </button>
            </div>
        </div>
    );
};

export default ColorSuccess;