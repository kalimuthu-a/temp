import React from 'react';
import './Shimmer.scss';

const Shimmer = () => {
  return (
    <div className="pe-shimmer pe-md-8 pt-8">
      <div className="pe-shadow-box w-100 p-15 mb-8">
        <div className="animate h-40 mb-16" />
        <div className="animate title-height mb-16 w-50" />
      </div>

      <div className="pe-shadow-box w-100 p-15 mb-8">
        <div className="animate title-height mb-8 w-50" />
        <div className="pe-shadow-box w-100 p-5 d-flex">
          <div className="w-50 d-flex flex-column justify-content-center">
            <div className="animate title-height mb-8 w-25" />
            <div className="animate title-height mb-8 w-75" />
          </div>
          <div className="w-50 d-flex align-items-center">
            <div className="animate h-40 w-50" />
          </div>
        </div>
      </div>

      <div className="pe-shadow-box w-100 p-10 mb-8 d-flex justify-content-between">
        <div className="animate title-height w-md" />
        <div className="animate title-height w-sm" />
      </div>
      <div className="pe-shadow-box w-100 p-10 mb-8 d-flex justify-content-between">
        <div className="animate title-height w-md" />
        <div className="animate title-height w-sm" />
      </div>
      <div className="pe-shadow-box w-100 p-10 mb-8 d-flex justify-content-between">
        <div className="animate title-height w-md" />
        <div className="animate title-height w-sm" />
      </div>

      <div className="pe-shadow-box w-100 p-15">
        <div className="animate title-height mt-16 mb-8 w-50" />

        <div className="w-100 mb-8 d-flex justify-content-between gap-8">
          <div className="animate rounded-1 h-40 w-sm" />
          <div className="animate rounded-1 h-40 w-100" />
          <div className="animate rounded-1 h-40 w-50 d-none d-md-block" />
        </div>

        <div className="w-100 mt-16 d-flex justify-content-start gap-8">
          <div className="animate rounded-1 title-height w-sm" />
          <div className="animate rounded-1 title-height w-50" />
        </div>
        <div className="w-100 mt-8 d-flex justify-content-start gap-8">
          <div className="animate rounded-1 title-height w-sm" />
          <div className="animate rounded-1 title-height w-50" />
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
