import React, { useEffect } from 'react';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { AppContext } from '../context/AppContext';
import { PAGES } from '../constants';

const deskTopMb = 32;
const mobileTopMb = 28;
const findComponent = (pageSectionType) => {
  switch (pageSectionType) {
    case PAGES.VISA_SRP:
      return '.visa-srp';
    case PAGES.VISA_PLAN_DETAILS:
      return '.visa-plan-main-container';
    case PAGES.VISA_TRAVELLER_DETAILS:
      return '.visa-traveller';
    case PAGES.VISA_UPLOAD_DOCUMENTS:
      return '.visa-upload-section';
    case PAGES.VISA_REVIEW:
      return '.visa-review';
    default:
      return '.view-visaserive';
  }
};

const useHeightAdjustments = (footerHeight) => {
  const [isMobile] = useIsMobile();
  const { state: { visaPageSectionType = 'visa-srp' } } = React.useContext(AppContext);

  useEffect(() => {
    if (footerHeight) {
      const mb = isMobile ? Number(footerHeight) + Number(mobileTopMb) : Number(footerHeight) + Number(deskTopMb);
      const clsName = findComponent(visaPageSectionType);
      document?.querySelectorAll(clsName)?.forEach((el) => {
        const newEl = el;
        newEl.style.marginBottom = `${mb}px`;
      });
    }
  }, [footerHeight]);
};

export default useHeightAdjustments;
