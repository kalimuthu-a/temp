import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
import PrinTransactionHistroyEntry from './PrinTransactionHistroyEntry';
// import { pushAnalytic } from '../../../utils/analyticEvents';

const PrintTransactionHistory = ({ currentTab, isPartner, isAllTransActive, children }) => {
  const componentRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);
  // We store the resolve Promise being used in `onBeforeGetContent` here
  const promiseResolveRef = useRef(null);

  // const dispatch = useDispatch();

  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    content: () => {
      return componentRef.current.cloneNode(true);
    },
    removeAfterPrint: false,
    copyStyles: true,
    onBeforeGetContent: () => {
      // pushAnalytic({
      //   data: {
      //     _event: 'modifyActionPopup',
      //     _eventInfoName: 'Print',
      //     _componentName: '',
      //   },
      //   event: 'click',
      //   error: {},
      // });
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const printitinerary = urlParams.get('printitinerary') === '1';

    if (printitinerary) {
      handlePrint();
    }
  }, []);
  return (
    <>
      <div onClick={handlePrint}>{children}</div> {/* NOSONAR */}
      <div className="printComp" style={{ width: '600px', background: 'red' }}>
        <PrinTransactionHistroyEntry ref={componentRef} currentTab={currentTab} isPartner={isPartner} isAllTransActive={isAllTransActive} />
      </div>
    </>
  );
};

PrintTransactionHistory.propTypes = {
  children: PropTypes.any,
};

export default PrintTransactionHistory;
