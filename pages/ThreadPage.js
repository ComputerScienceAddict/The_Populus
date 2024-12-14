import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '24px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  textarea: {
    flex: 1,
    width: '100%',
    border: '1px solid #ddd',
    outline: 'none',
    fontSize: '16px',
    resize: 'none',
    padding: '10px',
    backgroundColor: '#fff',
    marginBottom: '10px',
    borderRadius: '4px',
  },
  postButton: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  postContainer: {
    width: '100%',
    maxWidth: '600px',
    marginBottom: '20px',
  },
  postBox: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  commentContent: {
    marginTop: '10px',
    width: '100%',
  },
  commentSection: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '10px',
  },
  postMeta: {
    fontSize: '12px',
    color: '#888',
    marginTop: '10px',
  },
  articlePreview: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    marginBottom: '10px',
  },
  articleImage: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '10px',
  },
  replyButton: {
    marginTop: '5px',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default function ThreadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const thread = location.state?.thread;

  // Initialize global comment storage in localStorage
  const [globalComments, setGlobalComments] = useState(() => {
    const storedGlobalComments = localStorage.getItem('globalComments');
    return storedGlobalComments ? JSON.parse(storedGlobalComments) : [];
  });

  const [comments, setComments] = useState(() => {
    // Initialize comments from localStorage
    if (thread?.id) {
      const storedComments = localStorage.getItem(`comments-${thread.id}`);
      return storedComments ? JSON.parse(storedComments) : thread?.comments || [];
    }
    return [];
  });

  const [newComment, setNewComment] = useState('');
  const [selectedAffiliation, setSelectedAffiliation] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isArticleShared, setIsArticleShared] = useState(true);

  useEffect(() => {
    const profilePictures = {
      Republican: 'http://localhost:5000/images/45_donald_trump.webp',
      Democrat: 'http://localhost:5000/images/Official-portrait-of-vice-president-Kamala-Harris.webp',
      Independent: 'http://localhost:5000/images/51rnZEWzlBL.jpg',
    };
    setProfilePicture(profilePictures[selectedAffiliation] || '');
  }, [selectedAffiliation]);

  useEffect(() => {
    // Save comments to localStorage whenever they update
    if (thread?.id) {
      localStorage.setItem(`comments-${thread.id}`, JSON.stringify(comments));
    }
  }, [comments, thread?.id]);

  useEffect(() => {
    // Save global comments to localStorage
    localStorage.setItem('globalComments', JSON.stringify(globalComments));
  }, [globalComments]);

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }

    const newPost = {
      id: Date.now(),
      text: newComment.trim(),
      timestamp: new Date().toLocaleString(),
      profilePicture: profilePicture || 'http://localhost:5000/images/default-avatar.png',
      article: isArticleShared ? thread?.article || null : null,
      replies: [],
    };

    setComments((prevComments) => {
      const updatedComments = [newPost, ...prevComments];
      localStorage.setItem(`comments-${thread.id}`, JSON.stringify(updatedComments));
      return updatedComments;
    });

    // Add to global comments
    setGlobalComments((prevGlobalComments) => [newPost, ...prevGlobalComments]);

    setNewComment('');
    setIsArticleShared(false);
  };

  const handleReplyNavigate = (comment) => {
    navigate('/reply', { state: { comment } });
  };

  return (
    <div style={styles.container}>
      <h1>{thread?.title}</h1>
      {isArticleShared && thread?.article && (
        <div style={styles.articlePreview}>
          <h3>{thread.article.title}</h3>
          <p>{thread.article.description}</p>
          {thread.article.imageUrl && (
            <img
              src={thread.article.imageUrl}
              alt={thread.article.title}
              style={styles.articleImage}
            />
          )}
        </div>
      )}
      <form style={styles.form} onSubmit={handleAddComment}>
        <select
          style={styles.textarea}
          value={selectedAffiliation}
          onChange={(e) => setSelectedAffiliation(e.target.value)}
        >
          <option value="">Select Affiliation</option>
          <option value="Republican">Republican</option>
          <option value="Democrat">Democrat</option>
          <option value="Independent">Independent</option>
        </select>
        <textarea
          style={styles.textarea}
          placeholder="Enter your comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" style={styles.postButton}>
          Post
        </button>
      </form>
      <div style={styles.postContainer}>
        {comments.map((comment) => (
          <div key={comment.id} style={styles.postBox}>
            <div style={styles.postHeader}>
              <img
                src={comment.profilePicture}
                alt="Profile"
                style={styles.avatar}
              />
              <div style={styles.commentContent}>
                <div style={styles.commentSection}>
                  <strong>Comment:</strong> {comment.text}
                </div>
                <div style={styles.postMeta}>Posted on {comment.timestamp}</div>
              </div>
            </div>
            {comment.article && (
              <div style={styles.articlePreview}>
                <h3>{comment.article.title}</h3>
                <p>{comment.article.description}</p>
                {comment.article.imageUrl && (
                  <img
                    src={comment.article.imageUrl}
                    alt={comment.article.title}
                    style={styles.articleImage}
                  />
                )}
              </div>
            )}
            <button
              style={styles.replyButton}
              onClick={() => handleReplyNavigate(comment)}
            >
              Reply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
