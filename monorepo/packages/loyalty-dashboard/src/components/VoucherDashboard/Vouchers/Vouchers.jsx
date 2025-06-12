import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Vouchers.scss';
import NoResults from '../NoResults/NoResults';
import VoucherCards from '../VoucherCards/VoucherCards';
import { TIER_BENEFIT_UTLISATION_TAB } from '../../../constants';

const Vouchers = ({ voucherAEMData, filteredCouponData, tab }) => {
  const {
    voucherSummaryTitle,
    activeLabel,
    expiredLabel,
    voucherHistoryNoResults,
    coBrandCardIconList,
  } = voucherAEMData;
  const [sortCoupons, setSortCoupons] = useState();
  const [activeTab, setActiveTab] = useState(activeLabel);

  useEffect(() => {
    const isCoBrand = tab === TIER_BENEFIT_UTLISATION_TAB.PARTNERS;
    const isActive = Boolean(activeTab === activeLabel);
    let coupons = [];
    if (isCoBrand) {
      coupons = filteredCouponData?.partner_voucher?.filter((coupon) => coupon.isExpired !== isActive);
    } else {
      coupons = filteredCouponData?.current?.filter((coupon) => coupon.isExpired !== isActive);
    }

    setSortCoupons(coupons);
  }, [activeTab, filteredCouponData, tab]);

  const onTabClick = (label) => {
    setActiveTab(label);
  };

  return (
    <div className="vouchers-container">
      <span className="vouchers-container--title">{voucherSummaryTitle}</span>
      <div className="chip-container">
        <button
          type="button"
          onClick={() => onTabClick(activeLabel)}
          className={`chip ${activeTab === activeLabel ? 'active' : ''}`}
        >
          {activeLabel}
        </button>
        <button
          type="button"
          onClick={() => onTabClick(expiredLabel)}
          className={`chip ${activeTab === expiredLabel ? 'active' : ''}`}
        >
          {expiredLabel}
        </button>
      </div>
      <div className="content-container">
        {sortCoupons?.length ? (
          <VoucherCards
            filteredCouponData={sortCoupons}
            coBrandCardIconList={coBrandCardIconList}
            tab={tab}
            voucherAEMData={voucherAEMData}
            filterTab={activeTab}
          />
        ) : (
          <NoResults voucherHistoryNoResults={voucherHistoryNoResults} />
        )}
      </div>
    </div>
  );
};

Vouchers.propTypes = {
  voucherAEMData: PropTypes.object,
  filteredCouponData: PropTypes.object,
  tab: PropTypes.string,
};

export default Vouchers;
