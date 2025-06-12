/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CheckBoxV2 from 'skyplus-design-system-app/dist/des-system/CheckBoxV2';
import './SeatTaggingChange.scss';

const SeatTaggingChangeModal = (props) => {
  const {
    seatLabel,
    paxKey,
    paxName,
    allPrevSeats,
    selectedPax,
    setSelectedPax,
    seatTaggingChangeModalHandler,
    onToggleModal,
  } = props;
  const [disable, setDisable] = useState(true);

  const onSelect = (isChecked, key) => {
    let pax = {};
    if (!selectedPax[key]) {
      pax[key] = { isChecked, paxKey: key };
    } else {
      pax = {};
    }
    setSelectedPax(pax);
    setDisable(!Object.keys(pax).length);
  };

  const onDismissHandler = () => {
    setSelectedPax({});
    onToggleModal();
  };

  const heading = `Confirm ${seatLabel} tagging change`;
  const subHeading = `${seatLabel} are currently assigned with following passengers. Are you sure you want to change this and assign ${seatLabel} to ${paxName}?`;

  return (
    <div className="change-seat-tagging-modal-wrapper">
      <h3 className="main-heading sh8 mb-8">
        {heading}
      </h3>
      <div className="sub-heading body-small-regular mb-12">
        {subHeading}
      </div>
      <div className="mb-16">
        {allPrevSeats?.map((seat) => (
          <div
            key={seat?.paxKey}
            onClick={() => onSelect(true, seat?.paxKey)}
            className={`${
              selectedPax[seat?.paxKey]?.isChecked
                ? 'sp-slider__input-container--active bg-secondary-light'
                : ''
            } sp-slider__input-container border border-1 
            rounded d-flex px-6 py-4 flex-row-reverse 
            justify-content-between mb-8`}
            aria-hidden="true"
          >
            <div className="checkbox-container w-100">
              <div
                className="checkbox-label
              align-items-center d-flex flex-row-reverse justify-content-between w-100"
              >
                <CheckBoxV2
                  checked={selectedPax[seat?.paxKey]?.isChecked}
                  onChangeHandler={(e) => onSelect(e.target?.checked, seat?.paxKey)}
                />
                <span className="d-flex ">
                  <span className="align-items-center d-flex me-6">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.54452 9.74052L10.0534 5.19846C10.153 5.09808 10.2866 5.0395 10.4246 5.03563C10.5627 5.03175 10.694 5.0829 10.7896 5.1778C10.8852 5.27271 10.9373 5.40361 10.9344 5.5417C10.9316 5.67979 10.874 5.81377 10.7743 5.91415L6.26548 10.4562C6.16583 10.5566 6.03228 10.6152 5.89421 10.619C5.75615 10.6229 5.62487 10.5718 5.52926 10.4769C5.43366 10.382 5.38156 10.2511 5.38442 10.113C5.38728 9.97488 5.44487 9.84091 5.54452 9.74052ZM8.83462 10.7521L6.95593 12.6446C6.45767 13.1465 5.78993 13.4394 5.09959 13.4588C4.40925 13.4781 3.75287 13.2224 3.27484 12.7479C2.79681 12.2734 2.5363 11.6189 2.5506 10.9284C2.56491 10.238 2.85286 9.56808 3.35112 9.06615L5.22981 7.17363C5.32946 7.07324 5.38705 6.93927 5.38991 6.80118C5.39277 6.66308 5.34067 6.53219 5.24506 6.43728C5.14946 6.34237 5.01818 6.29123 4.88011 6.29511C4.74205 6.29898 4.6085 6.35755 4.50885 6.45794L2.63016 8.35046C1.9326 9.05317 1.52946 9.99099 1.50943 10.9576C1.48941 11.9243 1.85413 12.8406 2.52337 13.5049C3.19261 14.1693 4.11154 14.5272 5.07801 14.5001C6.04449 14.473 6.97933 14.063 7.67689 13.3603L9.55558 11.4678C9.65523 11.3674 9.71282 11.2334 9.71568 11.0953C9.71854 10.9572 9.66644 10.8263 9.57084 10.7314C9.47523 10.6365 9.34395 10.5854 9.20589 10.5892C9.06782 10.5931 8.93427 10.6517 8.83462 10.7521ZM8.64195 2.29438L6.76327 4.18691C6.66362 4.28729 6.60603 4.42127 6.60316 4.55936C6.6003 4.69746 6.65241 4.82835 6.74801 4.92326C6.84362 5.01816 6.97489 5.06931 7.11296 5.06543C7.25103 5.06156 7.38458 5.00298 7.48423 4.9026L9.36292 3.01007C9.86117 2.50814 10.5289 2.21528 11.2193 2.19591C11.9096 2.17653 12.566 2.43224 13.044 2.90677C13.522 3.3813 13.7826 4.03579 13.7682 4.72625C13.7539 5.41671 13.466 6.08659 12.9677 6.58852L11.089 8.48105C10.9894 8.58143 10.9318 8.71541 10.9289 8.8535C10.9261 8.99159 10.9782 9.12249 11.0738 9.2174C11.1694 9.3123 11.3007 9.36345 11.4387 9.35957C11.5768 9.3557 11.7104 9.29712 11.81 9.19674L13.6887 7.30421C14.3862 6.60151 14.7894 5.66368 14.8094 4.69704C14.8294 3.73039 14.4647 2.81411 13.7955 2.14976C13.1262 1.48542 12.2073 1.12743 11.2408 1.15455C10.2744 1.18167 9.33952 1.59168 8.64195 2.29438Z" fill="#4B5772" />
                      <line x1="0.353553" y1="0.646447" x2="17.3536" y2="17.6464" stroke="#25304B" />
                    </svg>
                  </span>
                  <span className="body-small-regular">{seatLabel}</span>
                </span>
                <div className="d-flex flex-wrap gap-6 align-items-center gap-6 ">
                  <span
                    className="sp-slider__avatar
                  text-uppercase rounded-circle
                  bg-secondary-main d-flex justify-content-center tags-small align-items-center"
                  >
                    {seat?.paxName.slice(0, 2)}
                  </span>
                  <label
                    className="sp-slider__passenger-name text-capitalize body-small-regular text-break"
                    htmlFor={paxKey}
                  >
                    {seat?.paxName}
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center">
        <button
          onClick={onDismissHandler}
          type="button"
          className="btn dismiss-btn m-0 me-8 rounded-pill py-4 w-100"
        >
          Dismiss
        </button>
        <button
          type="button"
          onClick={seatTaggingChangeModalHandler}
          className={`${disable && 'btn-disabled'} m-0 w-100 py-4 btn remove-btn rounded-pill`}
          disabled={disable}
        >
          Change
        </button>
      </div>

    </div>
  );
};

SeatTaggingChangeModal.propTypes = {
  seatTaggingChangeModalHandler: PropTypes.func,
  onToggleModal: PropTypes.func,
  allPrevSeats: PropTypes.shape([]),
  seatLabel: PropTypes.string,
  paxKey: PropTypes.string,
  paxName: PropTypes.string,
  selectedPax: PropTypes.shape({}),
  setSelectedPax: PropTypes.func,
};

export default SeatTaggingChangeModal;
