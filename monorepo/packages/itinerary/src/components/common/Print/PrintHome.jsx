import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
import PrintHomeEntry from './PrintHomeEntry';
import { pushAnalytic } from '../../../utils/analyticEvents';

const PrintHome = ({ children }) => {
  const componentRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);
  // We store the resolve Promise being used in `onBeforeGetContent` here
  const promiseResolveRef = useRef(null);

  // const dispatch = useDispatch();

  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      setTimeout(() => {
        promiseResolveRef.current();
      }, 200);
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    content: () => {
      // NOSONAR
      // const PrintElem = document.createElement("div");
      // const header =
      //   `<img src="${"logo"}" alt="" class="watermark"/>` +
      //   `<div class="page-footer">I'm The Footer</div>`;
      // PrintElem.innerHTML = header;
      // const PrintElem2 = document.createElement("div");
      // PrintElem2.innerHTML = `<div class="page-header">${new Date().toDateString()}</div>`;
      // PrintElem.appendChild(PrintElem2);
      // PrintElem.appendChild(tableStat);
      // return PrintElem;
      return componentRef.current.cloneNode(true);
    },
    removeAfterPrint: false,
    copyStyles: true,
    onBeforeGetContent: () => {
      pushAnalytic({
        data: {
          _event: 'modifyActionPopup',
          _eventInfoName: 'Print',
          _componentName: '',
        },
        event: 'click',
        error: {},
      });
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
    // print: async (printIframe) => {
    //   dispatch(setLoading(true));
    //   const document = printIframe.contentDocument;
    //   if (document) {
    //     const content = document.getElementsByTagName('html')[0];
    //     try {
    //       // eslint-disable-next-line no-undef
    //       const pdf = new jsPDF({
    //         pageWrapXEnabled: true,
    //         scale: 1,
    //       });
    //       // pdf.context2d.scale()
    //       // Add content to the PDF
    //       pdf.html(content, {
    //         callback: function (pdf) {
    //           // pdf.save('itinerary.pdf');
    //           // eslint-disable-next-line prefer-const
    //           let blob = pdf.output('blob');
    //           window.open(URL.createObjectURL(blob));

    //           // for share option
    //           // shareOption(blob);
    //         },
    //       });
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }

    //   dispatch(setLoading(false));
    // },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const printitinerary = urlParams.get('printitinerary') === '1';

    if (printitinerary) {
      handlePrint();
    }
  }, []);
  // NOSONAR
  // const shareOption = (blobUrl) => {
  //   if (navigator.share) {
  //     // If available, use the Web Share API to share the Blob content
  //     navigator
  //       .share({
  //         title: 'Share PDF',
  //         text: 'Here is your itinerary',
  //         files: [new File([blobUrl], 'itinerary.pdf', { lastModified: 1534584790000 })],
  //       })
  //       .then(() => {
  //         console.log('Successfully shared');
  //       })
  //       .catch((error) => {
  //         console.error('Error sharing:', error);
  //       });
  //   } else {
  //     // If not available, provide a fallback behavior (e.g., display a message)
  //     console.log('Web Share API not supported');
  //   }
  // };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={handlePrint}>{children}</div> {/* NOSONAR */}
      <div className="printComp" style={{ width: '100%' }}>
        <PrintHomeEntry ref={componentRef} />
      </div>
    </>
  );
};

PrintHome.propTypes = {
  children: PropTypes.any,
};

export default PrintHome;
