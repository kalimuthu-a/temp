import { Pages } from './globalConstants';

export const getDynamicPageInfo = () => {
  let { pageType = '' } = window;

  // eslint-disable-next-line operator-linebreak
  pageType ||=
    window.location.href.split('/').pop().replace('.html', '').split('?')[0]
    || '';

  const defaultProps = {
    journeyFlow: 'Booking Flow',
    siteSection: 'Booking Flow',
  };

  switch (pageType) {
    case Pages.HOMEPAGE:
      return {
        pageName: 'Homepage',
        journeyFlow: 'Homepage',
        siteSection: 'Homepage',
      };
    case Pages.SRP:
      return {
        pageName: 'Flight Select',
        ...defaultProps,
      };
    case Pages.PASSENGER_EDIT:
      return {
        pageName: 'Passenger Details',
        ...defaultProps,
      };
    case Pages.FLIGHT_SELECT_MODIFICATION:
      return {
        pageName: 'Change Flight',
        journeyFlow: 'Modification Flow',
        siteSection: 'Modification Flow',
        ...defaultProps,
      };
    default:
      return {
        pageName: pageType,
        journeyFlow: pageType,
        siteSection: pageType,
      };
  }
};

export const getPageLoadTime = (originTime = null) => {
  const time = originTime || performance.timeOrigin;
  const duration = Date.now() - time;
  return parseFloat(duration / 1000).toFixed(2);
};
