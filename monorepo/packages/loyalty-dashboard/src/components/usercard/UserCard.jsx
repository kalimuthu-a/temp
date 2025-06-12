import React from 'react';
import PointRedeemption from '../PointRedeemption/PointRedeemption';
import { useUserSummaryContext } from '../../store/user-summary-context';

function UserCard() {
  const { aemData, userData } = useUserSummaryContext();
  const formatDate = (date) => {
    const tierDate = new Date(date);
    const year = date.getFullYear();
    const lastTwoDigits = year.toString().slice(-2);
    const tierdat = tierDate.getDate();
    const month = tierDate.toLocaleString('default', { month: 'long' });
    return `${tierdat} ${month} ${lastTwoDigits}`;
  };
  const handleProfile = () => {
    window.location.href = aemData.viewProfileCtaPath;
  };
  return (
    <div id="componentToPrint">
      <div className="profile-container">
        <div className="details">
          <div className="eclipse-background-sec" />
          <div className="eclipse-background" />
          <div className="tag-container">
            <div className="icon-flight">
              <span className="icon-Indigo_Logo" />
            </div>
            <div className="member-tag">
              <span>
                {aemData?.memberLabel}
              </span>
            </div>
          </div>
          <div className="user-card">
            <div className="user__name">
              {`${aemData?.helloLabel} ${userData?.firstName || ''} ${userData?.lastName || ''}`}
            </div>
            <div className="user__flightnumber">
              {`${aemData?.ffNumberLabel}: ${userData?.ffNo || ''}`}
            </div>
            <div className="user__details">
              {userData?.mobileNo} | {userData?.emailId}
              {userData?.tierRetain && userData?.tierRetain?.tierPoint?.targetdate
                && (
                <span>
                  {aemData?.tierReviewDateLabel}: {formatDate(userData?.tierRetain?.tierPoint?.targetdate)}
                </span>
                )}
            </div>
          </div>
          <div className="review-summary">
            <div className="review-summary__viewProfile" onClick={() => handleProfile()}>
              {aemData?.viewProfileCtaLabel}
              <span className="icon-accordion-left-24" />
            </div>
          </div>
        </div>
        <PointRedeemption />
      </div>
    </div>
  );
}

UserCard.propTypes = {};

export default UserCard;
