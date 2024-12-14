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
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    resize: 'none',
    padding: '10px',
    backgroundColor: 'transparent',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
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
    alignItems: 'flex-start',
  },
  commentContent: {
    marginLeft: '10px',
    flex: 1,
  },
  commentSection: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '10px',
  },
  articleTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  articleText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  articleImage: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
    marginTop: '10px',
  },
  postMeta: {
    fontSize: '12px',
    color: '#888',
    marginTop: '10px',
  },
};

export default function TheWall() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialArticle = location.state?.article || null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedAffiliation, setSelectedAffiliation] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    const existingPosts = JSON.parse(localStorage.getItem('wallPosts')) || [];
    setPosts(existingPosts);

    if (initialArticle) {
      setTitle(initialArticle.title); // Set the title if coming from an article
    } else {
      setTitle(''); // Reset the title if not commenting on an article
    }
  }, [initialArticle]);

  const handleAffiliationChange = (e) => {
    const affiliation = e.target.value;
    setSelectedAffiliation(affiliation);

    // Set profile picture based on the selected affiliation
    const profilePictures = {
      Republican: 'http://localhost:5000/images/45_donald_trump.webp',
      Democrat: 'http://localhost:5000/images/Official-portrait-of-vice-president-Kamala-Harris.webp',
      Independent: 'http://localhost:5000/images/51rnZEWzlBL.jpg',
    };
    setProfilePicture(profilePictures[affiliation] || '');
  };

  const handleAddPost = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('Content is required!');
      return;
    }

    const newPost = {
      id: Date.now(),
      articleTitle: title || 'General Thought', // Use "General Thought" if no title is set
      content: content.trim(),
      timestamp: new Date().toLocaleString(),
      articleImage: title ? initialArticle?.imageUrl : null, // Only include the image if there is a title
      articleText: title ? initialArticle?.description || 'No description available.' : null, // Only include description if there is a title
      profilePicture: profilePicture || 'http://localhost:5000/images/default-avatar.png', // Default if no affiliation selected
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('wallPosts', JSON.stringify(updatedPosts));
    setContent('');
    setTitle(''); // Reset the title after posting

    // Redirect to the main Wall page
    navigate('/thewall');
  };

  return (
    <div style={styles.container}>
      <h1>{initialArticle ? `Comment on: ${title}` : 'Share Your Thoughts'}</h1>
      <form style={styles.form} onSubmit={handleAddPost}>
        <select
          style={styles.select}
          value={selectedAffiliation}
          onChange={handleAffiliationChange}
        >
          <option value="">Select Affiliation</option>
          <option value="Republican">Republican</option>
          <option value="Democrat">Democrat</option>
          <option value="Independent">Independent</option>
        </select>
        <textarea
          style={styles.textarea}
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" style={styles.postButton}>
          Post
        </button>
      </form>
      <div style={styles.postContainer}>
        {posts.map((post) => (
          <div key={post.id} style={styles.postBox}>
            <img
              src={post.profilePicture}
              alt="Profile"
              style={styles.avatar}
            />
            <div style={styles.commentContent}>
              <div style={styles.commentSection}>
                <strong>Comment:</strong> {post.content}
              </div>
              {post.articleTitle && post.articleImage && (
                <>
                  <h3 style={styles.articleTitle}>{post.articleTitle}</h3>
                  <p style={styles.articleText}>{post.articleText}</p>
                  <img
                    src={post.articleImage}
                    alt={post.articleTitle}
                    style={styles.articleImage}
                  />
                </>
              )}
              <div style={styles.postMeta}>Posted on {post.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
