import React, { useEffect, useMemo } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import RadioBox from 'skyplus-design-system-app/dist/des-system/RadioBox';
import {
  Pages,
  PayWithModes,
} from 'skyplus-design-system-app/src/functions/globalConstants';

import DropDown from '../common/DropDown/DropDown';

import useAppContext from '../../hooks/useAppContext';
import { formActions } from '../Form/formReducer';
import { triggerClosePopup } from '../../utils';
import { useCargo } from './CargoContext';
import { cargoFormActions } from './CargoReducer';

const { HOMEPAGE, FLIGHT_SELECT_MODIFICATION } = Pages;

const CargoBottom = () => {
  const {
    state: { main, pageType },
  } = useAppContext();

  const { state, dispatch } = useCargo();

  const onChangeTravellingReason = (value) => {
    triggerClosePopup();
    dispatch({
      type: cargoFormActions.CHANGE_TRANSPORTED_BY,
      payload: { transportedBy: value },
    });
  };

  const travellingForOptions = useMemo(() => {
    return main.transportedBy;
  }, []);

  const isSubmitButtonEnable = true; // TODO: Validation check

  const onSubmit = () => {
    if (!isSubmitButtonEnable) return;
    // TODO: Remove the console when implementing the logic for the submit button
    // eslint-disable-next-line
    console.log({ state });

  };

  useEffect(() => {
    const urlHash = new URL(window.location.href)?.hash;
    if (pageType === HOMEPAGE && urlHash === '#payWithPoints') {
      dispatch({
        type: formActions.CHANGE_FORM_ITEM,
        payload: { payWith: PayWithModes.POINTS },
      });
    }
  }, []);

  useEffect(() => {
    if (pageType === FLIGHT_SELECT_MODIFICATION) {
      try {
        const storedData = localStorage.getItem('c_m_d') || '{}';
        const parsedData = JSON.parse(storedData);

        if (parsedData && parsedData.payWith) {
          dispatch({
            type: formActions.CHANGE_FORM_ITEM,
            payload: { payWith: parsedData.payWith },
          });
        }
      } catch (error) {
        // Ignoring the error as we don't need to handle it
      }
    }
  }, [pageType]);

  return (
    <div className="bottom-container">
      <div className="iam-travellling-to">
        {travellingForOptions.length > 0 && (
          <div
            className={`iam-travellling-to__wrapper d-flex
            }`}
          >
            <div className="pt-3 left">
              {main.transportedByLabel}
              &nbsp;
            </div>
            <DropDown
              renderElement={() => (
                <div
                  className="travelling-for-value"
                  role="combobox"
                  tabIndex={0}
                  aria-controls="dropdown-menu"
                  aria-expanded={false}
                  aria-label="Travelling For "
                >
                  {state.transportedBy}
                  <Icon
                    tabIndex={-1}
                    aria-label="Travelling For dropdown expand icon"
                    role="button"
                    className="icon-accordion-down-simple"
                    size="sm"
                  />
                </div>
              )}
              containerClass="travelling-reason-dropdown"
              items={travellingForOptions}
              renderItem={({ value }) => (
                <div className="travelling-reason-dropdown__item" key={value}>
                  <RadioBox
                    onChange={onChangeTravellingReason}
                    value={value}
                    id={`reason-${value}`}
                    checked={value === state.transportedBy}
                  >
                    {value}
                  </RadioBox>
                </div>
              )}
            />
            <div className="travelling-reason-dropdown__mobile">
              {travellingForOptions?.map(({ value }) => {
                return (
                  <div
                    className="travelling-reason-dropdown__mobile__item"
                    key={value}
                  >
                    <RadioBox
                      onChange={onChangeTravellingReason}
                      value={value}
                      id={`reason-${value}`}
                      checked={value === state.transportedBy}
                    >
                      {value}
                    </RadioBox>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Button
        containerClass="search-btn"
        disabled={!isSubmitButtonEnable}
        onClick={onSubmit}
        tabIndex={isSubmitButtonEnable ? '0' : '-1'}
        role="button"
        aria-pressed="false"
        aria-disabled={!isSubmitButtonEnable}
      >
        {main.searchCtaLabel}
      </Button>
    </div>
  );
};

CargoBottom.propTypes = {};

export default CargoBottom;
