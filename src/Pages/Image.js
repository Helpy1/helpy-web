import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [gUid, setGUid] = useState('YZ2QlVEDFZditC2I1NqAxAf13PI2'); // Example gUid, replace with actual value

  const handleImageChange = (event) => {
    setSelectedImages(event.target.files);
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      setUploadStatus('No images selected');
      return;
    }

    const formData = new FormData();

    // Append each image to the FormData object
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append('imageFiles', selectedImages[i]); // key should be 'imageFiles' as per the cURL example
    }

    setUploading(true);
    setUploadStatus('Uploading...');

    try {
      const response = await axios.post(
        `https://usamaanwar-001-site1.atempurl.com/api/UploadListOfImagesToGoogleBucket?gUid=${gUid}`, // Include gUid in the URL
        formData,
        {
          headers: {
            'Accept': '*/*',
            'Authorization': '0f910af0-db08-4d2e-8533-f79028b98345', // Authorization if needed
            'Content-Type': 'multipart/form-data', // Axios will automatically set this, but we keep it here for clarity
          },
        }
      );

      setUploading(false);
      setUploadStatus('Upload successful!');
      console.log('Response:', response.data); // Handle the successful response here
    } catch (error) {
      setUploading(false);
      setUploadStatus('Upload failed');
      console.error('Upload error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h3>Upload Images to Google Cloud Bucket</h3>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      <div>
        {uploading ? (
          <p>{uploadStatus}</p>
        ) : (
          <button onClick={handleUpload}>Upload Images</button>
        )}
      </div>
      {uploadStatus && !uploading && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ImageUploader;
