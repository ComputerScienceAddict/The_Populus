import React, { useState } from 'react';

const containerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Responsive grid
  gap: "15px", // Adjust spacing between boxes
  padding: "20px", // Add consistent padding around the grid
  justifyContent: "center",
};

const generateInitialBoxStyle = () => {
  return {
    height: "auto",
    width: "100%",
    backgroundColor: "#FFF",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    margin: "0", // Remove unnecessary margins
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #ddd", // Add a light gray border
  };
};

export default function Box({
  title = "No Title",
  imageUrl = null,
  tag = "General",
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [initialStyle] = useState(generateInitialBoxStyle);

  const boxStyle = {
    ...initialStyle,
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    boxShadow: isHovered
      ? "0px 8px 16px rgba(0, 0, 0, 0.2)"
      : "0px 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const imageStyle = {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  };

  const contentStyle = {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
    textAlign: "center",
  };

  const tagStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#007bff",
    color: "#FFF",
    padding: "5px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  };

  const descriptionStyle = {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.5",
    textAlign: "center",
  };

  return (
    <div
      style={boxStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {imageUrl && <img src={imageUrl} alt={title} style={imageStyle} />}
      <div style={contentStyle}>
        <h5 style={titleStyle}>{title}</h5>
        <p style={descriptionStyle}>This is a brief description of the content.</p>
      </div>
      {isHovered && <div style={tagStyle}>{tag}</div>}
    </div>
  );
}
