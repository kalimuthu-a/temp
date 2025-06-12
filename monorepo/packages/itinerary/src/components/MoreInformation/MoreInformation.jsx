import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { getFareConfigObjByProductClass } from '../AppEntry/utilMethods';
// import HtmlBlock from "skyplus-design-system-app/dist/des-system/HtmlBlock";

export const KEYS = {
  NOTES: 'Note',
  BAGGAGE: 'BaggageAllowanceDomestic',
  BAGGAGE_INTERNATIONAL: 'BaggageAllowanceInternational',
  SERVICES: 'Services',
  TERMS: 'TermsNConditions',
  TERMINAL: 'TerminalInformation',
  CANCELLED: 'CancelledFlightInfo',
  DYNAMIC_BAGGAGE: 'dynamicBaggage',
};

const MoreInformation = () => {
  const [toggle, setToggle] = useState(null);
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const { moreInfoOptions, moreInfoLabel,
    paymentDetails } = mfData?.itineraryMainByPath?.item || {};
  const journeysDetailArray = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const fareConfigArray = useSelector((state) => state.itinerary?.apiData?.fsConfig?.FareConfig) || [];
  const { fareTypesList } = paymentDetails || [];

  const handleToggle = (id) => {
    if (toggle === id) {
      setToggle(null);
      return false;
    }
    setToggle(id);
    return true;
  };
  const renderDetails = (keys, baggageContent, content) => {
    if (keys === KEYS.BAGGAGE) {
      return (
        <div dangerouslySetInnerHTML={{
          __html: baggageContent,
        }}
        />
      );
    }
    return <div dangerouslySetInnerHTML={{
      __html: content?.html,
    }}
    /> || '';
  };
  const renderIcon = (id) => { // eslint-disable-line consistent-return
    const className = 'accordion__header__logo__';
    switch (id) {
      case KEYS.NOTES:
        return 'icon-note';
      case KEYS.BAGGAGE:
        return 'icon-baggage-allowance';
      case KEYS.BAGGAGE_INTERNATIONAL:
        return 'icon-baggage-allowance';
      case KEYS.SERVICES:
        return `${className}icservice`;
      case KEYS.TERMS:
        return 'icon-terms-and-conditions';
      case KEYS.TERMINAL:
        return 'icon-terminal-information';

      case KEYS.CANCELLED:
        return 'icon-flight-delay';

      default:
        break;
    }
  };
  const renderExpandItem = (item, labelKey, journeydetail) => {
    const { key, iconText, description } = item;
    const isExpand = toggle === (labelKey.indexOf('Baggage Allowance') > -1
      ? `${labelKey}-${journeydetail?.origin}-${journeydetail?.destination}`
      : labelKey);
    return (
      <React.Fragment key={uniq()}>
        {labelKey && (
          <div
            className="accordion__header"
            role="button"
            tabIndex="0"
            onClick={
              () => handleToggle(
                labelKey.indexOf('Baggage Allowance') > -1
                  ? `${labelKey}-${journeydetail?.origin}-${journeydetail?.destination}`
                  : labelKey,
              )
}
            onKeyDown={(e) => { if (e.key === 'Enter') handleToggle(labelKey); }}
            key={uniq() + key}
          >
            <div className="accordion__header__logo">
              {key === KEYS.BAGGAGE_INTERNATIONAL || key === KEYS.BAGGAGE ? (
                <i className={`iconmoon-baggage ${renderIcon(key)}`} />
              ) : (
                <i className={`indigoIcon ${renderIcon(key)}`} />
              )}
            </div>
            <div className="accordion__header__title">
              {labelKey}{' '}
              {key === KEYS.BAGGAGE && (
                <p className="accordion__header__subtitle">
                  {`${journeydetail?.origin}-${journeydetail?.destination}`}
                </p>
              )}
            </div>
            <div
              className={`accordion__header__arrowicon ${
                isExpand
                  ? 'icon-accordion-up-simple'
                  : 'icon-accordion-down-simple'
              }`}
            />
          </div>
        )}
        {isExpand && (
          <div className="accordion__service-table">
            {renderDetails(key, iconText, description)}
          </div>
        )}
      </React.Fragment>
    );
  };
  const renderOrder = [
    KEYS.NOTES,
    KEYS.DYNAMIC_BAGGAGE,
    KEYS.SERVICES,
    KEYS.TERMS,
    KEYS.TERMINAL,
    KEYS.CANCELLED,
  ];

  return (
    <div className="accordion">
      <h2 className="accordion__heading" dangerouslySetInnerHTML={{ __html: moreInfoLabel?.html }} />

      <div className="accordion__container">
        {renderOrder.map((renderKey) => {
          let lookupKey = renderKey;
          if (lookupKey === KEYS.DYNAMIC_BAGGAGE) {
            lookupKey = KEYS.BAGGAGE;
          }
          const item = moreInfoOptions?.find((i) => i.key === lookupKey) || {};
          const iconLabel = item?.title || '';
          if (renderKey === KEYS.DYNAMIC_BAGGAGE) {
            return journeysDetailArray.map((jItem) => {
              const journeydetail = jItem?.journeydetail || {};
              const jouneryProductKey = (jItem?.segments) ? (jItem?.segments[0]?.productClass) : '';
              const fareConfigObj = getFareConfigObjByProductClass(fareConfigArray, jouneryProductKey) || {};
              const baggageDataObj = journeydetail?.baggageData || {};
              let labelKeyTemp = iconLabel;
              const fareType = fareTypesList?.filter(
                (fareTypes) => fareTypes?.productClass?.toLowerCase() === fareConfigObj?.productClass?.toLowerCase(),
              )?.[0]?.fareLabel;
              labelKeyTemp = labelKeyTemp
                .replace('{faretype}', `${fareType} Sector`)
                .replace('{}', journeydetail?.origin)
                .replace('{}', journeydetail?.destination);
              // NOSONAR
              // eslint-disable-next-line max-len
              // let baggageAllowance = jItem?.segments[0] && jItem?.segments[0]?.baggageAllowanceWeight ? `${jItem?.segments[0].baggageAllowanceWeight}kgs` : ""; // eslint-disable-line max-len
              const handBaggageAllowance = `${baggageDataObj?.handBaggageWeight}`;
              const baggageAllowance = `${baggageDataObj?.checkinBaggageWeight}`;
              const checkinLimitPerPiece = baggageDataObj?.checkinLimitPerPiece > 0
                ? baggageDataObj?.checkinLimitPerPiece : '';
              const baggageAllowanceStr = baggageDataObj?.checkinBaggageCount > 0
                ? baggageDataObj?.checkinBaggageCount : '';
              const baggageAllowanceWithCheckInLimit = checkinLimitPerPiece ? ' piece |' : ' piece';
              const tempItem = { ...item };
              tempItem.iconText = tempItem?.description?.html
                ?.replaceAll('{baggageAllowance}', `<b>${baggageAllowance}</b>`)
                ?.replaceAll('{baggageAllowanceCount}', baggageAllowanceStr)
                ?.replace(
                  '{handBaggageAllowance}',
                  `<b>${handBaggageAllowance}</b>`,
                )
                ?.replace(
                  '{handBaggageAllowanceCount}',
                  `${baggageDataObj?.handBaggageCount}`,
                )
                ?.replaceAll('{checkinLimitPerPiece}', checkinLimitPerPiece)
                ?.replaceAll(' piece |', baggageAllowanceStr !== '' ? baggageAllowanceWithCheckInLimit : '')
                ?.replaceAll(' kg each', checkinLimitPerPiece !== '' ? ' kg each ' : '')
                ?.replaceAll('( )', '');

              return renderExpandItem(tempItem, labelKeyTemp, journeydetail);
            });
          }
          if (renderKey === KEYS.SERVICES && journeysDetailArray.length < 1) {
            return null; // if journey details is null then we should not how this section
          }
          return renderExpandItem(item, iconLabel);
        })}
      </div>
    </div>
  );
};

export default MoreInformation;
