import React from 'react';

const Shimmer = () => {
  return (
    <div className="bw-shimmer">
      <div className="d-flex tabs">
        <div className="br animate w20 helarge2 flex-grow-1 tab" />
      </div>
      <div className="br px-20">
        <div className="br animate w100 helarge2 flex-grow-1 tab mb-10" />
        <div className="br animate w100 helarge2 flex-grow-1 tab mb-10" />
        <div className="br animate w100 helarge2 flex-grow-1 tab" />
      </div>
    </div>
  );
};

export default Shimmer;
