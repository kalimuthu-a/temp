import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import CheckBoxV2 from 'skyplus-design-system-app/src/components/CheckBoxV2/CheckBoxV2';
import './TravelAssistance.scss';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import { GTM_CONSTANTS } from '../../../constants';
import { isSSRPresentAtleastForOneJourney } from '../../../utils';
import { TA_AEM_KEYS } from '../../../constants/constants';

const TravelAssistance = ({
  travelAssistance,
  ssrData,
  isProtectionAdded, // '' = default, true = selected, false = unselected
  onToggleProtection,
}) => {
  const [currentTAData, setCurrentTAData] = useState({});

  const updateCurrentState = (protectionAdded) => {
    onToggleProtection(protectionAdded);
    if (protectionAdded === true) {
      setCurrentTAData(travelAssistance?.find((item) => item.travelAssistanceType === TA_AEM_KEYS.SELECTED));
    } else if (protectionAdded === false) {
      setCurrentTAData(travelAssistance?.find((item) => item.travelAssistanceType === TA_AEM_KEYS.UNSELECTED));
    } else {
      setCurrentTAData(travelAssistance?.find((item) => item.travelAssistanceType === TA_AEM_KEYS.DEFAULT));
    }
  };

  useEffect(() => {
    const travelAssiatanceEvent = new CustomEvent('TRAVEL_ASSISTANCE_ADDED', {
      bubbles: true,
      detail: { isTravelAssistance: !!isProtectionAdded },
    });

    document.dispatchEvent(travelAssiatanceEvent);
  }, [isProtectionAdded]);

  useEffect(() => {
    updateCurrentState(isProtectionAdded);
  }, []);

  const apiSSRList = ssrData?.[0]?.journeySSRs || [];
  const taSSRFound = apiSSRList?.find(
    (jssrItem) => jssrItem.category === GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE,
  ) || {};
  const protSSR = taSSRFound?.ssrs?.length > 0 ? taSSRFound?.ssrs[0] : {};
  const travelProtIntlSSr = [
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE,
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE_INTL0,
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE_INTL1,
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE_INTL2,
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE_INTL3,
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE_INTL4,
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE_INTL5,
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE_INTL6,
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE_INTL7,
    GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE_INTL8,
  ];
  const isTravelAssistantEnabled = isSSRPresentAtleastForOneJourney(
    apiSSRList,
    travelProtIntlSSr,
  );

  const travelAssistantPrice = formatCurrency(protSSR?.price || 0, ssrData?.[0]?.currencyCode, {
    minimumFractionDigits: 0,
  });

  if (!isTravelAssistantEnabled) {
    return null;
  }

  return (
    <div className="travel-assistance">
      <div
        className={`travel-assistance__container 
        ${
          // eslint-disable-next-line no-nested-ternary
          isProtectionAdded === ''
            ? ''
            : isProtectionAdded
              ? 'protection-added'
              : 'protection-not-added'
        }`}
      >
        {isProtectionAdded && (
          <Button
            onClick={() => {
              updateCurrentState('');
            }}
            variant="outline"
            color="secondary"
            size="medium"
            containerClass="travel-assistance__added-section"
          >
            <span>{currentTAData?.addedLabel}</span>
            <span className="icon-close-circle" />
          </Button>
        )}
        <div className="travel-assistance__label">{currentTAData?.note}</div>
        <div className="travel-assistance__title">
          {currentTAData?.heading} {travelAssistantPrice}
        </div>

        <div
          className="travel-assistance__description"
          dangerouslySetInnerHTML={{
            __html: currentTAData?.description?.html,
          }}
        />

        {!isProtectionAdded && (
          <div className="travel-assistance__input-section py-4">
            <div className="travel-assistance__input-section__checkbox-container">
              <CheckBoxV2
                name="selectTravelAssistance"
                id="selectTravelAssistance"
                description={currentTAData?.rejectText}
                descClass="body-large-regular"
                containerClass="gap-8"
                onChangeHandler={() => {
                  updateCurrentState(isProtectionAdded === '' ? false : '');
                }}
                // eslint-disable-next-line no-unneeded-ternary
                checked={isProtectionAdded === '' ? false : true}
              />
            </div>
            {currentTAData?.rejectMessage ? (
              <div
                className="travel-assistance__input-section__warning"
                aria-label={currentTAData?.rejectMessage}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex="0"
              >
                {currentTAData?.rejectMessage}
              </div>
            ) : (
              ''
            )}
            <div className="travel-assistance__input-section__button-container">
              <Button
                onClick={() => {
                  updateCurrentState(true);
                }}
              >
                <span>{currentTAData?.acceptText}</span>
                <span className="circle">
                  <span className="icon-Group-1321315461" />
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="travel-assistance__terms">
        <div className="travel-assistance__terms__left-section">
          {!isProtectionAdded && (
            <p
              dangerouslySetInnerHTML={{
                __html: currentTAData?.termsAndConditions?.html,
              }}
            />
          )}
        </div>
        <div className="travel-assistance__terms__right-section">
          <div className="logo-title">{currentTAData?.logoImageNote}</div>
          {currentTAData?.logoImage?._publishUrl ? (
            <div className="logo">
              <img
                src={currentTAData?.logoImage?._publishUrl}
                alt={currentTAData?.logoImageNote}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

TravelAssistance.propTypes = {
  travelAssistance: PropTypes.array,
  ssrData: PropTypes.array,
  isProtectionAdded: PropTypes.bool.isRequired,
  onToggleProtection: PropTypes.func.isRequired,
};

export default TravelAssistance;
