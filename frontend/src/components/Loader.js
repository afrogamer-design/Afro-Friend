import React from 'react';

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: '#666' }}>Loading gamers...</p>
    </div>
  );
};

export default Loader;