import { useContext, useEffect } from 'react';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { AppContext } from '../context/AppContext';
import { PAGES } from '../constants';

const useSidePanelAdjustments = (isFullWidth) => {
  const { state: { visaPageSectionType } } = useContext(AppContext);
  const [isMobile] = useIsMobile();

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const leftSide = document.querySelector('.pe-left-side-v2');
    const rightSide = document.querySelector('.pe-right-side-v2');

    if (leftSide && !rightSide) {
      if (isFullWidth) {
        leftSide.style.width = '100%';
      } else {
        leftSide.style.width = '66.66%';
      }
    }
    if (leftSide && rightSide) {
      if (isFullWidth) {
        leftSide.style.width = '100%';
        rightSide.style.display = 'none';
      } else {
        leftSide.style.width = !isMobile ? '66.66%' : '100%';
        rightSide.style.display = 'block';
        rightSide.style.marginTop = !isMobile ? '64px' : '0';
        if (visaPageSectionType === PAGES.VISA_CONFIRMATION) {
          rightSide.style.marginTop = '16px';
        }
      }
    }
  }, [isFullWidth]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    if (isMobile) {
      // hiding logo from mobile view
      const headerLogo = document.querySelector('.headerv2__logo');
      if (headerLogo) headerLogo.style.display = 'none';
    }
  }, []);
};

export default useSidePanelAdjustments;
