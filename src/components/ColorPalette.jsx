const ColorPalette = ({ colors }) => {
    return (
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
    );
};

export default ColorPalette;