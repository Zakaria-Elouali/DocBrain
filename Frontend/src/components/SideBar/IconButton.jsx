import React from 'react';

export const IconButton = ({ icon, title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`nav-button ${isActive ? 'active' : ''}`}
        title={title}
    >
        {icon}
    </button>
);
