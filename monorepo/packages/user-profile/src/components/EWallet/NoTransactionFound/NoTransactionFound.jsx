import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const NoTransactionFound = ({ noTransactionFound, sixEWalletAemData }) => {
  const [isMobile] = useIsMobile();
  return (
    <div className="no-transaction-found">
      <div className="text-center">
        <div className="no-transaction-found__image">
          <img src={sixEWalletAemData?.item?.imagePathLabel} alt="" />
        </div>
        <Heading heading="h4" containerClass="no-transaction-found__heading">
          {sixEWalletAemData?.item?.noTransactionFoundText}
        </Heading>
        <p className="body-small-regular">
          <HtmlBlock
            html={noTransactionFound
              ? sixEWalletAemData?.item?.noTransactionFoundDesc?.html
              : isMobile ? sixEWalletAemData?.item?.filterTransactionMessage?.html.replace('<br>', '') : sixEWalletAemData?.item?.filterTransactionMessage?.html}
          />
        </p>
      </div>
    </div>
  );
};
NoTransactionFound.propTypes = {
  sixEWalletAemData: PropTypes.any,
  noTransactionFound: PropTypes.bool,
};
export default NoTransactionFound;
