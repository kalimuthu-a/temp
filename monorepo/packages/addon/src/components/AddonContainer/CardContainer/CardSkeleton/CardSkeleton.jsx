import React from 'react';
import CardSkeletonItem from './CardSkeletonItem';

/**
 * @type {React.FC<{}>}
 * @returns {React.FunctionComponentElement}
 */
const CardSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((v) => (
        <div key={v} className="skyplus-addon-mf__addon-item">
          <CardSkeletonItem />
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
