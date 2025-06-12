import React from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import formatCurrency from 'skyplus-design-system-app/src/functions/formatCurrency';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Card from '../../common/Card/Card';

const AmountStrip = (props) => {
  const { walletBalance, sixEWalletAemData } = props;
  const redirectToButtonLink = (link) => {
    window.location.href = link;
  };
  const amount = formatCurrency(
    walletBalance?.data?.balance || 0,
    walletBalance?.data?.currency,
  );
  const expiringText = walletBalance?.data?.expiringBalance
    ? sixEWalletAemData?.item?.expiringText?.html.replace(
      '{amount}',
      formatCurrency(walletBalance?.data?.expiringBalance),
    )
    : sixEWalletAemData?.item?.useBeforeExpireText?.html;
  return (
    <>
      <div className="transcation__back-to-home">
        <span className="icon-accordion-left-simple pe-2" />
        <a href={sixEWalletAemData?.item?.backToHomeLink}>
          {sixEWalletAemData?.item?.backToHome}
        </a>
      </div>
      <Card className="paymentstrip">
        <div className="d-flex align-items-center ">
          <div className="paymentstrip-logo">
            <img
              src={sixEWalletAemData?.item?.indigoWalletImagePath?._publishUrl}
              alt=""
            />
          </div>
          <div className="paymentstrip-left" />
          <div className="paymentstrip-right">
            <span>{amount || 0}</span>
            <p>{sixEWalletAemData?.item?.totalBalanceText}</p>
          </div>
        </div>
      </Card>
      {walletBalance?.data?.balance ? (
        <div className="transcation body-large-medium">
          <HtmlBlock html={expiringText} />
          <Button
            color="primary"
            classNames="transcation__booknowbtn"
            onClick={() => redirectToButtonLink(sixEWalletAemData?.item?.bookNowLink)}
          >{sixEWalletAemData?.item?.bookNowText}
          </Button>
        </div>
      ) : null}
    </>
  );
};
AmountStrip.propTypes = {
  sixEWalletAemData: PropTypes.array,
  walletBalance: PropTypes.any,
};
export default AmountStrip;
