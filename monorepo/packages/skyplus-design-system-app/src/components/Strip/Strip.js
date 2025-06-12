import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { COOKIE_KEYS } from '../../constants';
import { personaConstant } from '../../constants/analytics';
// eslint-disable-next-line import/no-extraneous-dependencies

const getCookieValue = (name) => document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || '';
const userTypeCookie = getCookieValue(COOKIE_KEYS.ROLE_DETAILS);
const personasType = userTypeCookie ? JSON.parse(userTypeCookie) : '';
console.log(userTypeCookie, 'userTypeCookie');

const Strip = ({ scratchCardWidgetBgColor, handleRedeem, data, title, children, widgetText }) => {
  const { scratchCardWidgetIcon, scratchCardWidgetText, scratchCardWidgetButtonText, scratchCardWidgetTextGuest } = data;
  let gradientStyle = {};

  if (scratchCardWidgetBgColor) {
    const gradientString = scratchCardWidgetBgColor.map((item) => `${item.color} ${item.percentage}`).join(', ');
    gradientStyle = {
      background: `linear-gradient(to bottom, ${gradientString})`,
    };
  }

  return (
    <div className="cardstrip" style={gradientStyle}>
      <img src={scratchCardWidgetIcon?._publishUrl} alt={title} className="cardstrip__image" />
      <p className="cardstrip__text" dangerouslySetInnerHTML={{ __html: widgetText }} />
      <Button
        size="small"
        variant="outline"
        color="primary"
        onClick={handleRedeem}
      >
        {children}
      </Button>
    </div>
  );
};

Strip.propTypes = {
  data: PropTypes.shape({
    scratchCardWidgetIcon: PropTypes.shape({
      _publishUrl: PropTypes.string.isRequired,
    }).isRequired,
    scratchCardWidgetText: PropTypes.shape({
      html: PropTypes.string.isRequired,
    }).isRequired,
    scratchCardWidgetButtonText: PropTypes.string.isRequired,
  }).isRequired,
  scratchCardWidgetBgColor: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    percentage: PropTypes.string.isRequired,
  })),
  handleRedeem: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};

export default Strip;
