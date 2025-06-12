import React from 'react';

const Shimmer = () => {
  return (
    <div className="fs-shimmer-container">
      <div className="fs-shimmer first-item">
        <div className="animate helarge2 helarge2--short" />
        <div className="animate helarge2" />
        <div className="animate helarge2 helarge2--short" />
        <div className="animate helarge2" />
      </div>
      <div className="fs-shimmer">
        <div className="animate helarge2 helarge2--short" />
        <div className="animate helarge2" />
      </div>
      <div className="fs-shimmer">
        <div className="animate helarge2 helarge2--short" />
        <div className="animate helarge2" />
      </div>
      <div className="fs-shimmer">
        <div className="animate helarge2 helarge2--short" />
        <div className="animate helarge2" />
      </div>

    </div>
  );
};

export default Shimmer;
