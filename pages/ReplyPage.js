import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#F7F9F9',
    minHeight: '100vh',
  },
  postBox: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '600px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  replyInputContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
    width: '100%',
    maxWidth: '600px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  replyInputRow: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  replyInputAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  replyInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    padding: '10px',
    resize: 'none',
    backgroundColor: 'transparent',
    borderBottom: '1px solid #ddd',
    marginBottom: '10px',
    fontFamily: 'Arial, sans-serif',
  },
  replyActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  actionIcons: {
    display: 'flex',
    gap: '10px',
    color: '#1DA1F2',
    fontSize: '18px',
    cursor: 'pointer',
  },
  replyButton: {
    padding: '8px 16px',
    backgroundColor: '#1DA1F2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: 'bold',
  },
  replyButtonDisabled: {
    backgroundColor: '#AAB8C2',
    cursor: 'not-allowed',
  },
  replyBox: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
    marginBottom: '15px',
    maxWidth: '600px',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  commentContent: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.5',
  },
  timestamp: {
    fontSize: '12px',
    color: '#888',
  },
};

export default function ReplyPage() {
  const location = useLocation();
  const post = location.state?.comment;

  const [replies, setReplies] = useState(() => {
    if (post && post.id) {
      const storedReplies = JSON.parse(localStorage.getItem(`replies-${post.id}`)) || [];
      return storedReplies;
    }
    return [];
  });
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    if (post && post.id) {
      localStorage.setItem(`replies-${post.id}`, JSON.stringify(replies));
    }
  }, [replies, post]);

  const handleAddReply = () => {
    if (!newReply.trim()) {
      alert('Reply cannot be empty!');
      return;
    }

    const newReplyObject = {
      id: Date.now(),
      text: newReply.trim(),
      timestamp: new Date().toLocaleString(),
      profilePicture: post?.profilePicture || 'http://localhost:5000/images/default-avatar.png',
    };

    setReplies((prevReplies) => [...prevReplies, newReplyObject]);
    setNewReply('');
  };

  if (!post) {
    return <div style={styles.container}>No post selected!</div>;
  }

  return (
    <div style={styles.container}>
      {/* Display Original Post */}
      <div style={styles.postBox}>
        <div style={styles.commentHeader}>
          <img
            src={post.profilePicture || 'http://localhost:5000/images/default-avatar.png'}
            alt="Avatar"
            style={styles.avatar}
          />
          <div>
            <strong>{post.username || 'Anonymous'}</strong>
            <div style={styles.timestamp}>{post.timestamp}</div>
          </div>
        </div>
        <p style={styles.commentContent}>{post.text}</p>
      </div>

      {/* Reply Input */}
      <div style={styles.replyInputContainer}>
        <div style={styles.replyInputRow}>
          <img
            src={post.profilePicture || 'http://localhost:5000/images/default-avatar.png'}
            alt="Avatar"
            style={styles.replyInputAvatar}
          />
          <textarea
            style={styles.replyInput}
            placeholder="What's happening?"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            rows={2}
          />
        </div>
        <div style={styles.replyActions}>
          <div style={styles.actionIcons}>
            <i className="fas fa-image"></i>
            <i className="fas fa-gif"></i>
            <i className="fas fa-poll"></i>
            <i className="fas fa-smile"></i>
            <i className="fas fa-calendar"></i>
          </div>
          <button
            style={
              newReply.trim()
                ? styles.replyButton
                : { ...styles.replyButton, ...styles.replyButtonDisabled }
            }
            onClick={handleAddReply}
            disabled={!newReply.trim()}
          >
            Reply
          </button>
        </div>
      </div>

      {/* Display Replies */}
      <div>
        {replies.map((reply) => (
          <div key={reply.id} style={styles.replyBox}>
            <div style={styles.commentHeader}>
              <img
                src={reply.profilePicture}
                alt="Avatar"
                style={styles.avatar}
              />
              <div>
                <strong>{reply.username || 'Anonymous'}</strong>
                <div style={styles.timestamp}>{reply.timestamp}</div>
              </div>
            </div>
            <p style={styles.commentContent}>{reply.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
