import React from 'react';
import { FaHome, FaBell,FaBox, FaEye, FaShoppingCart, FaUsers, FaIndustry, FaBoxes ,FaComments} from 'react-icons/fa';

const IconRenderer = ({ iconKey }) => {
  switch (iconKey) {
    case 'FaHome':
      return <FaHome />;
    case 'FaBell':
      return <FaBell />;
    case 'FaEye':
      return <FaEye />;
    case 'FaShoppingCart':
      return <FaShoppingCart />;
    case 'FaUsers':
      return <FaUsers />;
    case 'FaIndustry':
      return <FaIndustry />;
    case 'FaBoxes':
      return <FaBoxes />;
    case 'FaBox':
      return <FaBox />;
    case 'FaComments':
      return <FaComments />;
    default:
      return null;
  }
};

export default IconRenderer;
