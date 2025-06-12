import { ANALTYTICS } from '../../constants';

import pushAdobeAnalytics from '../analyticsEvent';

export default ({ description, ...others }) => {
  pushAdobeAnalytics({
    event: ANALTYTICS.DATA_CAPTURE_EVENTS.UX_ERROR,
    data: {
      errorObj: {
        code: '',
        type: 'FE Error',
        source: 'MS API',
        apiURL: 'FE Error',
        statusCode: 'FE Error',
        statusMessage: 'FE Error',
        displayMessage: description,
        ...others,
      },
    },
  });
};
