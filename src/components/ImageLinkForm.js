import React, { useState } from "react";
import validator from 'validator';
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (url) => {
    if (!url.trim()) {
      setError('Please enter an image URL');
      return false;
    }
    if (!validator.isURL(url)) {
      setError('Please enter a valid URL');
      return false;
    }
    if (!url.match(/\.(jpeg|jpg|gif|png)$/)) {
      setError('Please enter a valid image URL (jpg, jpeg, gif, or png)');
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setUrl(value);
    onInputChange(event);
    if (error) {
      validateUrl(value);
    }
  };

  const handleSubmit = () => {
    if (!validateUrl(url)) {
      return;
    }

    setIsLoading(true);
    onPictureSubmit();
    setIsLoading(false);
  };

  return (
    <div className="ma4 mt0">
      <p className="f3">
        {"This Magic Brain will detect faces in your picture. Give it a try"}
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className={`f4 pa2 w-70 center ${error ? 'b--red' : ''}`}
            type="text"
            onChange={handleInputChange}
            placeholder="Enter image URL (jpg, jpeg, gif, or png)"
            value={url}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Detecting..." : "Detect"}
          </button>
        </div>
        {error && <p className="red f6 mt2">{error}</p>}
      </div>
    </div>
  );
};

export default ImageLinkForm;
