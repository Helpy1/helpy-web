import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image file
  const [uploading, setUploading] = useState(false); // State to manage the upload process
  const [uploadResult, setUploadResult] = useState(null); // State to hold the response from the API
  const [errorMessage, setErrorMessage] = useState(''); // State to hold any error message

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      setSelectedImage(file); // Set the selected image
      setErrorMessage(''); // Clear previous error messages
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setErrorMessage('Please select an image to upload.');
      return;
    }

    setUploading(true); // Set the uploading state to true
    setErrorMessage(''); // Clear previous error messages
    setUploadResult(null); // Clear previous upload result

    const formData = new FormData();
    formData.append('imageFiles', selectedImage); // Append the selected image to formData
    formData.append('gUid', 'YZ2QlVEDFZditC2I1NqAxAf13PI2'); // Replace with actual user UID if needed
    formData.append('name', selectedImage.name); // Use the file name for the image name

    try {
      const response = await axios.post('https://usamaanwar-001-site1.atempurl.com/api/UploadImageToGoogleBucket', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check the response and update the state accordingly
      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        setUploadResult(response.data[0]); // Get the image link from the response
      } else {
        setErrorMessage('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Failed to upload the image. Please try again.');
    } finally {
      setUploading(false); // Set the uploading state to false when done
    }
  };

  return (
    <div style={styles.container}>
      <h1>Upload Image</h1>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        style={styles.input}
      />
      
      <button 
        onClick={handleUpload} 
        style={styles.uploadButton} 
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {uploadResult && (
        <div style={styles.result}>
          <p>Upload successful!</p>
          <a href={uploadResult.imageLink} target="_blank" rel="noopener noreferrer">View Image</a>
        </div>
      )}

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  input: {
    padding: '10px',
    margin: '10px',
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  result: {
    marginTop: '20px',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default ImageUpload;
