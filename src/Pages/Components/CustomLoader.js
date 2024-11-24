import React from 'react';
import Modal from 'react-modal';
import Lottie from 'lottie-react';
import animationSource from '../../Assets/Animations/loader.json';

const CustomLoader = ({ isVisible }) => {
  return (
    <Modal
      isOpen={isVisible}
      ariaHideApp={false} // Optional: for testing purposes only
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-2xl w-1/6 h-1/5 flex items-center justify-center shadow-lg">
        <div className="w-24 h-24">
          <Lottie animationData={animationSource} loop autoplay />
        </div>
      </div>
    </Modal>
  );
};

export default CustomLoader;