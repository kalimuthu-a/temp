import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import {
  uniq,
  formattedMessage,
} from 'skyplus-design-system-app/dist/des-system/utils';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import Modal from '../../common/Modal';
import useAppContext from '../../../hooks/useAppContext';
import TableRow from './TableRow';
import { handleNorseFlights } from '../../../utils/norseFlights';

const KnowMore = ({
  onClose,
  productClasses,
  isInternational,
  passengerFares,
  segments,
}) => {
  const [isMobile] = useIsMobile();

  const {
    state: { additional, flightSearchData },
  } = useAppContext();

  const { fareCategoryDisclaimer, fareCategoryColumns, fareTypeLabel } =
    additional.fareCategoryData;

  const filteredFareCategoryColumns = useMemo(() => {
    return (
      fareCategoryColumns?.filter((column) => {
        return productClasses.includes(column.productClass);
      }) ?? []
    );
  }, []);

  const tables = useMemo(() => {
    const leftIndex = {
      key: 'heading',
      label: fareTypeLabel,
    };
    const headings = [];
    const tableData = [];
    let fareCategoryDescriptionsColums = [];
    const getMatchingKey = (arrayData, keyToFind) => (arrayData?.find((item) => (
      item.key === keyToFind
    )));
    filteredFareCategoryColumns.forEach((column) => {
      const {
        productClass = '',
        fareLabel = '',
        fareCategoryDescriptions = [],
      } = column;
      headings.push({
        key: productClass,
        label: fareLabel,
      });

      if (fareCategoryDescriptions.length > 0) {
        fareCategoryDescriptionsColums = fareCategoryDescriptions;
      }
    });

    fareCategoryDescriptionsColums?.forEach((description, index) => {
      const { key } = description;

      tableData.push({
        key: uniq(),
        heading: key,
      });

      filteredFareCategoryColumns?.forEach((column) => {
        const {
          productClass,
          fareCategoryDescriptions = [],
          fleetAndSectorSpecificFareCategoryDescription = [],
        } = column;
        const { values = [] } = handleNorseFlights(segments[0], fleetAndSectorSpecificFareCategoryDescription);
        const keyToUpdate = getMatchingKey(values, key);
        if (keyToUpdate) {
          tableData[index][productClass] = keyToUpdate?.description?.html;
        } else {
          tableData[index][productClass] =
            getMatchingKey(fareCategoryDescriptions, key)?.description?.html;
        }
      });
    });

    if (!isMobile) {
      return [
        {
          headings: [leftIndex, ...headings],
          data: tableData,
          key: uniq(),
        },
      ];
    }

    return headings.map((row) => ({
      headings: [leftIndex, row],
      data: tableData,
      key: uniq(),
    }));
  }, [isMobile]);

  const fareTypeMeta = useMemo(() => {
    const data = {};
    const { yesLabel = 'Yes', noLabel = 'No' } = additional;

    additional?.fareTypeList.forEach((fareType) => {
      const { productClass } = fareType;
      const {
        secondaryValues = [],
      } = handleNorseFlights(segments[0], fareType?.servicesWithFleetType);

      const fleetFareType = secondaryValues?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {}) || {};

      const fareConfigItem = passengerFares.find(
        (fareConfigRow) => fareConfigRow.productClass === productClass,
      );

      const fareConfigApiItem =
        flightSearchData?.configSettings?.fareConfig?.find(
          (fareConfigRow) => fareConfigRow.productClass === productClass,
        );

      const changeCharges1 = isInternational
        ? fareType?.internationalChangeCharges1
        : fareType?.domesticChangeCharges1;

      const cancellationCharges1 = isInternational
        ? fareType?.internationalCancellationCharges1
        : fareType?.domesticCancellationCharges1;

      const changeCharges2 = isInternational
        ? fareType?.internationalChangeCharges2
        : fareType?.domesticChangeCharges2;

      const cancellationCharges2 = isInternational
        ? fareType?.internationalCancellationCharges2
        : fareType?.domesticCancellationCharges2;

      // Norse Flight change/cancellation
      const fleetTypeChangeCharges1 = isInternational ?
        fleetFareType?.internationalChangeCharges1
        : fleetFareType?.domesticChangeCharges1;

      const fleetTypeCancellationCharges1 = isInternational ?
        fleetFareType?.internationalCancellationCharges1
        : fleetFareType?.domesticCancellationCharges1;

      const fleetTypeChangeCharges2 = isInternational ?
        fleetFareType?.internationalChangeCharges2
        : fleetFareType?.domesticChangeCharges2;

      const fleetTypeCancellationCharges2 = isInternational ?
        fleetFareType?.internationalCancellationCharges2
        : fleetFareType?.domesticCancellationCharges2;

      data[productClass] = {
        ...fareType,
        isMealIncluded: noLabel,
        isStandarSeatIncluded: noLabel,
        checkInBaggageValue: fareConfigItem?.baggageData?.checkinBaggageWeight,
        handBaggageValue: fareConfigItem?.baggageData?.handBaggageWeight,
        handBaggageCount: fareConfigItem?.baggageData?.handBaggageCount,
        discountOnXLSeat: fareConfigApiItem?.discountOnXLSeat,
        internationalCancellationCharges2: secondaryValues?.length > 0 ?
          fleetFareType?.internationalChangeCharges2 : fareType.internationalChangeCharges2,
        changeCharges1: secondaryValues?.length > 0 ? fleetTypeChangeCharges1 : changeCharges1,
        changeCharges2: secondaryValues?.length > 0 ? fleetTypeChangeCharges2 : changeCharges2,
        cancellationCharges1: secondaryValues?.length > 0 ? fleetTypeCancellationCharges1 : cancellationCharges1,
        cancellationCharges2: secondaryValues?.length > 0 ? fleetTypeCancellationCharges2 : cancellationCharges2,
      };

      if (fareConfigItem?.isMealIncluded) {
        data[productClass].isMealIncluded = yesLabel;
      }
      if (fareConfigItem?.isStandarSeatIncluded) {
        data[productClass].isStandarSeatIncluded = yesLabel;
      }
    });
    return data;
  }, []);

  return (
    <Modal size="xl" onClose={onClose} containerClass="h-100">
      <div className="fare-price-know-more">
        <div className="table-container">
          {tables.map((table) => {
            const headingsToShow = table.headings.map((heading) => heading.key);
            return (
              <div role="table" className="table" key={table.key}>
                <div role="row" className="table-thead-row">
                  {table.headings.map((heading) => (
                    <div
                      role="columnheader"
                      key={heading.key}
                      className="table-thead-row-head"
                    >
                      {heading.label}
                    </div>
                  ))}
                </div>
                {table.data.map((row) => {
                  return (
                    <div role="row" className="table-body-row" key={row.key}>
                      {headingsToShow.map((heading) => {
                        const html = formattedMessage(
                          row[heading] ?? '',
                          fareTypeMeta[heading] ?? {},
                        );

                        return <TableRow html={html} key={heading} />;
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <HtmlBlock html={fareCategoryDisclaimer.html} className="terms" />
      </div>
    </Modal>
  );
};

KnowMore.propTypes = {
  onClose: PropTypes.func,
  productClasses: PropTypes.arrayOf(PropTypes.string),
  isInternational: PropTypes.bool,
  passengerFares: PropTypes.arrayOf(PropTypes.object),
  segments: PropTypes.arrayOf(PropTypes.object),
};

export default KnowMore;
