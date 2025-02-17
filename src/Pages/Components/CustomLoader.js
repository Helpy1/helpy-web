import React from 'react';
import Modal from 'react-modal';
import Lottie from 'lottie-react';
import animationSource from '../../Assets/Animations/loader.json';

const CustomLoader = ({ isVisible }) => {
  console.log("Loader is being displayed")
  return (
    <Modal
      isOpen={isVisible}
      ariaHideApp={false} // Optional: for testing purposes only
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-2x l w-[220px] h-[120px] flex items-center justify-center shadow-lg">
        <div className="w-20 h-20">
          <Lottie animationData={animationSource} loop autoplay />
        </div>
      </div>
    </Modal>
  );
};

export default CustomLoader;