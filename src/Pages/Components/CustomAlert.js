import React from 'react';
import Modal from 'react-modal';
import Lottie from 'lottie-react';

const CustomAlert = ({ isVisible, onClose, animationSource, message }) => {
  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      ariaHideApp={false} // Optional: for testing purposes only
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg flex flex-col items-center shadow-lg">
        <div className="w-28 h-28">
          <Lottie animationData={animationSource} loop={false} autoplay />
        </div>
        <p className="text-black text-lg text-center mt-4">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default CustomAlert;
