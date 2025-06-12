import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { useSeatMapContext } from '../../store/seat-map-context';
import './PassengerTitle.scss';

const PassengerTitle = () => {
  const { seatAdditionalAemData, passengerData, authUser, currencyCode } = useSeatMapContext();
  const { travelSoloLabel, travelInfantLabel, travelFriendsLabel, travelPartnerLabel } = seatAdditionalAemData || {};

  const hasInfant = Object.values(passengerData)?.some(({ infant }) => infant !== undefined && infant !== null);

  const addTravelSoloLabelToText = (desc) => {
    return { html: desc?.html?.replace('{currencyCode}', currencyCode || '') };
  };

  const headingValue = () => {
    if (hasInfant) {
      return travelInfantLabel;
    }

    if (passengerData?.length > 1 && passengerData?.length < 4) {
      return travelPartnerLabel;
    }
    if (passengerData?.length >= 4) {
      return travelFriendsLabel;
    }

    return addTravelSoloLabelToText(travelSoloLabel);
  };
  if (!authUser?.loyaltyMemberInfo?.FFN) {
    return (
      <HtmlBlock className="passenger-type-header" html={headingValue()?.html} />
    );
  }
  return null;
};

export default PassengerTitle;
