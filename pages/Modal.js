import React, { useState } from 'react';

export default function Modal({ show, article, onClose }) {
  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '85vh',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    display: show ? 'flex' : 'none',
    flexDirection: 'column',
    zIndex: 1000,
    transition: 'box-shadow 0.3s ease',
  };

  const modalHoverStyle = {
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
  };

  const headerStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '15px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
  };

  const imageStyle = {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ddd',
  };

  const contentContainerStyle = {
    padding: '20px',
    overflowY: 'auto',
    flexGrow: 1,
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
    lineHeight: '1.3',
    textAlign: 'center',
  };

  const contentStyle = {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '15px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '15px 0',
    borderTop: '1px solid #eee',
    backgroundColor: '#f9f9f9',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 25px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isWallifyHovered, setIsWallifyHovered] = useState(false);
  const [isModalHovered, setIsModalHovered] = useState(false);

  const [showWallifyModal, setShowWallifyModal] = useState(false);
  const [comment, setComment] = useState('');

  const handleWallifySubmit = () => {
    if (!comment.trim()) {
      alert('Please enter a comment before submitting!');
      return;
    }

    const wallPost = {
      id: Date.now(),
      title: article.Title,
      content: article.Full_Article_Text,
      comment: comment.trim(),
      timestamp: new Date().toLocaleString(),
    };

    // Save to localStorage or backend
    const existingPosts = JSON.parse(localStorage.getItem('wallPosts')) || [];
    localStorage.setItem('wallPosts', JSON.stringify([wallPost, ...existingPosts]));

    alert('Post added to The Wall!');
    setComment('');
    setShowWallifyModal(false);
  };

  return show ? (
    <>
      {/* Main Modal */}
      <div
        style={isModalHovered ? { ...modalStyle, ...modalHoverStyle } : modalStyle}
        onMouseEnter={() => setIsModalHovered(true)}
        onMouseLeave={() => setIsModalHovered(false)}
      >
        {/* Article Details */}
        <div style={headerStyle}>{article.Title}</div>
        {article.Image_path_link_url ? (
          <img src={article.Image_path_link_url} alt={article.Title} style={imageStyle} />
        ) : (
          <div style={{ ...imageStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
            No Image Available
          </div>
        )}
        <div style={contentContainerStyle}>
          <h2 style={titleStyle}>{article.Title}</h2>
          <div style={contentStyle}>{article.Full_Article_Text}</div>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            style={isHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClose}
          >
            Close
          </button>
          <button
            style={isWallifyHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={() => setIsWallifyHovered(true)}
            onMouseLeave={() => setIsWallifyHovered(false)}
            onClick={() => setShowWallifyModal(true)}
          >
            Wallify
          </button>
        </div>
      </div>

      {/* Wallify Modal */}
      {showWallifyModal && (
        <div
          style={{
            ...modalStyle,
            zIndex: 1001,
            padding: '20px',
            display: 'block',
          }}
        >
          <h2 style={titleStyle}>Share Your Thoughts</h2>
          <textarea
            placeholder="What are your thoughts on this article?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              height: '100px',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              marginBottom: '15px',
            }}
          ></textarea>
          <div style={buttonContainerStyle}>
            <button
              style={isHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setShowWallifyModal(false)}
            >
              Cancel
            </button>
            <button
              style={isWallifyHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
              onMouseEnter={() => setIsWallifyHovered(true)}
              onMouseLeave={() => setIsWallifyHovered(false)}
              onClick={handleWallifySubmit}
            >
              Post to The Wall
            </button>
          </div>
        </div>
      )}
    </>
  ) : null;
}
