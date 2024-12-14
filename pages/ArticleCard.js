import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '20px',
    overflowY: 'auto',
  },
  featuredContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '30px',
  },
  featuredCard: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
  },
  featuredImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
  },
  featuredContent: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '15px 20px',
    borderRadius: '8px',
    fontSize: '24px',
    fontWeight: 'bold',
    maxWidth: '80%',
  },
  secondaryContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    backgroundColor: '#FFF',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    position: 'relative',
  },
  cardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
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
};

export default function ArticleCard() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [hoveredCard, setHoveredCard] = useState(null); // Track which card is hovered

  useEffect(() => {
    fetch('/members')
      .then((res) => res.json())
      .then((fetchedData) => {
        if (
          fetchedData &&
          Array.isArray(fetchedData.Index) &&
          Array.isArray(fetchedData.Title) &&
          Array.isArray(fetchedData.Description) &&
          Array.isArray(fetchedData.Image_path_link) &&
          Array.isArray(fetchedData.Tag)
        ) {
          const articlesArray = fetchedData.Index.map((index) => {
            if (
              fetchedData.Title[index] !== undefined &&
              fetchedData.Description[index] !== undefined &&
              fetchedData.Tag[index] !== undefined
            ) {
              return {
                id: index,
                title: fetchedData.Title[index],
                description: fetchedData.Description[index],
                imageUrl:
                  fetchedData.Image_path_link[index] === '1'
                    ? 'http://localhost:5000/images/asciiart.png'
                    : fetchedData.Image_path_link[index],
                tag: fetchedData.Tag[index],
                date: `Date ${index + 1}`,
                author: `Author ${index + 1}`,
              };
            } else {
              console.error(`Invalid data at index ${index}`);
              return null;
            }
          }).filter((article) => article !== null);

          let filteredArticles;
          if (category && category.toLowerCase() === 'new') {
            filteredArticles = articlesArray.slice(-5);
          } else {
            filteredArticles =
              category && category.toLowerCase() !== 'all'
                ? articlesArray.filter(
                    (article) =>
                      article.tag &&
                      article.tag.toLowerCase() === category.toLowerCase()
                  )
                : articlesArray;
          }

          setArticles(filteredArticles);
        } else {
          console.error('Invalid data structure received from backend.');
        }
      })
      .catch((error) => console.error('Error fetching articles:', error));
  }, [category]);

  const loadMoreArticles = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 10, articles.length));
  };

  return (
    <div style={styles.container}>
      {articles.length > 0 && (
        <div style={styles.featuredContainer}>
          <div
            style={styles.featuredCard}
            onClick={() => navigate(`/article/${articles[0].id}`)}
          >
            <img
              src={articles[0].imageUrl}
              alt={articles[0].title}
              style={styles.featuredImage}
            />
            <div style={styles.featuredContent}>{articles[0].title}</div>
          </div>
        </div>
      )}
      <div style={styles.secondaryContainer}>
        {articles.slice(1, displayCount).map((article) => (
          <div
            key={article.id}
            style={{
              ...styles.card,
              ...(hoveredCard === article.id ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard(article.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              style={styles.image}
              onClick={() => navigate(`/article/${article.id}`)}
            />
            <div style={styles.content}>
              <h3 style={styles.articleTitle}>{article.title}</h3>
              <p style={styles.tag}>Tag: {article.tag}</p>
              <p style={styles.meta}>
                By {article.author} • {article.date}
              </p>
            </div>
          </div>
        ))}
      </div>
      {displayCount < articles.length ? (
        <button style={styles.wallifyButton} onClick={loadMoreArticles}>
          Load More Articles
        </button>
      ) : (
        <button style={{ ...styles.wallifyButton, cursor: 'not-allowed' }} disabled>
          No More Articles to Load
        </button>
      )}
    </div>
  );
}
