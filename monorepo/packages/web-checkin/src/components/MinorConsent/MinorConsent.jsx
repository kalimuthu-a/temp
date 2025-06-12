import React, { useContext, useMemo, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import MinorConsentForm from './MinorConsentForm';
import { AppContext } from '../../context/AppContext';
import { webcheckinActions } from '../../context/reducer';

const MinorConsent = ({ paxDetails, checkboxData, onCloseHandler }) => {
  const {
    aemLabel,
    state: { minorConsentSelection },
    dispatch,
  } = useContext(AppContext);

  const aemLabels = useMemo(() => {
    return {
      minorConsentDescription: aemLabel(
        'checkinPassenger.minorConsentPopUp.subHeading.html',
      ),
      minorConsentLabel: aemLabel('checkinPassenger.minorConsentPopUp.heading'),
      confirmButtonLabel: aemLabel(
        'checkinPassenger.minorConsentPopUp.ctaLabel',
      ),
    };
  }, [aemLabel]);

  const [selection, setSelection] = useState(minorConsentSelection);
  const [tempSelection, setTempSelection] = useState(minorConsentSelection);

  const onConsentChnage = (passengerKey, isChecked) => {
    if (isChecked) {
      setSelection(new Set([...selection, passengerKey]));
    } else {
      setSelection(new Set([...selection].filter((el) => el !== passengerKey)));
    }
  };

  const onConfirmclick = () => {
    dispatch({
      type: webcheckinActions.SET_MINOR_CONSENT_SELECTION,
      payload: { selection },
    });

    onCloseHandler();
  };

  const onCloseMinorConsent = () => {
    onCloseHandler();
  };

  return (
    <OffCanvas onClose={onCloseMinorConsent}>
      <div className="minor-container">
        <div>
          <div className="minor-container__heading">
            {aemLabels.minorConsentLabel}
          </div>
          <HtmlBlock
            className="minor-container__subHeading"
            html={aemLabels.minorConsentDescription}
          />

          <hr />
          {paxDetails?.map((paxData) => (
            <MinorConsentForm
              paxData={paxData}
              onConsentChnage={onConsentChnage}
              minorConsentCheckboxData={checkboxData}
              key={paxData.passengerKey}
              setTempSelection={setTempSelection}
            />
          ))}
        </div>

        <div className="minor-container__button">
          <Button
            containerClass=""
            disabled={
              !isEqual(selection, tempSelection) ||
              (minorConsentSelection.size === 0 && tempSelection.size === 0)
            }
            onClick={onConfirmclick}
            block
          >
            {aemLabels.confirmButtonLabel}
          </Button>
        </div>
      </div>
    </OffCanvas>
  );
};

MinorConsent.propTypes = {
  paxDetails: PropTypes.any,
  checkboxData: PropTypes.any,
  onCloseHandler: PropTypes.func,
};

export default MinorConsent;
