import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  threadList: {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '20px',
  },
  threadBox: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
    marginBottom: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  threadBoxHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  threadTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  createThreadForm: {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default function ThreadBoard() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Load existing threads from local storage
  useEffect(() => {
    const existingThreads = JSON.parse(localStorage.getItem('threads')) || [];
    setThreads(existingThreads);
  }, []);

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newThreadTitle.trim()) {
      alert('Thread title is required!');
      return;
    }

    const newThread = {
      id: Date.now(),
      title: newThreadTitle.trim(),
      comments: [], // Each thread starts with no comments
    };

    const updatedThreads = [newThread, ...threads];
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
    setNewThreadTitle('');
  };

  const handleThreadClick = (thread) => {
    // Navigate to the thread page with the thread details
    navigate('/thread', { state: { thread } });
  };

  return (
    <div style={styles.container}>
      <h1>Thread Board</h1>
      <form style={styles.createThreadForm} onSubmit={handleCreateThread}>
        <input
          type="text"
          placeholder="Enter thread title"
          style={styles.input}
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
        />
        <button
          type="submit"
          style={isButtonHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Create Thread
        </button>
      </form>
      <div style={styles.threadList}>
        {threads.map((thread) => (
          <div
            key={thread.id}
            style={styles.threadBox}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.threadBoxHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.threadBox)}
            onClick={() => handleThreadClick(thread)}
          >
            <h2 style={styles.threadTitle}>{thread.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
