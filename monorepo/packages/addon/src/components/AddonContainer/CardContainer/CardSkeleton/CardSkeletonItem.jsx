import React from 'react';

/**
 * @type {React.FC<{}>}
 * @returns {React.FunctionComponentElement}
 */
const CardSkeletonItem = () => {
  return (
    <div className="card">
      <div className="card-header ">
        <div className="card-img skeleton" />
        <div className="card-body">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
        </div>
        <div className="card-footer">
          <div className="skeleton skeleton-btn" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeletonItem;
