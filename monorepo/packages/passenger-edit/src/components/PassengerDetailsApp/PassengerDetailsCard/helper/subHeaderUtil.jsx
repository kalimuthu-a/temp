import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { LABEL_TEXT_INCOMPLETE } from '../../../../constants/constants';
import getNomineeType from '../../../../functions/getNomineeType';

const subHeaderUtil = {
  generateSubTitle(args) {
    const {
      name,
      paxAge,
      loyaltyInfo,
      travelDocuments,
      paxTypeLabel,
      selectedGender,
      passengerLabel,
      infantTaggedWithPaxName,
      nomineeLabel,
    } = args;

    let subTitles = [];
    const nomineeId = Boolean(loyaltyInfo?.isNominee) || getNomineeType(travelDocuments)?.isNominee;
    const paxTypeSubtitle = name?.first ? paxTypeLabel.substring(0, paxTypeLabel.length - 2) : passengerLabel;
    const paxGenderLabel = selectedGender;

    let paxCardDetails = [paxTypeSubtitle, paxGenderLabel, paxAge];
    if (nomineeId) {
      paxCardDetails = [nomineeLabel, ...paxCardDetails];
    }
    if ((name || paxAge || selectedGender || nomineeId)) {
      subTitles = paxCardDetails.filter((el) => el).join(' | ');
    }
    if (infantTaggedWithPaxName) {
      return (
        <div className="accordion-subtitle mt-2 gap-2 d-flex text-tertiary">
          <div className="accordion-label link-small text-capitalize">
            <span className="icon-link" />
            {infantTaggedWithPaxName}
          </div>
        </div>
      );
    }

    return (
      <div className="accordion-subtitle mt-2 gap-2 d-flex text-tertiary">
        <div className="accordion-label link-small text-capitalize">
          {subTitles}
        </div>
      </div>
    );
  },
  extraSeatsSubheader(isCardOpen, extraSeatTag) {
    const showSubHeader = !isCardOpen && extraSeatTag;
    if (showSubHeader) {
      return (
        <div className="accordion__seat mt-6 body-small-regular p-6 text-capitalize">
          {extraSeatTag}
        </div>
      );
    }
    return null;
  },
  generateStatusLabel(isIncomplete) {
    const statusLabel = isIncomplete === 'error-border' ? LABEL_TEXT_INCOMPLETE : '';

    const classNames = 'accordion__label text-system-warning tags-small text-capitalize rounded-1 py-1 px-4';
    return statusLabel ? <div className={classNames}>{statusLabel}</div> : '';
  },
  generateLineColor(isFormCompleted, isCardOpen, isTouched) {
    const greenLine = 'accordion__line--active-green';
    const darkBlue = 'accordion__line--active-dark';
    const lightBlue = 'bg-secondary-main';
    const redLine = 'error-border';

    if (isFormCompleted) {
      return greenLine;
    }
    if (!isFormCompleted && !isTouched && isCardOpen) {
      return darkBlue;
    }
    if (!isFormCompleted && !isTouched && !isCardOpen) {
      return lightBlue;
    }
    return redLine;
  },
  isFormCompleted(formFlag, errors, modificationFlow) {
    return modificationFlow || (formFlag && isEmpty(errors));
  },
  isPaxFormTouched(name, info, gender, ffn) {
    return !!(name?.first?.length
      || name?.last?.length
      || info?.dateOfBirth?.length
      || gender?.length
      || ffn?.length);
  },
};

export default subHeaderUtil;
