import React from 'react';
import {
  FaPlane,
  FaBook,
  FaPencilAlt,
  FaGraduationCap,
  FaMoneyBillWave,
  FaTshirt,
  FaHome,
  FaShoppingCart,
  FaExclamationCircle,
  FaUniversity,
  FaPlug,
  FaUtensils,
  FaPiggyBank,
  FaShieldAlt,
  FaMobileAlt,
  FaBath,
  FaCreditCard,
  FaFileInvoice,
  FaCar,
  FaUmbrellaBeach,
  FaStar,
} from 'react-icons/fa';
import { MdLocalLaundryService } from 'react-icons/md';

// Function to get the appropriate icon based on interest
const getInterestIcon = (interestItem) => {
  switch (interestItem.toLowerCase().trim()) {
    case 'travel/transportation':
      return <FaPlane className="text-blue-500" />;
    case 'textbooks':
      return <FaBook className="text-brown-700" />;
    case 'school supplies':
      return <FaPencilAlt className="text-orange-500" />;
    case 'tuition':
      return <FaGraduationCap className="text-purple-500" />;
    case 'student loan payment':
      return <FaMoneyBillWave className="text-green-500" />;
    case 'clothes':
      return <FaTshirt className="text-pink-500" />;
    case 'rent':
      return <FaHome className="text-purple-700" />;
    case 'groceries':
      return <FaShoppingCart className="text-blue-400" />;
    case 'emergency expenses':
      return <FaExclamationCircle className="text-red-500" />;
    case 'greek life':
      return <FaUniversity className="text-blue-600" />;
    case 'utilities':
      return <FaPlug className="text-orange-500" />;
    case 'dining out':
      return <FaUtensils className="text-orange-600" />;
    case 'savings':
      return <FaPiggyBank className="text-green-600" />;
    case 'insurance':
      return <FaShieldAlt className="text-yellow-500" />;
    case 'laundry':
      return <MdLocalLaundryService className="text-brown-500" />;
    case 'cell phone':
      return <FaMobileAlt className="text-gray-700" />;
    case 'personal care products':
      return <FaBath className="text-orange-600" />;
    case 'credit card':
      return <FaCreditCard className="text-blue-400" />;
    case 'subscriptions':
      return <FaFileInvoice className="text-purple-500" />;
    case 'car payment':
      return <FaCar className="text-blue-500" />;
    case 'vacation':
      return <FaUmbrellaBeach className="text-yellow-400" />;
    default:
      return <FaStar className="text-gray-500" />;
  }
};

// The InterestButton component
const InterestButton = ({ interest }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 m-2">
      {getInterestIcon(interest)}
      <span className="text-black text-xs ml-2">{interest}</span>
    </div>
  );
};

export default InterestButton;
