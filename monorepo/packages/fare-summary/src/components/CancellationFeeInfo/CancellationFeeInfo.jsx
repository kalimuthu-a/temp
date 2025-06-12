import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { useFareSummaryContext } from '../../store/fare-summary-context';
import { getIsInternational } from '../../utils';
import './CancellationFeeInfo.scss';
import { handleNorseFlights, norsePriceObj } from '../../utils/norseFlight';

const CancellationFeeInfo = () => {
  const { aemData, fareSummaryData } = useFareSummaryContext();
  const specialFareCode = fareSummaryData?.bookingDetails?.specialFareCode || '';
  const specialFaresList = aemData?.specialFareList || [];
  const isInternational = getIsInternational(fareSummaryData);

  const getFareTypeLabel = () => {
    let text = '';
    if (specialFareCode) {
      const foundSpecialFareObj = specialFaresList.find((i) => i.specialFareCode === specialFareCode) || {};
      text = foundSpecialFareObj?.specialFareBadge || foundSpecialFareObj?.specialFareLabel;
    }
    const pClass = fareSummaryData?.journeysDetail?.[0]?.segments?.[0]?.productClass || '';
    const fareListAem = aemData?.fareTypesList || [];
    const fareObj = fareListAem.find((fItem) => fItem?.productClass === pClass) || {};
    if (!text) {
      text = fareObj?.fareLabel || pClass;
    }
    return [fareObj, text];
  };

  const [fareObject, fareLabel] = getFareTypeLabel();
  const {
    values = [],
    secondaryValues = [],
    labels = []
  } = handleNorseFlights(fareSummaryData?.journeysDetail?.[0]?.segments?.[0], fareObject?.servicesWithFleetType);

  const fleetFareType = norsePriceObj(secondaryValues);
  const fleetDurationLabel = labels?.map(item => item?.value);
  const getCancellationAmount = (idx = 0) => {
    const key = isInternational
      ? `internationalCancellationCharges${idx + 1}`
      : `domesticCancellationCharges${idx + 1}`;
    if (values?.length > 0) {
      return fleetFareType?.[key] ?? 0
    } else {
      return fareObject?.[key] ?? 0;
    }
  };

  const durationTitleLabel = (values?.length > 0 ? fleetDurationLabel : fareObject?.durationLabel) || aemData?.durationLabels;
  return (
    <>
      <div className="cancellation-fee-title-wrapper flex-h-between">
        <h6>{aemData?.cancellationLabel}</h6>
        <Chip
          color="info"
          variant="filled"
          withBorder
          containerClass="fare-type"
        >
          {fareLabel}
        </Chip>
      </div>
      <div className="cancellation-fee-info t-3 lh-2">
        {
          durationTitleLabel?.map((item, idx) => {
            return (
              <div className="fee-row flex-h-between" key={uniq()}>
                <span>{item}</span>
                <span>{getCancellationAmount(idx)}</span>
              </div>
            );
          })
        }
      </div>
    </>
  );
};

CancellationFeeInfo.propTypes = {
};
export default CancellationFeeInfo;
