import React from 'react';

const Shimmer = () => {
  return (
    <div className="bw-shimmer">
      <div className="d-flex tabs">
        <div className="br animate w20 helarge2 flex-grow-1 tab" />
        <div className="br animate w20 helarge2 flex-grow-1 tab" />
      </div>
      <div className="br px-20">
        <div className="wrapper gap-4 d-flex flex-column">
          <div className="d-flex justify-content-between">
            <div className="comment br animate w30 he2 trip-selector" />
            <div className="comment br animate w10 he2 currency" />
          </div>
          <div className="form-fields">
            <div className="comment br animate w25 helarge" />
            <div className="comment br animate w25 helarge" />
            <div className="comment br animate w10 helarge d-tablet" />
            <div className="comment br animate w10 helarge d-tablet" />
            <div className="comment br animate w20 helarge pax-selection d-tablet" />
          </div>
          <div className="d-flex justify-content-between gap-10 d-tablet">
            <div className="flex-grow-1 d-tablet">
              <div className="comment br animate w30 he1 " />
            </div>

            <div className="comment br animate w20 he1 d-tablet" />
            <div className="comment br animate w15 he1 d-tablet" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
