import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Menu from './Menu';

export default function MaskHead() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname); // Initialize active link based on current path

  useEffect(() => {
    // Update activeLink whenever the location changes
    setActiveLink(location.pathname);
  }, [location]);

  // Main container style
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    position: 'relative',
  };

  // Menu button container
  const menuButtonContainerStyle = {
    position: 'absolute',
    top: '5px',
    left: '10px',
  };

  // Website title style
  const titleStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: '900',
    color: '#ff004f',
    marginBottom: '5px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  };

  // Quote style
  const quoteStyle = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '14px',
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: '10px',
    textAlign: 'center',
    maxWidth: '600px',
  };

  // Navigation links container style
  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  };

  // Navigation links style
  const navItemStyle = (isActive) => ({
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '14px',
    color: isActive ? '#ff004f' : '#333', // Highlight active link
    textDecoration: 'none',
    fontWeight: '500',
    padding: '2px 5px',
    borderBottom: isActive ? '2px solid #ff004f' : 'none', // Add underline for active link
    transition: 'color 0.3s ease, border-bottom 0.3s ease',
  });

  return (
    <div style={containerStyle}>
      {/* Menu Button Positioned at Top Left */}
      <div style={menuButtonContainerStyle}>
        <Menu />
      </div>

      {/* Website Title */}
      <div style={titleStyle}>The Populus</div>
      {/* Navigation Links */}
      <div style={navContainerStyle}>
        {['All', 'New', 'Politics', 'Crypto', 'Business'].map((item, index) => {
          const linkPath = `/${item.toLowerCase().replace(' ', '-')}`;
          return (
            <Link
              key={index}
              to={linkPath}
              style={navItemStyle(activeLink === linkPath)}
            >
              {item}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
