import { useEffect } from 'react';

import useAppContext from './useAppContext';

const usePageTitle = (aemKey) => {
  const { aemLabel } = useAppContext();

  useEffect(() => {
    const ele = document.querySelector('.headerv2 h5.headerv2-title-page-type');
    const footerEle = document.querySelector('.headerv2 .headerv2__mob__nav');

    if (ele) {
      ele.innerHTML = aemLabel(aemKey);
    }

    if (footerEle) {
      footerEle?.classList?.add('d-none');
    }
  }, [aemLabel]);
};

export default usePageTitle;
