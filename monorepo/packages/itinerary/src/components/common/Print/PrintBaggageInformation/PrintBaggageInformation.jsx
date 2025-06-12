import React from 'react';
import { useSelector } from 'react-redux';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { CONSTANTS } from '../../../../constants';

const PrintBaggageInformation = () => {
  const journeydetail = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const passengerList = useSelector((state) => state.itinerary?.apiData?.passengers) || [];
  const bookingDetails = useSelector((state) => state.itinerary?.apiData?.bookingDetails) || [];
  const { paxList } = useSelector(
    (state) => state.itinerary?.mfDatav2?.itineraryMainByPath?.item,
  ) || {};
  const { printItineraryInformation } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};
  const printCodeShareExcessBaggageInfo = printItineraryInformation?.printCodeShareExcessBaggageInfo || '';
  const printDisclaimerTextAem = printItineraryInformation?.checkInCabinInformation || '';
  // const isAdultPresent = passengerList.find(pItem => pItem.passengerTypeCode === CONSTANTS.PASSENGER_TYPE.ADULT);
  const isChildPresent = passengerList.find((pItem) => pItem?.passengerTypeCode === CONSTANTS.PASSENGER_TYPE.CHILD);
  const hasInfant = passengerList.find((pItem) => pItem?.infant?.name?.first);
  let jouneryInfoNotThereInPassenger = true;
  if (journeydetail && journeydetail.length < 1) {
    jouneryInfoNotThereInPassenger = false;
  }
  // Comment below lines of code for feture reference
  // if (printDisclaimerTextAem) {
  //   let pieceCount = 0;
  //   journeydetail?.forEach((jItem) => {
  //     const baggageData = jItem?.journeydetail?.baggageData || {};
  //     // we have to pick the greater value and show in the disclaimer section
  //     if (baggageData?.checkinBaggageCount > pieceCount) {
  //       pieceCount = baggageData.checkinBaggageCount;
  //     }
  //   });

  //   printDisclaimerTextAem = printDisclaimerTextAem.replace('{pieceCount}', pieceCount);
  //   replacing if 0 piece comes
  //   printDisclaimerTextAem = printDisclaimerTextAem.replace(/ ?\s*0 piece only ?\|? ?/gi, '');
  // }
  let handBaggageWeight = 0;
  return (
    jouneryInfoNotThereInPassenger && (
      <div className="print-baggage-information" key={uniq()}>
        <div className="print-baggage-information__heading">
          {printItineraryInformation?.baggageInformation || 'Baggage Information'}
        </div>
        <table className="print-baggage-information__baggage-table" key={uniq()}>
          <tbody>
            <tr key={uniq()}>
              <th className="print-baggage-information__baggage-table__heading">
                {printItineraryInformation?.snoLabel || 'S No.'}
              </th>
              <th className="print-baggage-information__baggage-table__heading">
                {printItineraryInformation?.sectorLabel || 'Sector'}
              </th>
              <th className="print-baggage-information__baggage-table__heading">
                {paxList?.[0]?.paxLabel || 'paxLabel'}
              </th>
              {isChildPresent && (
              <th className="print-baggage-information__baggage-table__heading">
                {paxList?.[1]?.paxLabel || 'Child'}
              </th>
              )}
              {hasInfant && (
              <th className="print-baggage-information__baggage-table__heading">
                {paxList?.[2]?.paxLabel || 'Infant'}
              </th>
              )}
            </tr>
            {journeydetail.map((jItem, index) => {
              const baggageDataObj = jItem?.journeydetail?.baggageData || {};
              const baggageAllowance = baggageDataObj?.checkinBaggageWeight
                ? `${baggageDataObj?.checkinBaggageWeight}KG`
                : '';
              const handBaggageAllowance = `${baggageDataObj?.handBaggageWeight}KG`;
              handBaggageWeight = baggageDataObj?.handBaggageWeight;
              const codeShareExcessBaggageInfo = printCodeShareExcessBaggageInfo?.replace(
                '{checkinBaggageCount}',
                jItem?.journeydetail?.baggageData?.checkinBaggageCount,
              ).replace('{checkInBaggage}', jItem?.journeydetail?.baggageData?.checkinBaggageWeight);
              return (
                <>
                  <tr key={`${uniq()}-baggage-${index + 1}`}>
                    <td className="print-baggage-information__baggage-table__data">
                      {index + 1}
                    </td>
                    <td className="print-baggage-information__baggage-table__data
                print-baggage-information__baggage-table__sector"
                    >
                      {jItem?.journeydetail?.origin} -{' '}
                      {jItem?.journeydetail?.destination}
                    </td>
                    <td className="print-baggage-information__baggage-table__data">
                      {`Check-in: ${baggageAllowance}, Cabin: Up to ${handBaggageAllowance}`}
                    </td>
                    {isChildPresent && (
                    <td className="print-baggage-information__baggage-table__data">
                      {`Check-in: ${baggageAllowance}, Cabin: Up to ${handBaggageAllowance}`}
                    </td>
                    )}
                    {hasInfant && (
                    <td className="print-baggage-information__baggage-table__data">
                      {`Cabin: Up to ${handBaggageAllowance}`}
                    </td>
                    )}
                  </tr>
                  {bookingDetails?.recordLocators?.length > 0
                    && (
                    <tr>
                      <td className="print-baggage-information__disclaimer" colSpan={3}>
                        {codeShareExcessBaggageInfo}
                      </td>
                    </tr>
                    )}
                </>
              );
            })}
          </tbody>
        </table>
        {printDisclaimerTextAem && (
          <div
            className="print-baggage-information__disclaimer"
            key={uniq()}
            dangerouslySetInnerHTML={{
              __html: printDisclaimerTextAem?.html?.replace('{weight}', handBaggageWeight).replace('{legth}', 115),
            }}
          />
        )}
      </div>
    )
  );
};

PrintBaggageInformation.propTypes = {};

export default PrintBaggageInformation;
