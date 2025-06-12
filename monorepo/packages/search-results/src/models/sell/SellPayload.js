import { isLoyalty, isBurn } from '../../utils';

export default class SellPayload {
  preventOverlap = true;

  keys = [];

  suppressPassengerAgeValidation = true;

  passengers = {};

  currencyCode = 'INR';

  infantCount = 0;

  promotionCode = '';

  vaxDoseNo = '';

  sourceOrganization = '';

  isLoyalty = isLoyalty();

  constructor(selectedFares, currencyCode, selectedPromoInfo, sliderSelectedValues, payWith, isRedeemTransaction) {
    this.keys = selectedFares.map((r) => ({
      journeyKey: r.journeyKey,
      fareAvailabilityKey: r.fare.fareAvailabilityKey,
      standbyPriorityCode: '',
      inventoryControl: 'HoldSpace',
    }));
    this.currencyCode = currencyCode;

    const promocode = selectedFares.find((row) => row?.fare?.specialFareCode);
    const selectedFareWithPromoCode = selectedFares.find((row) => row?.fare?.promoCode);
    const loyaltyPromoCode = selectedFareWithPromoCode?.fare?.promoCode || '';

    this.promotionCode =
      promocode?.fare?.specialFareCode || selectedPromoInfo || '';

    const cashAndPoinstDetails = sliderSelectedValues || {
      cashPercentage: 100,
      milesPercentage: 0,
    };

    this.loyaltyRequest = {
      ...(this.isLoyalty && {
        loyaltyRequest: {
          loyaltyPromoCode,
          isRedeemTransaction: isRedeemTransaction ?? isBurn(payWith),
          ...cashAndPoinstDetails,
        },
      }),
    };
  }
}
