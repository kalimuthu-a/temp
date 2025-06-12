import React from 'react';

const Shimmer = () => {
  return (
    <div className="ld-shimmer">
      <div className="br">
        <div className="alignment">
          <div className="d-flex flex-column w-100">
            <div className="user-card animate small p-5 " />
            <div className="user-card animate broad p-10 " />
            <div className="user-card animate  medium p-10 " />
            <div className="user-card animate broad p-5 " />
            <div className="user-card animate medium p-10 " />
            <div className="user-card animate broad p-10" />
          </div>
          <div className="points-section">
            <div className="sub-point">
              <div className="d-flex flex-column w-100">
                <div className="points animate medium p-5" />
                <div className="user-card animate broad he2 p-15" />
              </div>
              <div className="d-flex flex-column w-100">
                <div className="points animate medium p-5" />
                <div className="user-card animate broad he2 p-15" />
              </div>
            </div>
            <div className="d-flex flex-column w-100 justify-content-around justify-center">
              <div className="d-flex flex-column ">
                <div className="points animate medium p-5 " />
                <div className="points animate broad p-5 " />
                <div className="user-card animate w70 he2 p-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
