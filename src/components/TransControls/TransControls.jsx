import React from 'react';

const TransControls = ({ scale, position, rotation, onChange }) => {
  const handleInputChange = (type, axis, event) => {
    const value = parseFloat(event.target.value) || 0;
    onChange(type, axis, value);
  };

  return (
    <div>
      <h4>Transformation Controls</h4>
      <div>
        <label>Scale:</label>
        {['x', 'y', 'z'].map(axis => (
          <input
            key={axis}
            type="number"
            step="0.1"
            value={scale?.[axis] || 1}
            onChange={(e) => handleInputChange('scale', axis, e)}
          />
        ))}
      </div>
      <div>
        <label>Position:</label>
        {['x', 'y', 'z'].map(axis => (
          <input
            key={axis}
            type="number"
            step="0.1"
            value={position?.[axis] || 0}
            onChange={(e) => handleInputChange('position', axis, e)}
          />
        ))}
      </div>
      <div>
        <label>Rotation:</label>
        {['x', 'y', 'z'].map(axis => (
          <input
            key={axis}
            type="number"
            step="0.1"
            value={rotation?.[axis] || 0}
            onChange={(e) => handleInputChange('rotation', axis, e)}
          />
        ))}
      </div>
    </div>
  );
};

export default TransControls;
