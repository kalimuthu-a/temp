import parse from 'date-fns/parse';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { dateFormats, localStorageKeys, LOYALTY_FLOWS } from '../../constants';
import LocalStorage from '../../utils/LocalStorage';
import SearchPayload from './SearchPayload';

const convertToDate = (dateStr) => {
  if (!dateStr) {
    return new Date();
  }

  const dateWithoutTime = dateStr.split('T')?.[0];
  return parse(dateWithoutTime, dateFormats.yyyyMMdd, new Date());
};

class BookingFlow extends SearchPayload {
  isModificationFlow = false;

  constructor() {
    super();
    const context = LocalStorage.getAsJson(localStorageKeys.bw_cntxt_val);
    const { payWith = LOYALTY_FLOWS.cash } = context;
    Object.assign(this, { ...context, payWith });

    const deepLinkPromoCode = sessionStorage.getItem('deepLinkPromoCode');

    const { selectedSpecialFare, selectedPromoInfo } = this;

    if (selectedPromoInfo) {
      this.selectedPromoInfo = selectedPromoInfo;
    } else if (deepLinkPromoCode) {
      try {
        const { value, expiry } = JSON.parse(deepLinkPromoCode);
        const diffInSeconds = differenceInSeconds(new Date(expiry), new Date());

        if (value?.promoCode === this.selectedPromoInfo) {
          this.selectedPromoInfo = '';
        }
        if (diffInSeconds > 0) {
          this.selectedPromoInfo = value?.promoCode || '';
        }
      } catch (error) {
        this.selectedPromoInfo = '';
      }
    }

    this.payloadPromotionCode = selectedSpecialFare
      ? (selectedSpecialFare?.specialFareCode ?? selectedSpecialFare?.specialfarecode)
      : this.selectedPromoInfo;

    this.selectedTravelDatesInfo.startDate = convertToDate(
      this.selectedTravelDatesInfo?.startDate,
    );

    this.selectedDatesFromCalender = [this.selectedTravelDatesInfo.startDate];

    if (context?.selectedTravelDatesInfo?.endDate) {
      this.selectedTravelDatesInfo.endDate = convertToDate(
        this.selectedTravelDatesInfo?.endDate,
      );
      this.selectedDatesFromCalender.push(
        this.selectedTravelDatesInfo?.endDate,
      );
    }

    this.selectedTravelDatesInfo.minDate =
      this.selectedTravelDatesInfo.startDate;

    if (
      differenceInCalendarDays(
        this.selectedTravelDatesInfo.startDate,
        new Date(),
      ) < 0
    ) {
      this.selectedJourneyType = null;
    }
  }

  updateContext(newContext) {
    super.updateContext(newContext);

    const { selectedSpecialFare } = newContext;

    const deepLinkPromoCode = sessionStorage.getItem('deepLinkPromoCode');
    this.selectedPromoInfo = newContext?.selectedPromoInfo ?? '';

    if (!this.selectedPromoInfo && deepLinkPromoCode) {
      const { value, expiry } = JSON.parse(deepLinkPromoCode);
      const diffInSeconds = differenceInSeconds(new Date(expiry), new Date());

      if (diffInSeconds > 0) {
        this.selectedPromoInfo = value?.promoCode || '';
      }
    }

    this.payloadPromotionCode = selectedSpecialFare
      ? (selectedSpecialFare?.specialFareCode ?? selectedSpecialFare?.specialfarecode)
      : this.selectedPromoInfo;
  }
}

export default BookingFlow;
