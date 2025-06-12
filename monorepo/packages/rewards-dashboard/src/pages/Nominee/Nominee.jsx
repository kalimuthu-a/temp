import React, { useState, useContext, useEffect, useMemo } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import AddNominee from './Add/AddNominee';
import Footer from './Footer/Footer';
import PassengersContainer from './Passenger/PassengersContainer';
import ConfirmSelection from './Modal/ConfirmSelection';
import NomieeContext from './NomieeContext';
import { getNominee } from '../../services/nominee.service';
import { nomieeActions } from './NomieeReducer';
import aemService from '../../services';
import { URLS } from '../../constants';
import AEMContext from '../../context/AEMContextProvider';

const Nominee = () => {
  const [state, setState] = useState({
    showConfirmation: false,
  });

  const { setAEMData, aemLabel } = useContext(AEMContext);

  const {
    state: { toast, loading, showFooter, disableAdd, nominees },
    dispatchToast,
    dispatch,
  } = useContext(NomieeContext);

  const onClickRemoveHandler = () => {
    setState((prev) => ({ ...prev, showConfirmation: true }));
  };

  const closeConfirmationHandler = () => {
    setState((prev) => ({ ...prev, showConfirmation: false }));
  };

  useEffect(() => {
    Promise.all([
      getNominee(),
      aemService(URLS.AEM_GET_NOMINEE, 'data.accountNomineesByPath.item'),
    ]).then((response) => {
      const [apiresponse, nomineeAEM] = response;
      setAEMData(nomineeAEM);

      dispatch({
        type: nomieeActions.INIT,
        payload: {
          api: apiresponse,
        },
      });
    });
  }, []);

  const { showRemoveButton, saveEnabled } = useMemo(() => {
    let apiHasData = false;
    let isDataValid = true;

    nominees.forEach((nominee) => {
      isDataValid = nominee.isValid && isDataValid;
      apiHasData = apiHasData || !nominee.isNew;
    });

    return {
      showRemoveButton: apiHasData,
      saveEnabled: isDataValid,
    };
  }, [nominees]);

  const aemData = useMemo(() => {
    return {
      addNomineeCtaLabel: aemLabel('addNomineeCtaLabel'),
      removeNomineeCtaLabel: aemLabel('removeNomineeCtaLabel'),
      nomineeLimitNote: aemLabel('nomineeLimitNote.html'),
      loaderImagePath: aemLabel(
        'loaderImagePath._publishUrl',
        '/content/dam/s6web/in/en/assets/payments-page-icon.gif',
      ),
      addNomineesTitle: aemLabel('addNomineesTitle.html'),
      addNomineesDescription: aemLabel('addNomineesDescription'),
      backToPreviousPageText: aemLabel('backToPreviousPageText'),
      backToPreviousPageLink: aemLabel('backToPreviousPageLink'),
    };
  }, [aemLabel]);

  const allSubmitted = nominees.filter((nominee) => nominee?.nomineeID).length === 5;

  return (
    <div className="user-profile__right user-profile__nominee p-10">
      <div className="user-profile__nav-link">
        <i className="icon-accordion-left-simple" />
        <a
          href={aemData.backToPreviousPageLink || '/'}
          role="button"
          tabIndex={0}
          className="link"
        >{aemData.backToPreviousPageText}
        </a>
      </div>
      <div className="user-profile__nominee__header">
        <HtmlBlock
          className="user-profile__nominee__header__heading"
          html={aemData.addNomineesTitle}
        />
        <div className="user-profile__nominee__header__sub_heading">
          {aemData.addNomineesDescription}
        </div>
      </div>
      <PassengersContainer />
      <AddNominee addNomineeCtaLabel={aemData.addNomineeCtaLabel} />
      {disableAdd && allSubmitted && (
        <HtmlBlock
          className="user-profile__nominee__note"
          html={aemData.nomineeLimitNote}
        />
      )}
      {showRemoveButton && (
        <div className="user-profile__nominee__remove-btn">
          <Button variant="outline" onClick={onClickRemoveHandler}>
            {aemData.removeNomineeCtaLabel}
          </Button>
        </div>
      )}
      {showFooter && <Footer disabled={!saveEnabled} />}
      {state.showConfirmation && (
        <ConfirmSelection
          closeConfirmationHandler={closeConfirmationHandler}
        />
      )}
      {toast.show && (
        <Toast
          infoIconClass="icon-info"
          variation={`notifi-variation--${toast.variation}`}
          description={toast.description}
          containerClass="toast-example"
          autoDismissTimeer={5000}
          onClose={() => {
            dispatchToast({ show: false });
          }}
        />
      )}
      {loading && (
        <div className="skyplus-loader skyplus-loader-overlay">
          <div className="h-100 d-flex align-items-center">
            <div className="payment-page-intermediate-orchestrator-dynamic__flight-animation">
              <img src={aemData.loaderImagePath} alt="loader" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nominee;
