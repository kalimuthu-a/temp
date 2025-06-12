import React, { useEffect } from 'react';
import CheckBoxV2 from 'skyplus-design-system-app/src/components/CheckBoxV2/CheckBoxV2';
import { uniq } from 'skyplus-design-system-app/src/functions/utils';
import PropTypes from 'prop-types';
import { passengerEditActions } from '../../../context/appContext';
import { toCamelCase } from '../../../helpers';
import { PE_PAGE, PRIVACY_POLICY_KEY, WHATSAPP_KEY } from '../../../constants/constants';

function PDConsent({ privacyDescription, dispatch }) {
  const onChangeHandler = (consentName, consentStatus, i) => {
    dispatch({
      type: passengerEditActions.PD_CONSENT,
      payload: {
        whichConsent: consentName,
        value: !consentStatus,
        index: i,
        initRenderFlag: true,
        userInteracted: true,
      },
    });
  };

  // uncheck the privacy policy checkbox each time user comes on passenger edit form
  const onHashChange = () => {
    if (window?.pageType === PE_PAGE && !window.location.hash) {
      const privacyPolicyIndex = privacyDescription?.findIndex((item) => item?.key === PRIVACY_POLICY_KEY);
      onChangeHandler(PRIVACY_POLICY_KEY, true, privacyPolicyIndex);
    }
  };
  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return privacyDescription.length ? privacyDescription.map((consent, index) => {
    return (
      <CheckBoxV2
        name={consent?.key}
        id={toCamelCase(consent?.key)}
        checked={consent?.checked}
        title={consent.key === WHATSAPP_KEY ? consent?.title : ''}
        image={consent.key === WHATSAPP_KEY ? consent?.image?._publishUrl : ''}
        onChangeHandler={() => onChangeHandler(consent?.key, consent?.checked, index)}
        description={consent?.description?.html}
        descClass="body-small-regular"
        containerClass="mb-8 mb-md-6"
        required={consent?.required}
        key={uniq()}
      />
    );
  }) : null;
}

PDConsent.propTypes = {
  dispatch: PropTypes.func,
  privacyDescription: PropTypes.array,
};

export default React.memo(PDConsent);
