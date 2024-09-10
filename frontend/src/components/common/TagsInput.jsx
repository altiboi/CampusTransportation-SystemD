// src/components/common/TagsInput.jsx
import { useState } from "react";
import "./TagsInput.css";

const TagsInput = ({ tags, selectedTags, onTagClick }) => {
  const handleTagClick = (tag) => {
    onTagClick(tag);
  };

  return (
    <div className="tags-input-container">
      {tags.map((tag) => (
        <div
          key={tag}
          className={`tag-item ${selectedTags.includes(tag) ? "selected" : ""}`}
          onClick={() => handleTagClick(tag)}
        >
          <span className="text">{tag}</span>
          {selectedTags.includes(tag) && (
            <span className="close" onClick={() => handleTagClick(tag)}>
              &times;
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TagsInput;
