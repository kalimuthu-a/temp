/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo, useState, useContext, useEffect } from 'react';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import AddonSlider from 'skyplus-design-system-app/dist/des-system/OffCanvas';
// Old Code:
// import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { AppContext } from '../../../context/AppContext';
import { categoryCodes } from '../../../constants/index';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';

/**
 * @type {React.FC<import("../../../../types/AddOnList").LostBaggageProtectionSlidePaneProps>}
 * @returns {React.FunctionComponentElement}
 */
const LostBaggageProtectionSlidePane = ({
  isOpen,
  onClose,
  addonData,
  onSubmit,
  configData,
  sliderPaneConfigData,
}) => {
  const {
    state: { delayLostBaggageProtection, categories, isInternationalFlight },
  } = useContext(AppContext);

  const AEMData = addonData?.availableSlidePaneData[0];
  const [data, setData] = useState({
    isAgree: false,
    error: '',
    isAdded: false,
  });
  // TD:
  // const [selectedItemPrice, setSelectedItemPrice] = useState({
  //   currentPrice: AEMData?.domesticPrice,
  //   initialPrice: AEMData?.internationalPrice,
  // });
  const LostBaggageApiObj = addonData?.availableSSR[0]?.ssrs[0];

  const updateSetData = () => {
    setData((prev) => ({
      ...prev,
      isAdded: delayLostBaggageProtection,
      error: '',
      isAgree: delayLostBaggageProtection,
    }));
  };
  useEffect(() => {
    updateSetData();
  }, [delayLostBaggageProtection]);

  const price = useMemo(() => {
    const category = Reflect.get(categories, categoryCodes.brb);
    return category?.priceToDisplay ?? '';
  }, []);
  const baggageSlideProps = {
    modalCustomClass: 'lost-baggage-slide-pane',
    title: `${AEMData?.sliderTitle}`,
    onClose: () => onClose(false),
    containerClassName: 'skyplus-offcanvas__addon-mf',
  };

  const submitDetails = () => {
    onSubmit(data.isAdded);
  };

  /* Old Code:
  const addToTripHandler = () => {
    if (data.isAgree) {
      setData((prev) => ({ ...prev, isAdded: true, error: '' }));
    } else {
      setData((prev) => ({
        ...prev,
        error: AEMData.acceptTermsError,
        isAdded: false,
      }));
    }
  }; */

  const onCloseSlider = () => {
    updateSetData();
    onClose();
  };

  /**
   * @param {React.SyntheticEvent<HTMLButtonElement|HTMLAnchorElement>} e
   */
  /* Old Code:
  const onClickRemoveHandler = (e) => {
    e.preventDefault();
    setData((prev) => ({ ...prev, isAdded: false, error: '', isAgree: false }));
  }; */

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onCheckboxChangeHandler = (e) => {
    setData((prev) => ({
      ...prev,
      isAgree: e.target.checked,
      isAdded: e.target.checked,
      error: '',
      ...(!e.target.checked && { isAdded: false }),
    }));
  };

  /* Old Code:
  const key = isInternational ? 'internationalPrice' : 'domesticPrice';
  const compensationPrice = get(
    addonData,
    ['availableSlidePaneData', 0, key],
    0,
  );
  */

  const btnProps = {
    label: configData?.doneCtaLabel,
    color: 'primary',
    variant: 'filled',
    size: 'small',
    disabled: true,
  };
  return (
    isOpen && (
      <AddonSlider {...baggageSlideProps} onClose={onCloseSlider}>
        <div className="skyplus-baggage-protection">
          {/* Old Code: {data.isAdded && (
            <button
              className="skyplus-baggage-protection__clear"
              onClick={onClickRemoveHandler}
            >
              {configData?.clearAllLabel}
            </button>
          )} */}

          <div className="skyplus-baggage-protection__title h0">
            {AEMData?.sliderTitle}
          </div>

          {/* TD: Update Heading typography */}
          <Heading heading="h5" mobileHeading="h5" containerClass="mt-6">
            <div
              dangerouslySetInnerHTML={{
                __html: AEMData?.sliderBaggegeDescription.html,
              }}
            />
          </Heading>
          {/* Old Code:
          <div
            className="skyplus-baggage-protection__delayed"
            dangerouslySetInnerHTML={{
              __html: AEMData?.sliderDescription?.html?.replace(
                '{}',
                compensationPrice,
              ),
            }}
          /> */}

          <div
            className="skyplus-baggage-protection__slider-description"
            dangerouslySetInnerHTML={{
              __html: !isInternationalFlight
                ? AEMData?.domesticSliderDescription?.html
                : AEMData?.internationalSliderDescription?.html,
            }}
          />

          <div className="skyplus-baggage-protection__disclaimer-card">
            <div
              className="skyplus-baggage-protection__disclaimer"
              dangerouslySetInnerHTML={{
                __html: AEMData?.poweredByDisclaimer.html,
              }}
            />

            <div className="skyplus-baggage-protection__terms">
              <Checkbox
                checked={data.isAgree}
                onChangeHandler={onCheckboxChangeHandler}
              />

              <label
                htmlFor="brb-select-all"
                className="skyplus-baggage-protection__terms--conditions"
                dangerouslySetInnerHTML={{
                  __html: AEMData?.poweredByDescription.html,
                }}
              />
            </div>
          </div>

          <div className="skyplus-baggage-protection__poweredby">
            <p className="body-small-regular">{AEMData?.poweredByLabel}</p>
            <img
              src={AEMData?.poweredByImage?._publishUrl}
              className="skyplus-baggage-protection__poweredby-image"
              alt="poweredBy"
            />
          </div>
          <div className="skyplus-baggage-protection__benefits-card">
            <p
              className={`input-text-field__error ${
                data.error ? '' : 'd-none'
              }`}
            >
              {data.error}
            </p>
            {/* Old Code:
            <div
              className="skyplus-baggage-protection__benefits"
              dangerouslySetInnerHTML={{
                __html: AEMData?.benefits.html.replace('{}', compensationPrice),
              }}
            /> */}

            <div
              className="skyplus-baggage-protection__benefits"
              dangerouslySetInnerHTML={{
                __html: !isInternationalFlight
                  ? AEMData?.benefits?.html
                  : AEMData?.benefitsInternational?.html,
              }}
            />
          </div>
        </div>
        <OffCanvasFooter
          titleData={price}
          subTitleData={AEMData?.internationalPrice}
          title={sliderPaneConfigData?.totalPriceLabel}
          subTitle={sliderPaneConfigData.saveRecommendationLabel}
          buttonTitle={AEMData.sliderButtonLabel}
          isFooterVisible={false}
          btnProps={btnProps}
          containerClass="skyplus-baggage-protection__button-container"
          postButtonIcon="icon-accordion-left-24"
          onSubmit={submitDetails}
          disabled={!(data.isAdded || delayLostBaggageProtection)}
          currencycode={LostBaggageApiObj?.currencycode || 'INR'}
        />
      </AddonSlider>
    )
  );
};

LostBaggageProtectionSlidePane.propTypes = {
  configData: PropTypes.any,
  addonData: PropTypes.any,
  isOpen: PropTypes.bool,
  isInternational: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  sliderPaneConfigData: PropTypes.object,
};

export default LostBaggageProtectionSlidePane;
