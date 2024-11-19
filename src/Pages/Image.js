// ImageUpload.js
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/firebase-config';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) {
      alert("Please choose an image first!");
      return;
    }

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Image Upload Test</h2>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button onClick={handleUpload}>Upload Image</button>
      <br />
      <progress value={progress} max="100" />
      <p>{progress}%</p>
      {downloadURL && (
        <div>
          <p>Image uploaded successfully!</p>
          <img src={downloadURL} alt="Uploaded" width="300" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
