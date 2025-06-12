import React, { useEffect, useState } from 'react';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import userIdentity from 'skyplus-design-system-app/src/functions/UserIdentity';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import TransactionList from '../../components/EWallet/TransactionList/TransactionList';
import AmountStrip from '../../components/EWallet/AmountStrip/AmountStrip';
import pushAnalytic from '../../functions/analyticEvents';
import Cookies from '../../functions/cookies';
import { scrollToTop, getSessionUser } from '../../utils/utilFunctions';
import { COOKIE_KEYS } from '../../constants/cookieKeys';
import { ANONYMOUS, MEMBER } from '../../constants/common';
import {
  getBalance,
  getMyTransactionAemData,
  getTransactionHistory,
} from '../../services/ewallet.service';
import NoTransactionFound from '../../components/EWallet/NoTransactionFound/NoTransactionFound';

const Ewallet = () => {
  const [sixEWalletAemData, setSixEWalletAemData] = useState([]);
  const [walletBalance, setWalletBalance] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [createApiError, setCreateApiError] = useState(false);
  const [transactionData, setTransactionData] = useState({
    page: 1,
    count: 0,
    items: [],
  });
  const [noTransactionFound, setTransactionFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transBalanceLoading, setTransBalanceLoading] = useState(true);
  const [isUserLogin, setUserlogin] = useState(getSessionUser());
  const contentSize = sixEWalletAemData?.item?.priority || 25;

  let personasType = Cookies.get(COOKIE_KEYS.ROLE_DETAILS);
  personasType = personasType && JSON.parse(personasType);
  const isWalletCreated = Cookies.get(COOKIE_KEYS.WALLET_USER);

  const redirectToButtonLink = (link) => {
    window.location.href = link;
  };
  const handleApiCall = async (apiFunction) => {
    try {
      const response = await apiFunction();
      if (response) {
        return response;
      }
      throw new Error('API response did not include expected data');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('API call failed:', error);
      throw error;
    }
  };
  const tranBalanceAPIs = async (pageSize) => {
    const apiCalls = [
      handleApiCall(getBalance),
      handleApiCall(() => getTransactionHistory(1, pageSize, 'All')),
    ];
    try {
      const [balanceResult, historyResult] = await Promise.allSettled(apiCalls);

      if (balanceResult.status === 'fulfilled') {
        setWalletBalance(balanceResult?.value);
        pushAnalytic({
          state: {
            availableBalance: balanceResult?.value?.data?.balance,
            expringBalance: balanceResult?.value?.data?.expiringBalance,
          },
          event: 'Transaction History Page Load',
        });
      } else {
        setApiError(true);
      }

      if (historyResult.status === 'fulfilled') {
        setTransactionData((prevData) => {
          const newItems = historyResult?.value?.data?.items || [];
          return {
            page: historyResult?.value?.data?.page || 1,
            count: historyResult?.value?.data?.count || 0,
            items: [...(prevData?.items || []), ...newItems],
          };
        });
        if (historyResult?.value?.data?.count === 0) {
          setTransactionFound(true);
        }
      } else {
        setApiError(true);
      }
    } catch (error) {
      setApiError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const executeAPISequence = async () => {
    try {
      const aemData = await handleApiCall(getMyTransactionAemData);
      setSixEWalletAemData(aemData);

      let isWallet;// Using the flag from backend checking the exiting user
      try {
        isWallet = isWalletCreated && JSON.parse(isWalletCreated);
      } catch {
        isWallet = false;
      }
      setTransBalanceLoading(true);
      await tranBalanceAPIs(aemData?.item?.priority);
      setTransBalanceLoading(false);
    } catch (error) {
      setCreateApiError(true);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setApiError(false);
    if (personasType?.roleName === MEMBER) {
      executeAPISequence();
    }
    if (personasType?.roleName === ANONYMOUS || !personasType) {
      userIdentity.dispatchSSOLoginEvent();
    }
  }, [isUserLogin]);

  const userData = () => {
    const userlogin = getSessionUser();
    setUserlogin(userlogin);
  };

  useEffect(() => {
    scrollToTop(0);
    userIdentity.subscribeToLogin(userData);
    return () => {
      userIdentity.unSubscribeToLogin(userData);
    };
  }, []);
  return (
    <>
      {!transBalanceLoading && (
      <AmountStrip
        sixEWalletAemData={sixEWalletAemData}
        walletBalance={walletBalance}
        isLoading={isLoading}
      />
      )}
      {!noTransactionFound ? (
        <TransactionList
          sixEWalletAemData={sixEWalletAemData}
          transactionData={transactionData}
          setTransactionData={setTransactionData}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          contentSize={contentSize}
          transBalanceLoading={transBalanceLoading}
        />
      ) : (
        <NoTransactionFound
          noTransactionFound={noTransactionFound}
          sixEWalletAemData={sixEWalletAemData}
        />
      )}

      {(createApiError || apiError) && (
        <PopupModalWithContent
          onCloseHandler={() => {}}
          closeButtonIconClass="d-none"
          className="popup-container ewallet-container"
        >
          <Heading>{sixEWalletAemData?.item?.errorMessageText}</Heading>
          <HtmlBlock
            html={createApiError
              ? sixEWalletAemData?.item?.walletCreationErrorMessage?.html
              : sixEWalletAemData?.item?.errorMessageDesc?.html}
            className="body-small-regular mt-2 "
          />
          <div className="skyplus-recommended__dialog-btn mt-2">
            <Button
              color="primary"
              size="small"
              onClick={() => {
                redirectToButtonLink(sixEWalletAemData?.item?.okButtonLink);
              }}
            >
              {sixEWalletAemData?.item?.okButtonLabel}
            </Button>
          </div>
        </PopupModalWithContent>
      )}
    </>
  );
};

export default Ewallet;
