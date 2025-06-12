import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState, useContext } from 'react';

import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import LocalStorage from '../../utils/LocalStorage';
import { localStorageKeys } from '../../constants';
import PromoCodeCard from './PromoCodeCard';
import { validatePromoCode } from '../../services';
import useAppContext from '../../hooks/useAppContext';
import { FormContext } from '../Form/FormContext';
import { formActions } from '../Form/formReducer';

const { SET_PROMO_CODE } = formActions;

const PromoCodeSlider = ({
  onCloseSlider,
  promoCodeSliderChunkLoaded,
  setPromoCodeSliderChunkLoaded,
}) => {
  const {
    state: { offers, additional },
  } = useAppContext();
  const {
    formState: { promocode },
    dispatch,
  } = useContext(FormContext);

  const [promoCode, setPromoCode] = useState({
    code: '',
    error: '',
    success: false,
    card: '',
    PromoType: 'PreBooking',
  });

  useEffect(() => {
    setPromoCode((prev) => ({ ...prev, ...promocode }));
    setPromoCodeSliderChunkLoaded(true);
  }, [promocode]);

  /**
   *
   * @param {import('react').ChangeEvent<HTMLInputElement>} e
   */
  const onChangePromoCode = (e) => {
    setPromoCode((prev) => ({ ...prev, code: e.target.value, error: '' }));
  };

  const resetPromoCode = () => {
    setPromoCode((prev) => ({ ...prev, code: '', success: false, error: '' }));
  };

  const { available, applied } = useMemo(() => {
    const appliedPromoCardIndex = offers.findIndex(
      (row) => row.code === promoCode.card,
    );

    if (appliedPromoCardIndex < 0) {
      return {
        available: offers,
        applied: null,
      };
    }

    return {
      available: [
        ...offers.slice(0, appliedPromoCardIndex),
        ...offers.slice(appliedPromoCardIndex + 1),
      ],
      applied: offers[appliedPromoCardIndex],
    };
  }, [promoCode.card]);

  const onApplyPromoCard = async (code, apply) => {
    const response = await validatePromoCode(
      {
        PromotionCode: code,
        PromoType: 'PreBooking',
      },
      {
        displayMessage: additional.promoCodeErrorLabel,
        action: 'Link/ButtonClick',
        component: 'Apply',
      },
    );

    if (response.Status) {
      dispatch({
        type: SET_PROMO_CODE,
        payload: {
          ...promoCode,
          code: '',
          success: apply,
          card: apply ? code : '',
        },
      });
    } else {
      setPromoCode((prev) => ({
        ...prev,
        error: additional.promoCodeErrorLabel,
      }));
    }
  };

  const onApplyPromoCode = async () => {
    if (!promoCode.code) {
      return;
    }

    const response = await validatePromoCode(
      {
        PromotionCode: promoCode.code,
        PromoType: 'PreBooking',
      },
      {
        displayMessage: additional.promoCodeErrorLabel,
        action: 'Link/ButtonClick',
        component: 'Apply',
      },
    );
    const nav = response?.Data;
    let res;
    if (nav) {
       res = JSON?.parse(nav);
    }
    if (response.Status) {
      onCloseSlider();

      dispatch({
        type: SET_PROMO_CODE,
        payload: { ...promoCode,
        code: res?.objValidate?.navitaireCode ?? promoCode?.code,
        indigoCode: promoCode?.code,
        success: true,
        card: '' },
            });
      LocalStorage.set(localStorageKeys.promo_val, response);
    } else {
 setPromoCode((prev) => ({
        ...prev,
        error: response?.Message,
      }));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onApplyPromoCode();
    }
  };

  return (
    <OffCanvas
      containerClassName="promocode-slider mobile-variation1"
      onClose={onCloseSlider}
      smoothSlide={promoCodeSliderChunkLoaded}
      renderFooter={() => null}
      ariaLabel="close-promocode"
    >
      <div>
        <div className="promocode-slider--body__head">
          <Heading
            heading="h0"
            containerClass="text-tertiary text-uppercase d-none d-md-block"
          >
            {additional.offersTitle}
          </Heading>
          <Heading
            // heading="sh5"
            containerClass="sh3 text-center d-block d-md-none"
          >
            {additional.promoCodePlaceholder}
          </Heading>
          <HtmlBlock
            html={additional?.offersDescription?.html}
            className="heading-description d-none d-md-block"
          />
          <div className="promocode-slider--body__head--form">
            <div className="form-group">
              <input
                className="promocode-slider--body__head--form__input"
                placeholder="Enter Promo Code"
                value={promoCode.code}
                onChange={onChangePromoCode}
                disabled={promoCode.success || Boolean(promoCode.card)}
              />
              {promoCode.code && (
                <Icon
                  className="icon-close-simple mx-6"
                  onClick={resetPromoCode}
                  size="sm"
                  tabIndex={0}
                  aria-label="reset-promocode"
                  role="button"
                />
              )}
              <div className="promocode-slider--body__head--form__btn">
                {promoCode.success && promoCode.code ? (
                  <span className="success">
                    {additional.promoCodeApplyText}
                  </span>
                ) : (
                  <span
                    onClick={onApplyPromoCode}
                    onKeyDown={handleKeyDown}
                    role="button"
                    aria-label="apply-promocode"
                    tabIndex={0}
                    className={promoCode.code ? '' : 'disabled'}
                  >
                    {additional.promoCodeCtaLabel}
                  </span>
                )}
              </div>
            </div>
            {promoCode.error && (
              <div className="form-error">{promoCode.error}</div>
            )}
          </div>
        </div>

        {applied && (
          <div>
            <Heading heading="h5" containerClass="my-8">
              {additional.promoCodeApplyText}
            </Heading>
            <div className="promocode-slider--body__list">
              <PromoCodeCard
                applied
                {...applied}
                onClickAction={onApplyPromoCard}
                offerApplyLabel={additional.offerApplyLabel}
                offerRemoveLabel={additional.offerRemoveLabel}
              />
            </div>
          </div>
        )}

        {available.length > 0 && (
          <Heading
            heading="h5"
            containerClass="my-8 availble-offer"
            mobileHeading="sh3"
          >
            {additional.availableOffersLabel}
          </Heading>
        )}

        <div className="promocode-slider--body__list">
          {available.map((row) => (
            <PromoCodeCard
              {...row}
              key={row.code}
              onClickAction={onApplyPromoCard}
              applied={false}
              offerApplyLabel={additional.offerApplyLabel}
              offerRemoveLabel={additional.offerRemoveLabel}
            />
          ))}
        </div>
      </div>
    </OffCanvas>
  );
};

PromoCodeSlider.propTypes = {
  onCloseSlider: PropTypes.func,
  promoCodeSliderChunkLoaded: PropTypes.bool,
  setPromoCodeSliderChunkLoaded: PropTypes.func,
};

export default PromoCodeSlider;
