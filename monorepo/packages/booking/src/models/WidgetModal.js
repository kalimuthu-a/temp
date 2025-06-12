/* eslint-disable implicit-arrow-linebreak */
import camelCase from 'lodash/camelCase';
import find from 'lodash/find';
import { paxCodes } from 'skyplus-design-system-app/src/functions/globalConstants';
import { isSMEAdmin, isSMEUser } from '../utils';

class WidgetModal {
  allTriptypes = [];

  specialFareList = [];

  paxType = [];

  constructor(obj, aemData, aemAdditionalData) {
    Object.assign(this, obj);

    const { paxType } = obj;

    this.allTriptypes = this.journeysAllowed
      .map((journeyType) => {
        return aemData?.journeyType.find(
          (row) => row?.journeyTypeCode === journeyType,
        );
      })
      .filter(Boolean)
      .map((row) => ({
        ...row,
        value: camelCase(row?.journeyTypeCode),
        label: row?.journeyTypeLabel,
      }));

    const apiSpecialfareList = Object.values(obj?.specialFares);

    aemAdditionalData?.specialFaresList?.forEach((specialFare) => {
      const { specialFareCode } = specialFare;

      const apiSpecialfare = apiSpecialfareList?.find(
        (row) => row?.specialfarecode === specialFareCode,
      );

      if (apiSpecialfare && apiSpecialfare?.activeOnly) {
        this.specialFareList.push({
          ...apiSpecialfare,
          ...specialFare,
        });
      }
    });

    this.paxType = paxType.map((r) => {
      const aemPax = find(aemAdditionalData.paxList, {
        typeCode: r.typeCode,
        ...(r.discountCode && { discountCode: r.discountCode }),
      });

      return {
        ...r,
        paxKey: r.discountCode || r.typeCode,
        ...aemPax,
      };
    });

    if (isSMEAdmin() || isSMEUser()) {
      this.paxType = this.paxType.filter(
        (row) => row.typeCode === paxCodes.adult.code && !row.discountCode,
      );
    }
  }

  getTripTypes(journeysAllowed) {
    return this.allTriptypes.filter(({ journeyTypeCode }) => {
      return journeysAllowed?.includes(journeyTypeCode);
    });
  }
}

export default WidgetModal;
