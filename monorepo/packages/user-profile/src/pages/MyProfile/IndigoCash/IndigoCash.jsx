import React, { useState } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import { getIndigoCash, getIndigoCashAemData } from '../../../services/indigoCash.service';
import './IndigoCash.scss';
import Loader from '../../../components/common/Loader/Loader';
import { MOBILE_PAGE_TITLES } from '../constant';

const IndigoCash = () => {
  const [indigoCash, setIndigoCash] = useState();
  const [labels, setLabels] = useState({});
  const [loader, setLoader] = useState(false);

  const setIndigoCashInitData = async () => {
    setLoader(true);
    const getIndigoCashApiData = await getIndigoCash();
    setIndigoCash(getIndigoCashApiData);

    const getIndigoCashAemLabels = await getIndigoCashAemData();
    setLabels(getIndigoCashAemLabels);
    setLoader(false);
  };

  useState(() => {
    setIndigoCashInitData();
  }, []);

  const indigoCashAmt = indigoCash?.accountDetails?.data?.totalAvailable;

  return (
    <div className="indigo-cash">
      {loader ? <Loader /> : null}
      <Heading heading="h4" mobileHeading="h4" containerClass="indigo-cash__title mb-10 ">
        {labels?.title || MOBILE_PAGE_TITLES['#indigo-cash']}
      </Heading>
      <div className="indigo-cash__card rounded-3 p-12">
        <div className="d-flex justify-content-between align-items-center pb-3">
          <span className="body-small-regular">{labels?.accountBalanceLabel}</span>
          <span className="body-small-regular">{labels?.termsAndConditionsLabel}</span>
        </div>
        <p className="indigo-cash__amount text-primary-main">
          {formatCurrency(indigoCashAmt || 0, indigoCash?.defaultCurrencyCode)}
        </p>
      </div>
    </div>
  );
};

export default IndigoCash;
