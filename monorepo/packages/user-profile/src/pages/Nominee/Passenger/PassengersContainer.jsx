/* eslint-disable operator-linebreak */
/* eslint-disable no-nested-ternary */
import React, { useContext, useMemo } from 'react';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import classnames from 'classnames';

import Form from './Form';
import NomieeContext from '../NomieeContext';
import { nomieeActions } from '../NomieeReducer';
import Nominee from '../Models/Nominee';
import AEMContext from '../../../context/AEMContextProvider';

const PassengersContainer = () => {
  const { aemLabel } = useContext(AEMContext);

  const {
    state: { nominees, selectedNomineeIndex, initalActiveIndexes },
    dispatch,
  } = useContext(NomieeContext);

  const aemData = useMemo(() => {
    return {
      incomplete: aemLabel('completionStatus.incomplete'),
      nomineeLabel: aemLabel('nomineeLabel'),
      yearsLabel: aemLabel('yearsLabel'),
    };
  }, [aemLabel]);

  const onChangeHandler = (index, key, value) => {
    dispatch({
      type: nomieeActions.UPDATE_FORM,
      payload: { index, key, value },
    });
  };

  const onClickHeaderHandler = (e) => {
    const { action, index } = e.target.dataset;

    if (action === 'delete' && index) {
      dispatch({
        type: nomieeActions.DELETE_NOMINEE,
        payload: { index: parseInt(index, 10) },
      });
    } else {
      const { parentElement } = e.currentTarget;
      const _index = Array.from(parentElement?.parentNode?.children).indexOf(
        parentElement,
      );

      dispatch({
        type: nomieeActions.SET_SELECTED_INDEX,
        payload: _index,
      });
    }
  };

  const renderAccordionHeader = (nominee, index, hideDelete) => {
    const { isDirty, isValid, isNew } = nominee;
    const className = classnames({
      complete: (isValid && !isDirty) || (isValid && isDirty),
      status: !isValid && isDirty,
    });

    return (
      <>
        <span className={className}>
          {isDirty && !isValid ? aemData.incomplete : ''}
        </span>
        {!hideDelete && isNew && (
          <i
            tabIndex={0}
            aria-label="Remove Nominee"
            role="button"
            className={isNew ? 'icon-close-circle' : 'icon'}
            {...(isNew && {
              'data-index': index,
              'data-action': 'delete',
              'aria-label': 'Remove Nominee',
            })}
          />
        )}
        {!isNew && (
          <i
            className="icon-accordion-down-simple"
            tabIndex={0}
            role="button"
            aria-label="Expand"
          />
        )}
      </>
    );
  };

  const accordionData = useMemo(() => {
    const firstNewIndex = nominees.findIndex((nominee) => nominee.isNew);
    return nominees.map((nomin, index) => {
      const nominee = new Nominee(nomin);
      nominee.yearsLabel = aemData.yearsLabel;

      const { isDirty, isValid, isNew } = nominee;
      const containerClassName =
        ((isNew && isDirty) || (!isNew)) ? (isValid ? 'has-success' : 'has-error') : '';
      return {
        title: nominee.title || `${aemData.nomineeLabel} ${index + 1}`,
        subTitle: nominee.subTitle || `${aemData.nomineeLabel} ${index + 1}`,
        renderAccordionContent: (
          <Form index={index} data={nominee} onChange={onChangeHandler} />
        ),
        renderAccordionHeader: renderAccordionHeader(
          nominee,
          index,
          index === firstNewIndex,
        ),
        containerClassName,
      };
    });
  }, [nominees]);

  const setActiveIndex = (i) => {
    dispatch({
      type: nomieeActions.SET_SELECTED_INDEX,
      payload: i,
    });
  };

  return (
    <form
      className="user-profile__nominee__passenger-container"
      key={initalActiveIndexes.join(',')}
    >
      <Accordion
        accordionData={accordionData}
        activeIndex={selectedNomineeIndex}
        setActiveIndex={setActiveIndex}
        isMultiOpen
        initalActiveIndexes={initalActiveIndexes}
        ariaProps={{
          onClick: onClickHeaderHandler,
        }}
      />
    </form>
  );
};

PassengersContainer.propTypes = {};

export default PassengersContainer;
