import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image.");
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
      alert('Backend Server Error!!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Fire Detection Model</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />}
      <br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Predicting...' : 'Detect Fire'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Fire Detection Result</h2>
          <p>Fire Probability: {result.fire_probability.toFixed(4)}</p>
          <p>No Fire Probability: {result.no_fire_probability.toFixed(4)}</p>
          <h3 style={{ color: result.is_fire_detected ? 'red' : 'green' }}>
            {result.is_fire_detected ? '🔥 Fire Detected!' : '✅ No Fire Detected'}
          </h3>
        </div>
      )}
    </div>
  );
}

export default App;