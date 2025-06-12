import React from 'react';
import "./TravelAndZeroAssistance.scss";
import TravelAssistance from './TravelAssistance/TravelAssistance';
import ZeroCancellation from './ZeroCancellation/ZeroCancellation';
import { isSSRPresentAtleastForOneJourney } from '../../../utils';
import { GTM_CONSTANTS } from '../../../constants';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';


const TravelAndZeroAssistance = (props) => {
  const {
    isProtectionAdded,
    onToggleProtection,
    travelAssistance,
    cancellationAssistance,
    zeroCancellationAdded,
    onToggleZeroCancellation,
    ssrData
  } = props;

  const [travelAssistanceObj] = travelAssistance;

  const apiSSRList = ssrData?.[0]?.journeySSRs || [];
  const taSSRFound = apiSSRList?.find(
    (jssrItem) => jssrItem.category === GTM_CONSTANTS.TRAVEL_ASSISTANT_SSRCODE,
  ) || {};
  const protSSR = taSSRFound?.ssrs?.length > 0 ? taSSRFound?.ssrs[0] : {};


  const travelAssistantPrice = formatCurrency(protSSR?.price || 0, ssrData?.[0]?.currencyCode, {
    minimumFractionDigits: 0,
  });

  const zeroCancellationSSRFound = apiSSRList?.find(
    (jssrItem) => jssrItem.category === GTM_CONSTANTS.ZERO_CANCELLATION_SSRCODE,
  ) || {};
  const ifnrSSR = zeroCancellationSSRFound?.ssrs?.length > 0 ? zeroCancellationSSRFound?.ssrs[0] : {};
  const zeroCancellationPrice = formatCurrency(ifnrSSR?.price || 0, ssrData?.[0]?.currencyCode, {
    minimumFractionDigits: 0,
  });

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
  ) && travelAssistance?.[0]?.heading;
  const isZeroCancellationEnabled = isSSRPresentAtleastForOneJourney(
    apiSSRList,
    ifnrSSR.ssrCode,
  ) && cancellationAssistance?.heading;

  if (!isTravelAssistantEnabled && !isZeroCancellationEnabled) {
    return null;
  }

  return (
    <div className='tz-wrapper'>
      <div className='tz-assistances-wrapper'>
        {
          isTravelAssistantEnabled && <TravelAssistance
            travelAssistance={travelAssistanceObj}
            isProtectionAdded={isProtectionAdded}
            onToggleProtection={onToggleProtection}
            assistantPrice={travelAssistantPrice}
          />
        }
        {
          isZeroCancellationEnabled && <ZeroCancellation
            cancellationAssistance={cancellationAssistance}
            zeroCancellationAdded={zeroCancellationAdded}
            onToggleZeroCancellation={onToggleZeroCancellation}
            assistantPrice={zeroCancellationPrice}
          />
        }
      </div>
    </div>
  )
}

export default TravelAndZeroAssistance