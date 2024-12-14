import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const styles = {
  pageStyle: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Georgia, serif',
    color: '#333',
    lineHeight: '1.8',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  titleStyle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '15px',
    textAlign: 'center',
  },
  metaStyle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  imageStyle: {
    width: '100%',
    height: 'auto',
    marginBottom: '15px',
    borderRadius: '8px',
  },
  contentStyle: {
    fontSize: '18px',
    color: '#333',
  },
  paragraphStyle: {
    marginBottom: '15px',
  },
  linkStyle: {
    color: '#0066cc',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  wallifyButtonStyle: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    transition: 'background-color 0.3s ease',
  },
  wallifyButtonHoverStyle: {
    backgroundColor: '#0056b3',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '300px',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  modalSelect: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '10px',
    fontSize: '14px',
  },
  modalButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState('');

  useEffect(() => {
    fetch('/members')
      .then((res) => res.json())
      .then((fetchedData) => {
        if (
          fetchedData &&
          Array.isArray(fetchedData.Title) &&
          Array.isArray(fetchedData.Description) &&
          Array.isArray(fetchedData.URL) &&
          Array.isArray(fetchedData.Full_Article_Text) &&
          Array.isArray(fetchedData.Image_path_link) &&
          Array.isArray(fetchedData.Tag)
        ) {
          const articleDetails = fetchedData.Title.map((_, index) => ({
            id: index.toString(),
            title: fetchedData.Title[index] || 'Untitled',
            description: fetchedData.Description[index] || 'No description available.',
            imageUrl:
              fetchedData.Image_path_link[index] === "1"
                ? 'http://localhost:5000/images/asciiart.png'
                : fetchedData.Image_path_link[index],
            content: fetchedData.Full_Article_Text[index] || 'Full article text not available.',
            author: `Author ${index + 1}`,
            date: `Date ${index + 1}`,
            tag: fetchedData.Tag[index] || 'General',
          })).find((article) => article.id === id);

          setArticle(articleDetails || null);
        } else {
          console.error('Error: fetchedData properties are not arrays or are missing.');
        }
      })
      .catch((error) => console.error('Error loading data:', error));

    // Load threads from localStorage
    const storedThreads = JSON.parse(localStorage.getItem('threads')) || [];
    setThreads(storedThreads);
  }, [id]);

  const handleWallifyClick = () => {
    setShowModal(true);
  };

  const handleThreadSelect = () => {
    if (!selectedThread) {
      alert('Please select a thread!');
      return;
    }

    const thread = threads.find((t) => t.id === parseInt(selectedThread));
    if (thread) {
      navigate('/thread', {
        state: { thread: { ...thread, article } },
      });
    }
  };

  if (!article) {
    return <p style={{ textAlign: 'center', color: '#333' }}>Loading article...</p>;
  }

  return (
    <div style={styles.pageStyle}>
      <h1 style={styles.titleStyle}>{article.title}</h1>
      <p style={styles.metaStyle}>By {article.author} • {article.date}</p>
      <img src={article.imageUrl} alt={article.title} style={styles.imageStyle} />
      <div style={styles.contentStyle}>
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index} style={styles.paragraphStyle}>
            {paragraph.split(' ').map((word, i) =>
              word.startsWith('http') ? (
                <a key={i} href={word} style={styles.linkStyle} target="_blank" rel="noopener noreferrer">
                  {word}
                </a>
              ) : (
                word + ' '
              )
            )}
          </p>
        ))}
      </div>
      <button
        style={isButtonHovered ? { ...styles.wallifyButtonStyle, ...styles.wallifyButtonHoverStyle } : styles.wallifyButtonStyle}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        onClick={handleWallifyClick}
      >
        Wallify
      </button>
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Select a Thread</h2>
            <select
              style={styles.modalSelect}
              value={selectedThread}
              onChange={(e) => setSelectedThread(e.target.value)}
            >
              <option value="">-- Select Thread --</option>
              {threads.map((thread) => (
                <option key={thread.id} value={thread.id}>
                  {thread.title}
                </option>
              ))}
            </select>
            <button style={styles.modalButton} onClick={handleThreadSelect}>
              Share to Thread
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
