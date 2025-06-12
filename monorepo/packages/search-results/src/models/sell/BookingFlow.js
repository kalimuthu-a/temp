import { localStorageKeys, paxCodes } from '../../constants';
import { sellFlight } from '../../services';
import LocalStorage from '../../utils/LocalStorage';
import Payload from './SellPayload';

/**
 * @param {any} request
 * @param {any} payload
 */
class BookingFlow extends Payload {
  bookingPurpose = '';

  bookingMode = '';

  constructor(searchContext, selectedFares, sliderSelectedValues) {
    const {
      selectedCurrency,
      travellingFor = '',
      selectedPaxInformation,
      selectedPromoInfo,
      nationality,
      bookingMode,
      payWith,
    } = searchContext;

    super(selectedFares, selectedCurrency.value, selectedPromoInfo, sliderSelectedValues, payWith);

    this.residentCountry = nationality?.countryCode || '';
    this.bookingPurpose = travellingFor;
    this.bookingMode = bookingMode;

    const infantRow = selectedPaxInformation?.types?.find?.(
      (row) => row.type === paxCodes.infant.code,
    );

    this.passengers = {
      residentCountry: this.residentCountry,
      types: selectedPaxInformation?.types.filter(
        (row) => row.type !== paxCodes.infant.code,
      ),
    };

    this.infantCount = infantRow?.count || 0;
  }

  get payload() {
    return {
      preventOverlap: true,
      suppressPassengerAgeValidation: true,
      vaxDoseNo: '',
      sourceOrganization: '',
      keys: this.keys,
      passengers: this.passengers,
      infantCount: this.infantCount,
      currencyCode: this.currencyCode,
      promotionCode: this.promotionCode,
      ...this.loyaltyRequest,
    };
  }

  async callApi() {
    const response = await sellFlight(this.payload);
    if (!response.isError) {
      LocalStorage.set(localStorageKeys.bookingPurpose, this.bookingPurpose);
      LocalStorage.set(localStorageKeys.bookingMode, this.bookingMode);
    }

    return response;
  }
}
export default BookingFlow;
