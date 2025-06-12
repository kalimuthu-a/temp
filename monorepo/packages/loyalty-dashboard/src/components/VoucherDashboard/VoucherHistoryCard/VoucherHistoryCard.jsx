/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './VoucherHistoryCard.scss';
import { formatDate } from '../../../utils/date';
import { EXPIRING, VOUCHER_HISTORY_TAB,
  BLUECHIPVALUE, EXPIRY, TYPE,
  IBC,
} from '../../../constants';
import { useUserSummaryContext } from '../../../store/user-summary-context';

const DATE_FORMAT = 'DD MMM YYYY';

const VoucherHistoryCard = ({
  filteredCouponData,
  coBrandCardIconList,
  pnrLabel,
  voucherSourceList,
  voucherSourceLabel }) => {
  const { voucherAEMData } = useUserSummaryContext();

  const [active, setActive] = useState(null);
  const [data, setData] = useState(null);
  const [iconList, setIconList] = useState(null);
  const [voucherList, setVoucherList] = useState(null);
  const {
    creditedLabel,
    redeemedLabel,
    expiringSoonLabel,
  } = voucherAEMData;

  useEffect(() => {
    if (filteredCouponData) {
      const arr = [...filteredCouponData].reduce((acc, obj) => {
        const exist = acc.findIndex(({ pnr, offerType, type, category, expiryDate, createdDate }) => (obj?.pnr === pnr
          && obj?.offerType === offerType
          && obj?.type === type
          && obj?.category === category
          && formatDate(obj?.expiryDate, DATE_FORMAT) === formatDate(expiryDate, DATE_FORMAT)
          && formatDate(obj?.createdDate, DATE_FORMAT) === formatDate(createdDate, DATE_FORMAT)
        ));
        const couponLeftTemp = Number(acc?.[exist]?.couponLeft || 0);
        if (exist < 0) {
          acc.push({ ...obj, count: 1 });
        } else {
          acc[exist].count = (acc[exist].count || 1) + (couponLeftTemp || 1);
        }

        return acc;
      }, []);
      setData(arr);
    }
  }, [filteredCouponData]);

  useEffect(() => {
    if (coBrandCardIconList.length) {
      const list = {};
      coBrandCardIconList.map((icon) => {
        list[icon.key] = icon;
      });
      setIconList(list);
    }
  }, [coBrandCardIconList]);

  useEffect(() => {
    if (voucherSourceList.length) {
      const list = {};
      voucherSourceList.map((icon) => {
        list[icon.key] = icon;
      });
      setVoucherList(list);
    }
  }, [voucherSourceList]);

  const chipColor = (coupon) => {
    switch (coupon.filterType) {
      case creditedLabel:
        return VOUCHER_HISTORY_TAB.EARNED;
      case redeemedLabel:
        return VOUCHER_HISTORY_TAB.REDEEMED;
      case expiringSoonLabel:
        return EXPIRING;
      default:
        return '';
    }
  };

  const opeartorSign = (coupon) => {
    switch (chipColor(coupon)) {
      case VOUCHER_HISTORY_TAB.EARNED:
        return '+';
      case VOUCHER_HISTORY_TAB.REDEEMED:
        return '-';
      default:
        return '';
    }
  };

  function replaceUnderscoresWithSpaces(str) {
    return str?.replace(/_/g, ' ');
  }

  return (
    <>
      {
      data?.map((coupon, index) => (
        <div
          className="voucher-history-card"
          key={index}
        >
          <div
            className={`acc-data ${active === coupon?.code ? 'active' : ''}`}
            onClick={() => setActive(active === coupon?.code ? null : coupon?.code)}
          >
            <div className="top-content">
              <div className="left-container">
                <span className="left-container--icon">
                  <img
                    src={
                    iconList?.[coupon?.category?.toLowerCase()]?.image?._publishUrl
                    || iconList?.default?.image?._publishUrl
                  }
                    alt={
                    iconList?.[coupon?.category?.toLowerCase()]?.altText
                    || iconList?.default?.altText
                  }
                  />
                </span>
                <span className="voucher-history-card--title">{`${coupon?.offerType} ${coupon?.filterType}`}</span>
              </div>
              <div className="right-container">
                <span className={`voucher-history-card--points ${chipColor(coupon)}`}>
                  {opeartorSign(coupon)}{coupon?.count}
                </span>
                <span className={` ${active === coupon?.code
                  ? 'icon-accordion-up-simple'
                  : 'icon-accordion-down-simple'} icon-size-sm p-4 headerv2__login__wrapper-icon`}
                />
              </div>
            </div>
            <div className="voucher-history-card--date">{formatDate(coupon?.pnr ? coupon?.redeemdate : coupon?.createdDate, 'DD MMM YYYY')}</div>
          </div>
          {active === coupon?.code ? (
            <div className="active-data">
              <div className={`type ${!coupon?.pnr && coupon?.offer?.toLowerCase() !== IBC ? 'ibc-bottom' : ''}`}>
                <span className="voucher-type">
                  <div className="title">{voucherSourceLabel}:{' '}</div>
                  <div className="description">
                    {
                      voucherList?.[coupon?.category]?.value || coupon?.category?.toLowerCase() || voucherList?.default?.value
                    }
                  </div>
                </span>
                {coupon?.type
                && (
                <span className="voucher-type">
                  <div className="title">{TYPE}:</div>
                  <div className="description"> {replaceUnderscoresWithSpaces(coupon?.type)}</div>
                </span>
                )}
                {
                    !coupon?.redeemId ? (
                      <span className="voucher-type">
                        <div className="title"> {EXPIRY}:</div>
                        <div className="description">
                          {coupon?.expiryDate ? formatDate(coupon?.expiryDate, 'DD MMM YYYY') : ''}
                        </div>
                      </span>
                    ) : null
                  }
              </div>
              { coupon?.pnr
                ? (
                  <div className="ticket-details">
                    <div className="top-section">
                      <span className="date">{coupon?.flown_date ? formatDate(coupon?.flown_date, 'DD MMM YYYY') : ''}</span>
                      <span className="pnr">
                        <span className="title">{pnrLabel}:{' '}</span>
                        <span className="description">{coupon.pnr}</span>
                      </span>
                    </div>
                    <div className="divider" />
                    <div className="bottom-section">
                      <div className="location source">
                        <span className="code">{coupon?.origin_name}</span>
                        <span className="name">{coupon?.origin_fullName}</span>
                      </div>
                      <div className="location destination">
                        <span className="name">{coupon?.destination_fullName}</span>
                        <span className="code">{coupon?.destination_name}</span>
                      </div>
                    </div>
                  </div>
                )
                : coupon?.offer?.toLowerCase() === IBC ? (
                  <div className="ticket-details bluechip-details">
                    <div className="bottom-section">
                      <div>{BLUECHIPVALUE}</div><div>{coupon?.discountValue}</div>
                    </div>
                  </div>
                ) : null}
              {/* <div className="passenger-details">
                <div className="passenger-image">JD</div>
                <div className="passenger-detail">
                  <div className="name">John Doe</div>
                  <div className="other-details">
                    Adult | Male | 28 year | 6E Eat
                  </div>
                </div>
              </div>
              <div className="ticket-fare">
                <div className="left-section">
                  <div className="icon">i</div>
                  <div className="title">Air Ticket</div>
                </div>
                <div className="fare-summary">
                  2 <span className="x">X</span> ₹ 10,552
                </div>
              </div> */}
            </div>
          ) : null}
        </div>
      ))
    }
    </>
  );
};

VoucherHistoryCard.propTypes = {
  filteredCouponData: PropTypes.array,
  coBrandCardIconList: PropTypes.array,
  pnrLabel: PropTypes.string,
  voucherSourceLabel: PropTypes.string,
  voucherSourceList: PropTypes.array,
};

export default VoucherHistoryCard;
