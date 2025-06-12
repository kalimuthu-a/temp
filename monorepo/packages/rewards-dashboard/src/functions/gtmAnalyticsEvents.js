import { gtmAnalytic } from 'skyplus-design-system-app/dist/des-system/gtmAnalyticUtils';
import { analyticConstant } from '../constants/common';

const getCommonProps = (state, pageName) => ({
  page_name: pageName,
  previous_page: pageName,
  platform: window.screen.width < 768 ? 'Mweb' : 'Web',
  site_section: 'Homepage',
  line_of_business: 'profile',
  user_id: '',
});

const gtmPushAnalytic = ({ state, event }) => {
  let gtmProps;
  switch (event) {
    case 'Get started':
      gtmProps = {
        event: 'profile_initiation',
        interaction_type: 'Link/ButtonClick',
        page: {
          error: {
            id: state.errorDetail?.code || '',
            text: !state.isLoggedIn ? state.errorDetail?.message : '',
          },
        },
      };
      break;
    default:
      console.log('default case');
  }

  gtmAnalytic({ state, gtmProps });
};

export default gtmPushAnalytic;
