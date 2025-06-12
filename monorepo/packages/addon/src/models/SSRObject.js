import { categoryCodes } from '../constants/index';
import { ANALTIC_PRODUCT_DETAILS_EVAR_TEMPLATE } from '../constants/templates';
import { formattedMessage } from '../functions/utils';

/**
 * @type {import("../../types/SSRObj")}
 * @class SSRObject
 * @property {string} journeyKey
 */
class SSRObject {
  addonName;

  passengerKey;

  ssrCode;

  price;

  journeyKey;

  name;

  category;

  /** @type {boolean} */
  canBeRemoved = false;

  analyticName;

  segmentKey = '';

  includedWithBundle = false;

  constructor(obj) {
    this.addonName = obj.addonName;
    this.passengerKey = obj.passengerKey;
    this.multiplier = parseInt(obj.multiplier ?? 1);
    this.ssrCode = obj.ssrCode;
    this.price = obj.price;
    this.journeyKey = obj.journeyKey;
    this.name = obj.name;
    this.category = obj.category;
    this.canBeRemoved = obj.canBeRemoved ?? true;
    this.analytxKeywords = [];
    this.earnPoints = obj.earnPoints || 0;
    this.discountPercentage = obj.discountper || 0;
    this.originalPrice = obj.originalPrice || 0;
    this.extractKeywords();
    this.segmentKey = obj.segmentKey ?? '';
    this.includedWithBundle = Boolean(obj.includedWithBundle);

    this.analyticName = this.analytxProduct();
  }

  analytxProduct() {
    const { category, name, analytxKeywords } = this;
    const separator = '|';

    switch (category) {
      case categoryCodes.prim:
        return '6E Prime';

      case categoryCodes.mlst:
        return 'Seat+Meal';

      case categoryCodes.bar:
        return ['Bar'].concat(analytxKeywords).join(separator);

      case categoryCodes.baggage:
        return ['Baggage Allowance'].concat(analytxKeywords).join(separator);

      case categoryCodes.meal:
      case categoryCodes.goodNight:
        return [category].concat(analytxKeywords).join(separator);

      case categoryCodes.speq:
      case categoryCodes.lounge:
      case categoryCodes.ffwd:
      case categoryCodes.abhf:
        return name;

      case categoryCodes.prot:
      case categoryCodes.brb:
      case categoryCodes.ifnr:
        return ['Insurance'].concat(analytxKeywords).join(separator);

      default:
        return name;
    }
  }

  extractKeywords() {
    const { category, name, ssrCode } = this;
    const sliderItem = this.sliderConfiguration.find(
      (item) => item.categoryBundleCode === category,
    );

    if (sliderItem) {
      const ssrItem = sliderItem.ssrList?.find(
        (row) => row.ssrCode === ssrCode,
      );
      if (ssrItem) {
        this.analytxKeywords.push(ssrItem?.analyticValue || name);
      } else {
        this.analytxKeywords.push(name);
      }

      if (category === categoryCodes.meal) {
        const item = sliderItem.ssrList.find((row) => row.ssrCode === ssrCode);
        if (item) {
          this.analytxKeywords.push(item.preference);
        }
      }
    }
  }

  /**
   * Analtyx string value to be passed in product.productInfo in analytx event
   *
   * will return passengerCount only when Addon is [ifnr, prot, brb]
   *
   * @param {number} count
   * @param {number} passengerCount
   * @returns {string}
   */
  analytxStr(count, passengerCount) {
    let { evar } = this;
    const emptyEvarCat = [
      categoryCodes.ifnr,
      categoryCodes.prot,
      categoryCodes.brb,
    ];
    if (emptyEvarCat.includes(this.category)) {
      evar = '';
      count = passengerCount;
    }

    const arr = ['', this.analyticName, count, '', '', evar];
    return arr.join(';');
  }

  identifierPush(segments) {
    const eVar = [];
    segments.forEach(({ segmentDetails }) => {
      const { identifier } = segmentDetails;
      eVar.push(`${identifier.carrierCode}${identifier.identifier}`);
    });

    return eVar;
  }
}

/**
 * @type {Array<*>}
 */
SSRObject.prototype.sliderConfiguration = [];
SSRObject.prototype.evar = '';

SSRObject.prototype.setJournies = function (journies, sliderConfiguration) {
  SSRObject.prototype.sliderConfiguration = sliderConfiguration;
  let eVar19 = '';
  let eVar20 = '';
  let eVar22 = [];
  let eVar23 = [];
  let isMulticity = false;
  let evar = '';

  journies.forEach((journey, index) => {
    const { journeydetail, segments } = journey;

    if (index === 0) {
      eVar19 = journeydetail.origin;
      eVar20 = journeydetail.destination;
      eVar22 = this.identifierPush(segments);
    }

    // return journey
    if (index === 1) {
      eVar23 = this.identifierPush(segments);

      isMulticity =
        journies[0]?.journeydetail?.origin !==
          journies[1]?.journeydetail?.destination || journies.length > 2;
    }
  });

  if (!isMulticity) {
    evar = formattedMessage(ANALTIC_PRODUCT_DETAILS_EVAR_TEMPLATE, {
      eVar19,
      eVar20,
      eVar22: eVar22.join(':'),
      eVar23: eVar23.join(':'),
    });
  }

  SSRObject.prototype.evar = evar;
};

export default SSRObject;
