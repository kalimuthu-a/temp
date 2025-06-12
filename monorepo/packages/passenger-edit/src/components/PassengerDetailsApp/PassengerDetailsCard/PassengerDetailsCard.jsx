import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import AccordionCard from './AccordionCard/AccordionCard';
import LocalStorage from '../../../utils/LocalStorage';
import { localStorageKeys } from '../../../constants';
import subHeaderUtil from './helper/subHeaderUtil';
import paxCardUtil from './helper/helper';
import { AppContext } from '../../../context/appContext';
import { pushDataLayer } from '../../../utils/dataLayerEvents';

const PassengerDetailsCard = (props) => {
  const {
    info,
    name,
    gender,
    paxKey,
    paxName,
    children,
    paxAge,
    cardIndex,
    isCardOpen,
    extraSeatTag,
    selectedGender,
    bookingContext,
    filledFields,
    setFilledFields,
    selectedCardIndex,
    setSelectedCardIndex,
    validateThisCard,
    setValidateThisCard,
    ...paxInfo
  } = props;

  const { state: { modificationFlow, aemMainData: { nomineeLabel } } } = useContext(AppContext);
  const { formState: { errors } } = useFormContext();

  const [isThisFormCompleted, setThisFormCompleted] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleCardClick = (index) => {
    if (index === selectedCardIndex) {
      setSelectedCardIndex();
    } else setSelectedCardIndex(cardIndex);
  };
  const accordionRef = useRef(null);

  useEffect(() => {
    const updated = LocalStorage.getAsJson(localStorageKeys.upd_flds);
    const formValidation = paxCardUtil.formValidation({ ...props, ...bookingContext });
    const allPax = { ...updated, ...formValidation };
    LocalStorage.set(localStorageKeys.upd_flds, allPax);
    if (cardIndex === selectedCardIndex && formValidation[paxKey].flag) {
      setValidateThisCard('input-checked');
    } else if (cardIndex === selectedCardIndex && !formValidation[paxKey].flag) {
      setValidateThisCard('input-error');
    }
    setFilledFields(allPax);
  }, [validateThisCard, errors, extraSeatTag]);

  useEffect(() => {
    setThisFormCompleted(filledFields?.[paxKey]?.flag);
  }, [filledFields]);

  const clickHandler = (key) => {
    handleCardClick(key);
    if (!isCardOpen) {
      setTimeout(() => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const yOffset = -document.querySelector('.headerv2')?.offsetHeight || 80;
        // eslint-disable-next-line no-unsafe-optional-chaining
        const y = accordionRef?.current?.getBoundingClientRect()?.top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 1);
    }
    if (isCardOpen) {
      pushDataLayer({
        event: 'pax_info',
        data: {
          event: 'pax_info',
          wheelchair_opted: paxInfo?.specialAssistance?.options?.wheelchair ? 'true' : 'false',
          special_seat: extraSeatTag || 'None',
          gender: gender || '',
          pax_info: [paxInfo].length,
          future_booking_check: paxInfo.save ? '1' : '0',
        },
      });
    }
  };

  const cardErrors = errors?.userFields?.[cardIndex];
  const isFormCompleted = subHeaderUtil.isFormCompleted(isThisFormCompleted, cardErrors, modificationFlow);
  const lineColor = subHeaderUtil.generateLineColor(isFormCompleted, isCardOpen, isTouched);
  const label = subHeaderUtil.generateStatusLabel(lineColor);
  const extraSeatSubHeader = subHeaderUtil.extraSeatsSubheader(isCardOpen, extraSeatTag);
  const subTitle = subHeaderUtil.generateSubTitle({ selectedGender, paxAge, nomineeLabel, ...props });

  useEffect(() => {
    const ffn = paxInfo?.loyaltyInfo?.FFN;
    const touchState = subHeaderUtil.isPaxFormTouched(name, info, gender, ffn);
    setIsTouched(touchState);
  }, [filledFields, isCardOpen]);

  return (
    <AccordionCard
      key={paxKey}
      label={label}
      title={paxName}
      subTitle={subTitle}
      isOpen={isCardOpen}
      lineColor={lineColor}
      errors={errors}
      id={`${paxKey}-${cardIndex}`}
      onClick={() => clickHandler(cardIndex)}
      extraSeatSubHeader={extraSeatSubHeader}
      accordionRef={accordionRef}
    >
      {children}
    </AccordionCard>
  );
};

PassengerDetailsCard.propTypes = {
  info: PropTypes.shape({ gender: '', dateOfBirth: '' }),
  children: PropTypes.any,
  name: PropTypes.any,
  gender: PropTypes.any,
  paxKey: PropTypes.string,
  extraSeatTag: PropTypes.any,
  cardIndex: PropTypes.any,
  selectedCardIndex: PropTypes.any,
  setSelectedCardIndex: PropTypes.func,
  paxName: PropTypes.string,
  setFilledFields: PropTypes.func,
  filledFields: PropTypes.shape({}),
  validateThisCard: PropTypes.bool,
  isCardOpen: PropTypes.bool,
  paxAge: PropTypes.string,
  selectedGender: PropTypes.string,
  setValidateThisCard: PropTypes.func,
  bookingContext: PropTypes.shape({ seatWiseSelectedPaxInformation: PropTypes.shape({}) }),
};

export default PassengerDetailsCard;
