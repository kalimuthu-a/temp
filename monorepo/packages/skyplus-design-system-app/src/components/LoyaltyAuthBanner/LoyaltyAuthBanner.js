import React from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from '../../functions/sanitizeHtml';
import Button from '../Button/Button';

const LoyaltyAuthBanner = ({
  image,
  heading,
  subHeading,
  btnContent,
  handleClick = () => {},
  totalEarnPoints,
}) => {
  if (!image && !heading && !subHeading && !btnContent) {
    return null;
  }
  const subHeadingHtml = subHeading?.html && sanitizeHtml(subHeading?.html);
  return (
    <div className="banner-container d-flex justify-content-between p-8 p-md-10">
      <div className="banner-container__content">
        {heading ? (
          <div className="banner-container__content__heading">
            {heading?.replace('{earnpoints}', totalEarnPoints || '')}
          </div>
        ) : null}
        {subHeading ? (
          <div
            className="banner-container__content__subHeading mt-4 mt-md-5 mb-10 mb-md-13"
            dangerouslySetInnerHTML={{
              __html: subHeadingHtml,
            }}
          />
        ) : null}
        {btnContent ? (
          <Button
            onClick={handleClick}
            variant="filled"
            color="primary"
            size="small"
            containerClass="mt-auto"
            classNames="banner-container__content__btn w-auto"
          >
            {btnContent}
          </Button>
        ) : null}
      </div>
      {image ? (
        <div className="banner-container__imgContainer ml-auto my-auto">
          <img
            alt="loyaltyAuthBanner"
            className="banner-container__image"
            src={image}
          />
        </div>
      ) : null}
    </div>
  );
};

LoyaltyAuthBanner.propTypes = {
  image: PropTypes.string,
  heading: PropTypes.string,
  subHeading: PropTypes.object,
  btnContent: PropTypes.string,
  handleClick: PropTypes.func,
  totalEarnPoints: PropTypes.any,
};

export default LoyaltyAuthBanner;
