import React, { useContext } from 'react';
import CheckBoxV2 from 'skyplus-design-system-app/src/components/CheckBoxV2/CheckBoxV2';
import PropTypes from 'prop-types';
import { AppContext } from '../../../../context/appContext';
import './LoyaltyCard.scss';

const LoyaltyCard = ({ passenger: { type, firstname, lastname, dobYear, isSelected, isDisabled, nomineeId = null },
  index,
  clickIt,
  loggedInUser: { name } }) => {
  const {
    state: {
      aemMainData: {
        youLabel,
        nomineeLabel,
      },
    },
  } = useContext(AppContext);

  const savedPassengersType = name?.first === firstname
    && name?.last === lastname
    ? youLabel
    : nomineeId ? nomineeLabel : '';

  return (
    <div
      key={`${firstname}-${lastname}-${dobYear}`}
      onClick={(e) => clickIt(index, e, firstname, lastname)}
      className={`${isSelected
        ? 'loyalty-slider__container--active bg-secondary-light'
        : ''
      } ${isDisabled ? 'disabled-saved-pax' : ''} loyalty-slider__container border border-1 
    d-flex p-md-8
    justify-content-between p-6`}
      aria-hidden="true"
    >
      <div className="checkbox-container w-100">
        <div
          className="checkbox-label
       align-items-start pt-md-3 d-flex justify-content-between w-100"
        >

          <div className="d-flex flex-md-row gap-6 align-items-start">
            <span
              className="loyalty-slider__avatar
          text-uppercase rounded-circle
          bg-secondary-main d-flex justify-content-center align-items-center"
            >
              {firstname.slice(0, 1) + lastname.slice(0, 1)}
            </span>
            <div className="loyalty-slider__label-wrapper d-flex flex-column gap-2">
              <label
                className="loyalty-slider__passenger-name text-capitalize body-medium-regular"
                htmlFor={type}
              >
                {firstname} {lastname}
              </label>
              <label htmlFor="listType" className="body-small-regular text-tertiary">{savedPassengersType}
              </label>
            </div>
          </div>
          <CheckBoxV2
            checked={isSelected}
            onChangeHandler={() => !isSelected}
          />
        </div>
      </div>
    </div>
  );
};

LoyaltyCard.propTypes = {
  index: PropTypes.any,
  clickIt: PropTypes.func,
  loggedInUser: PropTypes.shape({
    name: PropTypes.shape({
      first: PropTypes.string,
      last: PropTypes.string,
    }),
  }),
  passenger: PropTypes.shape({
    type: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    dobYear: PropTypes.string,
    isSelected: PropTypes.bool,
    isDisabled: PropTypes.bool,
    nomineeId: PropTypes.string,
  }),
};

export default LoyaltyCard;
