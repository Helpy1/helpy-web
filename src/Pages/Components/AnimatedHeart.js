import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
const AnimatedHeart = ({ style }) => {
  return (
    <motion.div
      className="absolute" // Tailwind utility for positioning
      style={style}
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{ y: -150, opacity: 0, scale: 1.5 }}
      transition={{ duration: 1 }}
    >
      <FontAwesomeIcon icon={faHeart} className="text-red-500 text-6xl" />
    </motion.div>
  );
};

export default AnimatedHeart;
