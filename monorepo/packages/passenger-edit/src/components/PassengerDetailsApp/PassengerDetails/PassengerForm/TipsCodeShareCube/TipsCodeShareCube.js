import React from 'react';
import './TipsCodeShareCube.scss';
import PropTypes from 'prop-types';

const TipsCodeShareCube = ({ additionalaemdata }) => {
  return (
    <>
      <div className="partner-heading mt-12 mb-8 pb-4">{additionalaemdata?.travelPartnerHeading}</div>
      <div className="frame-wrapper">
        <div className="frame-container">
          <div
            className="content-wrap"
            dangerouslySetInnerHTML={{
              __html: additionalaemdata?.firstNameDescription?.html,
            }}
          />
          <div className="name-wrap">
            <div className="name">
              <div className="fnu-name">{additionalaemdata?.firstNameLabel}</div>
              <div className="fnu"> {additionalaemdata?.fnuNameExample}</div>
            </div>
            <div className="name">
              <div className="fnu-name">{additionalaemdata?.lastNameLabel}</div>
              <div className="fnu">  {additionalaemdata?.surnameExample}</div>
            </div>
          </div>
        </div>
        <div className="frame-container">
          <div
            className="content-wrap"
            dangerouslySetInnerHTML={{
              __html: additionalaemdata?.lastNameDescription?.html,
            }}
          />
          <div className="name-wrap">
            <div className="name">
              <div className="fnu-name">{additionalaemdata?.firstNameLabel}</div>
              <div className="fnu"> {additionalaemdata?.firstNameExample}</div>
            </div>
            <div className="name">
              <div className="fnu-name">{additionalaemdata?.lastNameLabel}</div>
              <div className="fnu"> {additionalaemdata?.lnunameExample}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

TipsCodeShareCube.propTypes = {
  additionalaemdata: PropTypes.object,
};

export default TipsCodeShareCube;
