import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '20px',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    backgroundColor: '#FFF',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  content: {
    padding: '15px',
  },
  articleTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  tag: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#007bff',
    fontStyle: 'italic',
  },
  meta: {
    fontSize: '14px',
    color: '#666',
    marginTop: '10px',
  },
  loadMoreButton: {
    display: 'block',
    margin: '20px auto',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  loadMoreButtonHover: {
    backgroundColor: '#0056b3',
  },
  disabledButton: {
    display: 'block',
    margin: '20px auto',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#666',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'not-allowed',
  },
};

export default function LoadMoreArticles() {
  const [articles, setArticles] = useState([]);
  const [displayCount, setDisplayCount] = useState(10); // Initial display count
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch articles from backend
    fetch('/members')
      .then((res) => res.json())
      .then((fetchedData) => {
        if (
          fetchedData &&
          Array.isArray(fetchedData.Title) &&
          Array.isArray(fetchedData.Description) &&
          Array.isArray(fetchedData.Image_path_link) &&
          Array.isArray(fetchedData.Full_Article_Text) &&
          Array.isArray(fetchedData.Tag)
        ) {
          const articlesArray = fetchedData.Title.map((_, index) => ({
            id: index,
            title: fetchedData.Title[index] || 'Untitled',
            description: fetchedData.Description[index] || 'No description available.',
            imageUrl: fetchedData.Image_path_link[index] || null,
            tag: fetchedData.Tag[index] || 'General',
          }));
          setArticles(articlesArray);
        } else {
          console.error('Error: Fetched data is invalid or incomplete.');
        }
      })
      .catch((error) => console.error('Error fetching articles:', error));
  }, []);

  const loadMoreArticles = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 10, articles.length)); // Ensure it doesn't exceed the total
  };

  return (
    <div style={styles.container}>
      <div style={styles.cardContainer}>
        {articles.slice(0, displayCount).map((article, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => navigate(`/article/${article.id}`)}
          >
            {article.imageUrl && <img src={article.imageUrl} alt={article.title} style={styles.image} />}
            <div style={styles.content}>
              <h3 style={styles.articleTitle}>{article.title}</h3>
              <p style={styles.tag}>Tag: {article.tag}</p>
            </div>
          </div>
        ))}
      </div>
      {displayCount < articles.length ? (
        <button
          style={styles.loadMoreButton}
          onClick={loadMoreArticles}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.loadMoreButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.loadMoreButton.backgroundColor)}
        >
          Load More Articles
        </button>
      ) : (
        <button style={styles.disabledButton} disabled>
          No More to Load
        </button>
      )}
    </div>
  );
}
