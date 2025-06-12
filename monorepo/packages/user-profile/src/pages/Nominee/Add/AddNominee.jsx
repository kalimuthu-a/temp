import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { a11y } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import classNames from 'classnames';
import analyticEvents from '../../../utils/analyticEvents';

import NomieeContext from '../NomieeContext';
import { nomieeActions } from '../NomieeReducer';
import { aaEvents } from '../../../utils/analyticsConstants';

const AddNominee = ({ addNomineeCtaLabel }) => {
  const {
    state: { disableAdd },
    dispatch,
  } = useContext(NomieeContext);

  const onClickHandler = () => {
    if (disableAdd) {
      return;
    }
    dispatch({
      type: nomieeActions.ADD_NOMINEE,
    });
    const analyticObj = {
      data: {
        _event: 'Nominee_Added_Initated',
        eventInfo: {
          name: 'Add Nominee',
          position: '',
          component: '',
        },
      },
      event: aaEvents.NOMINEE_ADDED_INITIATED, // todo
    };
    analyticEvents(analyticObj);
  };

  const onKeyDownHandler = (e) => {
    if (e.key === a11y.key.enter || e.key === a11y.key.space) {
      onClickHandler();
    }
  };

  const className = classNames('user-profile__nominee__add-btn', {
    disable: disableAdd,
  });

  if (!addNomineeCtaLabel) {
    return null;
  }

  return (
    <div
      className={className}
      role="button"
      tabIndex={disableAdd ? -1 : 0}
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
    >
      +<span>{addNomineeCtaLabel}</span>
    </div>
  );
};

AddNominee.propTypes = {
  addNomineeCtaLabel: PropTypes.string,
};

export default AddNominee;
