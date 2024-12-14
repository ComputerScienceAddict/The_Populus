import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  // Main container style
  const menuButtonStyle = {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    background: 'none',
    border: 'none',
    textTransform: 'uppercase',
  };

  const menuContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: isOpen ? '250px' : '0', // Slide-in effect
    height: '100%',
    backgroundColor: '#f9f9f9',
    overflowX: 'hidden',
    transition: '0.3s ease',
    boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.2)' : 'none',
    zIndex: 1001,
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#333',
    border: 'none',
    background: 'none',
  };

  const menuItemsStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '50px 20px',
    fontFamily: "'Montserrat', sans-serif",
  };

  const menuItemStyle = {
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '500',
    textDecoration: 'none',
    color: '#333',
    transition: 'color 0.3s ease',
  };

  const menuItemHoverStyle = {
    color: '#ff004f',
  };

  // Map menu items to correct paths
  const menuItems = [
    { name: 'Home', path: '/home' },
    { name: 'All News', path: '/all' },
    { name: 'Politics', path: '/politics' },
    { name: 'Business', path: '/business' },
    { name: 'Threads', path: '/threads' }, // Change TheWall to ThreadsPage
  ];

  return (
    <>
      <button style={menuButtonStyle} onClick={() => setIsOpen(true)}>
        ☰ Menu
      </button>
      <div style={menuContainerStyle}>
        <button style={closeButtonStyle} onClick={() => setIsOpen(false)}>
          &times;
        </button>
        <div style={menuItemsStyle}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={menuItemStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = menuItemHoverStyle.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#333')}
              onClick={() => setIsOpen(false)} // Close the menu when clicking a link
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
