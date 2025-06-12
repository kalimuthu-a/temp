import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

import NomieeContext from '../NomieeContext';
import { nomieeActions } from '../NomieeReducer';
import { addNominee } from '../../../services/nominee.service';
import AEMContext from '../../../context/AEMContextProvider';
import { CONSTANTS } from '../../../constants';

const Footer = ({ disabled }) => {
  const { aemLabel } = useContext(AEMContext);

  const {
    dispatch,
    dispatchToast,
    reloadData,
    state: { nominees },
  } = useContext(NomieeContext);

  const aemData = useMemo(() => {
    return {
      saveCtaLabel: aemLabel('saveCtaLabel'),
    };
  }, [aemLabel]);

  const onClickHandler = async () => {
    dispatch({
      type: nomieeActions.SHOW_LOADER,
      payload: true,
    });

    const toast = {
      show: true,
      variation: 'error',
    };

    try {
      const data = nominees
        .filter((r) => r.isNew)
        .map((r) => ({
          gender: r.Gender,
          firstName: r.FirstName,
          lastName: r.LastName,
          dob: r.DOB,
        }));

      const response = await addNominee(data);

      if (response.success) {
        toast.variation = 'success';
        toast.description = aemLabel('nomineeSuccessMessage');
        document.dispatchEvent(
          new CustomEvent(CONSTANTS.LOYALTY_NOMINEE_DETAILS_UPDATED),
        );
        await reloadData();
      } else {
        toast.description = response?.aemError?.message;
      }
    } catch (error) {
      // Error Handler
    }
    dispatchToast(toast);
  };

  return (
    <div className="loyalty-footer">
      <Button disabled={disabled} onClick={onClickHandler}>
        {aemData.saveCtaLabel}
      </Button>
    </div>
  );
};

Footer.propTypes = {
  disabled: PropTypes.bool,
};

export default Footer;
