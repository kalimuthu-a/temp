import { localStorageKeys, paxCodes } from '../../constants';
import { changeFlight } from '../../services';
import LocalStorage from '../../utils/LocalStorage';
import Payload from './SellPayload';

class ChangeFlow extends Payload {
  constructor(searchContext, selectedFares, sliderSelectedValues, isRedeemTransaction) {
    const {
      selectedCurrency,
      residentCountry,
      passengers,
      codes,
      originaljourney,
      payWith,
    } = searchContext;

    super(
      selectedFares,
      selectedCurrency.value,
      codes?.promotionCode || '',
      sliderSelectedValues,
      payWith,
      isRedeemTransaction,
    );

    this.codes = codes;
    this.residentCountry = residentCountry;
    this.originaljourney = originaljourney;

    const infantRow = passengers?.types?.find?.(
      (row) => row.type === paxCodes.infant.code,
    );

    this.passengers = {
      residentCountry,
      types: passengers?.types.filter(
        (row) => row.type !== paxCodes.infant.code,
      ),
    };

    this.infantCount = infantRow?.count || 0;
  }

  get payload() {
    return {
      removeJourney: this.originaljourney,
      addjourney: {
        keys: this.keys,
        infantCount: this.infantCount,
        passengers: this.passengers,
        specialfarecode: this.specialfarecode || '',
        currencyCode: this.currencyCode,
        promotionCode: this.promotionCode,
        vaxDoseNo: '',
        sourceOrganization: '',
        ...this.loyaltyRequest,
      },
    };
  }

  async callApi() {
    const response = await changeFlight(this.payload);
    if (response.data) {
      LocalStorage.remove(localStorageKeys.c_m_d);
    }

    return response;
  }
}
export default ChangeFlow;
