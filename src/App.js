import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      toast.warn("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/predict', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Backend Server Error!!');
    } finally {
      setLoading(false);
    }
  };

  const handletoasts = () => {
    if (result !== null) {
      result.is_fire_detected ? toast.warn('Fire Detected!') : toast.success('No Fire Detected')
    }
  }

// eslint-disable-next-line
  useEffect(() => {
   handletoasts()
  }, [result]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Fire Detection Model 🔥</h1>

        <div className="button-group">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            id="file-input" 
            className="hidden-input"
          />

          
          <label htmlFor="file-input" className="custom-file-btn">
            Choose Image
          </label>

          <button 
            onClick={handleUpload} 
            disabled={loading} 
            className={`btn ${loading ? 'btn-disabled' : ''}`}
          >
            {loading ? 'Predicting...' : 'Detect Fire'}
          </button>
        </div>

      <span className="file-name">{fileName}</span>

      {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            className="image-preview"
          />
        )}

        {result ? (
          <div className="result">
            <h2>
              {result.is_fire_detected ? "🔥 Fire Detected!" : "✅ No Fire Detected"}
            </h2>
          </div>
      ) : ""}
      </div>
      <ToastContainer position="top-center" pauseOnHover={false}/>
    </div>
  );
}

export default App;