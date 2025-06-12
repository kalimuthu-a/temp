import parse from 'date-fns/parse';
import isValid from 'date-fns/isValid';
import differenceInYears from 'date-fns/differenceInYears';

class Nominee {
  FirstName = '';

  LastName = '';

  DOB = '';

  Gender = '';

  isDirty = false;

  isValid = false;

  isDisabled = false;

  isNew = true;

  duplicateNominee = {
    isLoggedLoyaltyName: false,
    isNommineeName: false,
    isDuplicateNominee: false,
  };

  errors = {};

  _yearsLabel = 'years';

  constructor(nominee) {
    Object.assign(this, nominee);
  }

  get title() {
    const { FirstName = '', LastName = '' } = this;
    return [FirstName, LastName].filter(Boolean).join(' ');
  }

  get subTitle() {
    const { DOB = '', Gender = '' } = this;
    let years = '';
    try {
      const dobDate = parse(DOB, 'dd-MM-yyyy', new Date());

      if (isValid(dobDate)) {
        years = parseInt(differenceInYears(new Date(), dobDate), 10);

        if (years >= 2) {
          years += ` ${this._yearsLabel}`;
        } else {
          years = '';
        }
      }
    } catch (error) {
      // Error Handling
    }

    return [Gender, years].filter(Boolean).join(' | ');
  }

  /**
   * @param {String} value
   */
  set yearsLabel(value) {
    this._yearsLabel = value;
  }
}

export default Nominee;
