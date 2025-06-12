import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './VoucherCards.scss';
import { formatDate } from '../../../utils/date';
import {
  PASSES_LEFT,
} from '../../../constants';

const DATE_FORMAT = 'DD MMM YYYY';

const VoucherCards = ({ filteredCouponData, coBrandCardIconList, tab, voucherAEMData, filterTab }) => {
  const { activeLabel } = voucherAEMData;
  const [data, setData] = useState(null);
  const [iconList, setIconList] = useState(null);
  const isActiveTabSelected = Boolean(filterTab === activeLabel);

  const parseHTMLText = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc?.body?.textContent.trim();
  };

  const voucherCardTitleAem = (offerType) => {
    const voucherName = voucherAEMData?.voucherList?.find((item) => item?.voucherCardCode === offerType.toLowerCase());
    if (voucherName) {
      return parseHTMLText(voucherName.cardTitle.html);
    }
    return offerType;
  };

  useEffect(() => {
    if (filteredCouponData) {
      const arr = [...filteredCouponData].reduce((acc, obj) => {
        const exist = acc.findIndex(({ offerType, category, expiryDate, createdDate }) => (
          obj?.offerType === offerType
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
  }, [filteredCouponData, tab]);

  useEffect(() => {
    if (coBrandCardIconList.length) {
      const list = {};
      coBrandCardIconList.map((icon) => {
        list[icon.key] = icon;
      });
      setIconList(list);
    }
  }, [coBrandCardIconList]);

  return (
    <div className="voucher-card-container">
      {data?.map((coupon, index) => (
        <div className="voucher-card" key={index}>
          <div className="top-content">
            <div className="voucher-card--icon">
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
            </div>
            {coupon?.count >= 1 || coupon?.couponLeft >= 1 ? (
              <span className="voucher-card--count">
                {coupon?.count}  { !isActiveTabSelected ? '' : PASSES_LEFT}
              </span>
            ) : null}
          </div>
          <div className="bottom-content">
            <div className="voucher-card--title">{voucherCardTitleAem(coupon?.offerType)}</div>
            <div className={`voucher-card--expiry-date ${!coupon.expiryDate ? 'invisible' : ''}`}>
              {!isActiveTabSelected ? 'Expired' : 'Expires'} :{' '}
              {formatDate(coupon.expiryDate, 'DD MMM YYYY')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

VoucherCards.propTypes = {
  filteredCouponData: PropTypes.array,
  coBrandCardIconList: PropTypes.array,
  tab: PropTypes.string,
  voucherAEMData: PropTypes.object,
};

export default VoucherCards;
