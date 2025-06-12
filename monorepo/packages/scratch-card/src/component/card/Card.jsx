/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { encryptAESForLogin } from 'skyplus-design-system-app/src/functions/loginEncryption';
import Modal from '../modal/Modal';
import { getSessionUser } from '../../utils';
import { CONSTANT, ANALTYTICS } from '../../constants';
import { pushAnalytic } from '../../utils/analyticEvents';

const Card = ({ imageSrc, isScratched, card, isExpired, expiredText }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState(card);
  const ExpiredDate = new Date(isExpired) <= new Date();
  const expiredStyle = {
    filter: ExpiredDate ? 'grayscale(100%)' : 'none',
    opacity: ExpiredDate ? 0.5 : 1,
  };
  const [couponStatus, setCouponStatus] = useState(isScratched);
  const updateCouponStatus = () => {
    if (couponStatus === (CONSTANT.LOCKED || CONSTANT.ASSIGN || CONSTANT.CONSUMED)) {
      setCouponStatus(CONSTANT.SCRATCHED);
    }
  };

  const MembershipID = getSessionUser();

  const brandName = card?.brand_name;
  useEffect(() => {
    setCardData(cardData);
  }, [cardData]);
  const handleRedeemClick = () => {
    pushAnalytic({
      data: {
        _event: ANALTYTICS.DATA_CAPTURE_EVENTS.SCRATCH_CARD_CLICK,
        _eventInfoName: brandName,
        _couponID: card?.coupon_code_id,

      },
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.SCRATCH_CARD_CLICK,
    });
    setIsModalOpen(true);
  };
  const handleCloseClick = () => {
    pushAnalytic({
      data: {
        _event: ANALTYTICS.DATA_CAPTURE_EVENTS.CLOSE_ICON_CLICK,
        _eventInfoName: brandName,
        _customerid: encryptAESForLogin(getSessionUser()),

      },
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.CLOSE_ICON_CLICK,
    });
    setIsModalOpen(false);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  return (
    <div onClick={handleRedeemClick} aria-hidden="true" className="card">

      {(couponStatus === CONSTANT.ASSIGN) && (
      <img src={imageSrc} alt={card?.title} className="card__img" />
      )}

      {(couponStatus === CONSTANT.SCRATCHED
        || couponStatus === CONSTANT.LOCKED
        || couponStatus === CONSTANT.CONSUMED
        || couponStatus === CONSTANT.EXPIRED) && (
        <div className="scc__img-container">
          <img
            src={card?.image?._path}
            alt="Scratch Card"
            className="card__img"
            style={expiredStyle}
          />
          <div className="scc__text-overlay card__details">

            <div className="card__details_content">
              <p className="card__details-titleTxt">{card?.title}</p>
              <p className="card__details-expiry">
                {ExpiredDate ? expiredText : `${card?.expiryText}${formatDate(card?.validity)}`}
              </p>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseClick}
        cardData={cardData}
        dataProp={card}
        status={couponStatus}
        isExpired={ExpiredDate}
        expiredStyle={expiredStyle}
        setCouponStatus={setCouponStatus}
      />

    </div>
  );
};

Card.propTypes = {
  imageSrc: PropTypes.any,
  card: PropTypes.object,
  isScratched: PropTypes.string,
  isExpired: PropTypes.bool,
  expiredText: PropTypes.any,
};

export default Card;
