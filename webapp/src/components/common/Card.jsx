import React from 'react';
import '../../styles/card.css'; 

const Card = ({ title, icon, detail }) => {
  return (
    <div className="card">     
      <div className="card-content">
        <p className="card-title">{title}</p>
        <div className="card-detail-row">
        <div className="card-icon">
            {icon}
          </div>
          <h2 className="card-detail">{detail}</h2>  
        </div>
      </div>
    </div>
  );
};

export default Card;
