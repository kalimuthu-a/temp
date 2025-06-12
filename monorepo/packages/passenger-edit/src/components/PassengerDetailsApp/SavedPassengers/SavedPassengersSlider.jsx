import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import CheckBoxV2 from 'skyplus-design-system-app/src/components/CheckBoxV2/CheckBoxV2';
import { AppContext } from '../../../context/appContext';
import LoyaltyCard from './LoyaltyCard/LoyaltyCard';

function SavedPassengersSlider({ onClickShow, clickIt }) {
  const {
    state: {
      savedPassengers,
      disableLoyalty,
      loggedInUser,
      aemMainData: { savedListNote, viewAllLabel },
    },
  } = useContext(AppContext);

  const [isDown, setIsDown] = useState(false);

  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const rootRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDown(true);
    startXRef.current = e.pageX - rootRef.current.offsetLeft;
    scrollLeftRef.current = rootRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - rootRef.current.offsetLeft;
    const walk = x - startXRef.current;
    rootRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <div className="sp-slider p-6 p-md-12 mt-6 rounded-1 bg-white">
      <div className="d-flex justify-content-between">
        <div className="sp-slider__heading h0">{savedListNote}</div>
        {savedPassengers.length > 4 ? (
          <div
            onClick={onClickShow}
            className="d-flex gap-4 align-items-center"
            aria-hidden="true"
          >
            <span className="sp-slider__viewall text-decoration-underline text-uppercase btn">
              {viewAllLabel}
            </span>
            <span className="sp-slider__icon-right icon-accordion-left-24" />
          </div>
        ) : null}
      </div>
      <div
        ref={rootRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => setIsDown(false)}
        onMouseUp={() => setIsDown(false)}
        onMouseMove={handleMouseMove}
        className="sp-slider__list overflow-y-auto gap-8 mt-6 d-flex flex-column flex-md-row gap-8"
        aria-hidden="true"
      >
        {savedPassengers.map((passenger, index) => {
          const { type, title, firstname, lastname, dobYear, isSelected, isDisabled } = passenger;
          return (!disableLoyalty ? <LoyaltyCard index={index} passenger={passenger} clickIt={clickIt} loggedInUser={loggedInUser} />
            : (
              <div
                key={`${firstname}-${lastname}-${dobYear}`}
                onClick={(e) => clickIt(index, e, firstname, lastname)}
                className={`${
                  isSelected
                    ? 'sp-slider__input-container--active bg-secondary-light'
                    : ''
                } ${isDisabled ? 'disabled-saved-pax' : ''} sp-slider__input-container border border-1 
              rounded d-flex p-md-8 flex-row-reverse 
              justify-content-between p-6`}
                aria-hidden="true"
              >
                <div className="checkbox-container w-100">
                  <div
                    className="checkbox-label
                align-items-center align-items-md-start pt-md-3 d-flex flex-row-reverse justify-content-between w-100"
                  >
                    <CheckBoxV2
                      checked={isSelected}
                      onChangeHandler={() => !isSelected}
                    />
                    <div className="d-flex flex-md-column gap-6 align-items-center align-items-md-start gap-6">
                      <span
                        className="sp-slider__avatar flex-shrink-0
                    text-uppercase rounded-circle
                    bg-secondary-main d-flex justify-content-center align-items-center"
                      >
                        {firstname.slice(0, 1) + lastname.slice(0, 1)}
                      </span>
                      <label
                        className="sp-slider__passenger-name text-capitalize body-medium-regular text-break"
                        htmlFor={type}
                      >
                        {firstname} {lastname}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ));
        })}
      </div>
    </div>
  );
}

SavedPassengersSlider.propTypes = {
  onClickShow: PropTypes.func,
  clickIt: PropTypes.func,
};

export default SavedPassengersSlider;
