import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import CheckBoxV2 from 'skyplus-design-system-app/dist/des-system/CheckBoxV2';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import sanitizeHtml from 'skyplus-design-system-app/dist/des-system/sanitizeHtml';
import { AppContext } from '../../../context/appContext';
import { PAX_TYPES } from '../../../constants';
import { calculateYearsFromDate, getTypeString } from '../../../helpers';
import './SavedPassengers.scss';

function SavedPassengersSideBar({ onCloseClick, clickIt }) {
  const {
    state,
    state: {
      savedPassengers,
      loggedInUser,
      ssr,
      aemMainData: { passengersListTitle, selectedLabel, doneLabel },
    },
  } = useContext(AppContext);

  const accessSavedPassengerHtml = sanitizeHtml(
    state?.aemMainData?.accessSavedPassenger?.html,
  );

  const [allSavedPassengers, setAllSavedPassengers] = useState(savedPassengers);
  const [searchVal, setSearchVal] = useState('');
  const travelDate = ssr?.[0]?.journeydetail?.departure;

  useEffect(() => {
    setAllSavedPassengers(savedPassengers);
  }, [savedPassengers]);

  // const clickCheckHandler = (index) => {
  //   const updatedPassengers = [...allSavedPassengers];
  //   updatedPassengers[index].isSelected = !updatedPassengers[index].isSelected;
  //   setAllSavedPassengers(updatedPassengers);
  // };

  const clickDoneHandler = () => {
    // const selectedFavPax = allSavedPassengers.filter((pax) => pax.isSelected);
    onCloseClick();
    // onPassengersSelect(allSavedPassengers, selectedFavPax);
  };

  function generateStr(type) {
    const typeStr = getTypeString(type);
    const count = allSavedPassengers.filter(
      (pax) => pax?.type === typeStr.charAt(0).toUpperCase() + typeStr.slice(1),
    );
    const selectedCount = count.filter((pax) => pax?.isSelected);
    if (count.length < 1) return '';
    return `${selectedCount.length}/${count.length} ${typeStr}`;
  }

  const selectedPax = allSavedPassengers.filter((pax) => pax?.isSelected);
  const searchedPax = allSavedPassengers
    .map((pax, index) => ({ ...pax, originalIndex: index }))
    .filter((pax) => pax?.firstname?.toLowerCase()?.includes?.(searchVal.toLowerCase()));

  const arr = PAX_TYPES.map((type) => generateStr(type));

  return (
    <OffCanvas
      containerClassName="sp-sidebar is-hidden"
      renderFooter={() => (
        <div className="py-8 px-4 w-100 z-10">
          <Button
            containerClass="w-100"
            onClick={clickDoneHandler}
            {...{ block: true }}
          >
            {doneLabel}
          </Button>
        </div>
      )}
    >
      <div
        className="sp-sidebar__body vh-100
          bg-white position-fixed vh-100 end-0 top-0 w-100 z-10 h-100 w-100 d-flex flex-column bg-white px-10"
      >
        <div className="header">
          <span
            aria-hidden="true"
            onClick={onCloseClick}
            className="sp-sidebar__close-icon
                icon-close-simple icon-size-lg bg-white border-0 px-4 pt-6 d-inline-block pt-md-12"
          />
          <h3 className="sp-sidebar__heading mt-6 text-uppercase mt-md-12 h0">
            {passengersListTitle}
          </h3>
          <div
            className="sp-sidebar__subheading mt-4 mt-md-8"
            dangerouslySetInnerHTML={{
              __html: accessSavedPassengerHtml,
            }}
          />
        </div>
        <div
          className="sp-sidebar__info-card
            mt-6 d-flex flex-column align-items-center gap-6 border-1 bg-white p-2 pb-6"
        >
          <div
            className="sh8 sp-sidebar__info-heading
              d-flex w-100 align-items-center
              justify-content-center py-4 rounded-4 bg-primary-main fw-semibold text-white"
          >
            {selectedPax.length}/{allSavedPassengers.length} {selectedLabel}
          </div>
          <div className="sp-sidebar__info-text text-capitalize text-center body-small-regular">
            <span>{arr.filter((el) => el).join(', ')}</span>
          </div>
        </div>
        <div
          className="sp-sidebar__search-container
            mt-8 d-flex w-100 align-items-center gap-8 border-1 bg-white px-6 py-5 px-md-8 gap-md-8 py-md-6"
        >
          <span className="sp-sidebar__search-icon icon-search d-inline-block" />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="sp-sidebar__search h-100 position-relative w-100 border-0 link-small"
            type="search"
            placeholder="Search"
          />
        </div>
        <div className="sp-sidebar__results mt-12 overflow-auto flex-grow-1 pb-25">
          <ul className="d-flex flex-column gap-6 gap-md-8 pb-25">
            {searchedPax.map((passenger, index) => {
              const {
                type,
                title,
                firstname,
                lastname,
                dobDay,
                dobMonth,
                dobYear,
                isDisabled,
              } = passenger;
              const age = calculateYearsFromDate(
                `${dobDay}-${dobMonth}-${dobYear}`,
                travelDate,
              );

              return (
                <li
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  onClick={(e) => clickIt(passenger.originalIndex, e, firstname, lastname)}
                  className={`${
                    passenger.isSelected
                      ? 'sp-sidebar__card--active bg-secondary-light'
                      : ''
                  } ${isDisabled ? 'disabled-saved-pax' : null} sp-sidebar__card d-flex 
                      align-items-start justify-content-between
                       gap-6 rounded border border-1 bg-white p-6 px-md-12 py-md-8`}
                  aria-hidden="true"
                >
                  <div className="sp-sidebar__initials-label d-flex gap-6 gap-md-8 align-items-center">
                    <div
                      className="sh7 sp-sidebar__initials bg-secondary-main d-flex
                        align-items-center justify-content-center rounded-circle text-uppercase"
                    >
                      <span>
                        {firstname.slice(0, 1) + lastname.slice(0, 1)}
                      </span>
                    </div>
                    <div className="content">
                      <h4 className="sp-sidebar__card-name text-capitalize">
                        {`${firstname} ${lastname} ${
                          loggedInUser?.name?.first === firstname
                          && loggedInUser?.name?.last === lastname
                            ? '(You)'
                            : ''
                        }`}
                      </h4>
                      <h4 className="sp-sidebar__card-type text-capitalize link-small">
                        {/* eslint-disable-next-line i18next/no-literal-string */}
                        {type} | <span>{title}</span>{age && age >= 0 ? <span> | {age} years</span> : null}
                      </h4>
                    </div>
                  </div>
                  <CheckBoxV2
                    containerClass="pt-3"
                    checked={passenger.isSelected || false}
                    onChangeHandler={() => !passenger.isSelected}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </OffCanvas>
  );
}

SavedPassengersSideBar.propTypes = {
  onCloseClick: PropTypes.func,
  clickIt: PropTypes.func,
};

export default SavedPassengersSideBar;
