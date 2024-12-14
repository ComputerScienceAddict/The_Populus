import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const styles = {
  // Your styles from the provided code
};

export default function ThreadPagePostComments() {
  const location = useLocation();
  const post = location.state?.post;

  const [replies, setReplies] = useState(post?.replies || []);
  const [newReply, setNewReply] = useState('');

  const handleAddReply = () => {
    if (!newReply.trim()) {
      alert('Reply cannot be empty!');
      return;
    }

    const reply = {
      id: Date.now(),
      text: newReply.trim(),
      username: 'CurrentUser', // Replace with actual user info
      avatar: 'http://localhost:5000/images/default-avatar.png', // Replace with user's avatar
      timestamp: new Date().toLocaleString(),
    };

    setReplies([reply, ...replies]);
    setNewReply('');

    // Optionally, update the replies in local storage or backend
  };

  return (
    <div style={styles.container}>
      <div style={styles.postBox}>
        <div style={styles.postHeader}>
          <img
            src={post?.profilePicture || 'http://localhost:5000/images/default-avatar.png'}
            alt="Avatar"
            style={styles.avatar}
          />
          <div>
            <div style={styles.username}>{post?.username || 'Anonymous'}</div>
            <div style={styles.timestamp}>{post?.timestamp}</div>
          </div>
        </div>
        <div style={styles.postContent}>{post?.text}</div>
      </div>
      <div style={styles.commentInputBox}>
        <input
          type="text"
          placeholder="Write a reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          style={styles.commentInput}
        />
        <button onClick={handleAddReply} style={styles.commentButton}>
          Reply
        </button>
      </div>
      <div style={styles.commentsSection}>
        {replies.map((reply) => (
          <div key={reply.id} style={styles.commentItem}>
            <img
              src={reply.avatar}
              alt="Avatar"
              style={styles.commentAvatar}
            />
            <div style={styles.commentContent}>
              <div style={styles.commentUsername}>{reply.username}</div>
              <div style={styles.commentText}>{reply.text}</div>
              <div style={styles.commentTimestamp}>{reply.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
