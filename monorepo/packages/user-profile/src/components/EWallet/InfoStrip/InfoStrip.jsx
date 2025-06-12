import React, { useEffect, useState, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import formatCurrency from 'skyplus-design-system-app/src/functions/formatCurrency';
import { format, parseISO } from 'date-fns';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Card from '../../common/Card/Card';
import { transactionTypes } from '../../../constants/common';

const InfoStrip = forwardRef(({ sixEWalletAemData, transactionData }, ref) => {
  const [transactionTypeLabel, setTransactionTypeLabel] = useState(null);

  useEffect(() => {
    if (transactionData?.type && sixEWalletAemData?.item?.transactionHistory) {
      const transactionType = transactionData.type.toLowerCase();
      const filteredLabel = sixEWalletAemData.item.transactionHistory.find(
        (item) => item.key.toLowerCase() === transactionType,
      );
      if (filteredLabel !== transactionTypeLabel) {
        setTransactionTypeLabel(filteredLabel);
      }
    }
  }, [transactionData, sixEWalletAemData, transactionTypeLabel]);
  const formattedAmount = useMemo(
    () => formatCurrency(transactionData.amount, transactionData.currency),
    [transactionData.amount, transactionData.currency],
  );

  const convertDateFormat = (dateString) => {
    if (dateString) {
      const date = parseISO(dateString);
      return format(date, 'dd MMM yyyy');
    }
    return '';
  };

  const isCredit = transactionData?.type?.toLowerCase() === transactionTypes.CREDITED
   || transactionData?.type?.toLowerCase() === transactionTypes.REFUND
   || transactionData?.type?.toLowerCase() === transactionTypes.EXPIRINGSOON;
  const isDebit = transactionData?.type?.toLowerCase() === transactionTypes.DEBITED;
  const isExpired = transactionData?.type?.toLowerCase() === transactionTypes.EXPIRED;

  return (
    <Card className="strip w-100">
      <div
        ref={ref}
        className="d-flex justify-content-between align-items-center"
      >
        <div className="strip-left">
          <p className="strip-left__heading body-large-medium">
            {transactionTypeLabel?.title}
          </p>
          {isCredit && (
            <>
              <p className="body-small-regular strip-left__detail">
                {transactionData?.transactionOn ? sixEWalletAemData?.item?.creditedOnText : null}{' '}
                {convertDateFormat(transactionData?.transactionOn)}
              </p>
              {transactionData?.expireOn ? (
                <p className="body-small-regular strip-left__detail">
                  {transactionData?.expireOn ? sixEWalletAemData?.item?.expiryText : null}{' '}
                  {convertDateFormat(transactionData?.expireOn)}
                </p>
              ) : null}
            </>
          )}
          {isDebit && (
            <>
              <HtmlBlock
                html={transactionTypeLabel?.description?.html}
                className="body-small-regular strip-left__detail"
              />
              <p className="body-small-regular strip-left__detail">
                {transactionData?.transactionOn ? sixEWalletAemData?.item?.debitedOnText : null}{' '}
                {convertDateFormat(transactionData?.transactionOn)}
              </p>
            </>
          )}
          {isExpired && (
            <>
              <p className="body-small-regular strip-left__detail">
                {transactionData?.expireOn ? sixEWalletAemData?.item?.expiredOnText : null}{' '}
                {convertDateFormat(transactionData?.expireOn)}
              </p>
              <p className="body-small-regular strip-left__detail">
                {transactionData?.transactionOn ? sixEWalletAemData?.item?.creditedOnText : null}{' '}
                {convertDateFormat(transactionData?.transactionOn)}
              </p>
            </>
          )}
        </div>
        <div
          className={`strip-right ${
            !isCredit ? 'strip-debit' : 'strip-credit'
          }`}
        >
          <span>
            {!isCredit && '-'}
            {formattedAmount}
          </span>
        </div>
      </div>
    </Card>
  );
});
InfoStrip.propTypes = {
  sixEWalletAemData: PropTypes.array,
  transactionData: PropTypes.array,
};

export default InfoStrip;
