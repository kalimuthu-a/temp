import PropTypes from 'prop-types';
import React, { useEffect, useContext, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { a11y } from 'skyplus-design-system-app/dist/des-system/utils';
import NomieeContext from '../NomieeContext';
import WithFocusTrap from '../../../hoc/withFocusTrap';
import { nomieeActions } from '../NomieeReducer';
import { removeNominee } from '../../../services/nominee.service';
import AEMContext from '../../../context/AEMContextProvider';
import { CONSTANTS } from '../../../constants';

const ConfirmSelectionComponent = ({ closeConfirmationHandler }) => {
  const {
    state: { nominees },
    dispatch,
    reloadData,
    dispatchToast,
  } = useContext(NomieeContext);

  const { aemLabel } = useContext(AEMContext);

  const [selected, setSelected] = useState(new Set());

  const deletableNominees = useMemo(() => {
    return nominees?.filter((nominee) => nominee?.deleteFlag).map((nominee) => nominee?.nomineeID);
  }, []);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const onCloseHandler = () => {
    closeConfirmationHandler();
  };

  const onKeyDownHandler = (e) => {
    if (e.key === a11y.keyCode.enter) {
      onCloseHandler();
    }
  };

  const onChangeCheckbox = (e) => {
    const { checked, id } = e.target;
    if (checked) {
      setSelected(new Set([...selected, id]));
    } else {
      selected.delete(id);
      setSelected(new Set(selected));
    }
  };

  const onDeleteHandler = async () => {
    dispatch({
      type: nomieeActions.SHOW_LOADER,
      payload: true,
    });

    const toast = {
      show: true,
      variation: 'error',
    };

    try {
      const response = await removeNominee([...selected]);
      if (response.data.length > 0) {
        toast.variation = 'success';
        toast.description = aemLabel('nomineeRemovedMessage');
        document.dispatchEvent(
          new CustomEvent(CONSTANTS.LOYALTY_NOMINEE_DETAILS_UPDATED),
        );
        await reloadData();
      } else {
        toast.description = response?.aemError?.message;
      }
    } catch (error) {
      dispatch({
        type: nomieeActions.SHOW_LOADER,
        payload: false,
      });
    }

    dispatchToast(toast);
    onCloseHandler();
  };

  const aemData = useMemo(() => {
    return {
      secondaryCtaLabel: aemLabel('nomineeRemovalPopup.secondaryCtaLabel'),
      ctaLabel: aemLabel('nomineeRemovalPopup.ctaLabel'),
      allLabel: aemLabel('allLabel'),
    };
  }, []);

  const onChangeCheckboxAll = (e) => {
    if (e.target.checked) {
      setSelected(new Set(deletableNominees));
    } else {
      setSelected(new Set());
    }
  };

  return (
    <div
      className="skyplus-modal"
      role="dialog"
      aria-labelledby="Delete Nominee Modal"
      aria-modal="true"
    >
      <div
        className="skyplus-modal-mobile-close"
        role="button"
        onClick={onCloseHandler}
        onKeyDown={onKeyDownHandler}
        aria-label="Close"
        tabIndex={0}
      >
        <Icon className="icon-close-simple" />
      </div>
      <div className="skyplus-modal-content">
        <HtmlBlock
          className="skyplus-modal-content-heading"
          html={aemLabel('nomineeRemovalPopup.description.html')}
        />
        <div className="skyplus-modal-content-body">
          <div className="passenger-container">
            <Checkbox
              onChangeHandler={onChangeCheckboxAll}
              checked={deletableNominees.length === selected.size && deletableNominees.length > 0}
              disabled={deletableNominees.length === 0}
            >
              {aemData.allLabel}
            </Checkbox>
            {nominees
              .filter((item) => !item.isNew)
              .map((item) => (
                <Checkbox
                  key={item.nomineeID}
                  id={item.nomineeID}
                  onChangeHandler={onChangeCheckbox}
                  checked={selected.has(item.nomineeID)}
                  disabled={!item.deleteFlag}
                >
                  {item.title}
                </Checkbox>
              ))}
          </div>
        </div>
        <div className="skyplus-modal-content-footer">
          <Button size="sm" onClick={onCloseHandler} variant="outline" block>
            {aemData.ctaLabel}
          </Button>
          <Button
            size="sm"
            onClick={onDeleteHandler}
            block
            disabled={selected.size === 0}
          >
            {aemData.secondaryCtaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

ConfirmSelectionComponent.propTypes = {
  closeConfirmationHandler: PropTypes.func,
};

const ConfirmSelection = ({ closeConfirmationHandler }) => {
  const Component = WithFocusTrap(ConfirmSelectionComponent)({
    closeConfirmationHandler,
  });
  return createPortal(Component, document.body);
};

export default ConfirmSelection;
