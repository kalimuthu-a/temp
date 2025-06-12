import React, { useEffect } from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { useSelector } from 'react-redux';
import {
  getQueryStringByParameterName,
  initChatBox } from '../../utils';
import { CONSTANTS } from '../../constants';
import Cookies from '../../utils/cookies';

const ChatSection = () => {
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const { bookingDetails } = useSelector((state) => state.itinerary?.apiData) || {};
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { bookingHelpOptions, bookingHelpTitle } = mfData?.itineraryMainByPath?.item;
  const isBookingFlowPage = getQueryStringByParameterName('isBookingFlow') === '1';
  const bookingHelpOptionsUpdated = isBookingFlowPage
  && (bookingDetails?.bookingStatus === CONSTANTS.BOOKING_STATUS.CONFIRMED)
    ? bookingHelpOptions : [bookingHelpOptions?.[0]];

  useEffect(() => {
    if (bookingHelpOptionsUpdated?.length > 0) {
      initChatBox();
    }
  }, [bookingHelpOptionsUpdated]);
  const isChatboxPath = bookingHelpOptionsUpdated?.[0]?.path;
  let personasType = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.ROLE_DETAILS);
  personasType = personasType && JSON.parse(personasType);

  const personasBaseMangeBookingFn = (redirectionUrl) => {
    switch (redirectionUrl) {
      case CONSTANTS.LOGIN_TYPE.NO_LOGIN.toLowerCase():
        return bookingHelpOptions?.[1]?.path;
      case CONSTANTS.LOGIN_TYPE.MEMBER.toLowerCase():
        return bookingHelpOptions?.[1]?.personaPagePath?.Member;
      case CONSTANTS.LOGIN_TYPE.AGENT.toLowerCase():
        return bookingHelpOptions?.[1]?.personaPagePath?.Agent;
      case CONSTANTS.LOGIN_TYPE.CORP_ADMIN.toLowerCase():
        return bookingHelpOptions?.[1]?.personaPagePath?.CorpConnectAdmin;
      case CONSTANTS.LOGIN_TYPE.CORP_CONNECT_USER.toLowerCase():
        return bookingHelpOptions?.[1]?.personaPagePath?.CorpConnectUser;
      default:
        return bookingHelpOptions?.[1]?.path;
    }
  };
  const manageBookRedirectionUrl = personasBaseMangeBookingFn(personasType?.roleName?.toLowerCase());
  return (
    <div className={`chat-section ${!bookingDetails?.recordLocator ? 'withoutprn' : ''}`}>
      <HtmlBlock
        html={bookingHelpTitle?.html}
        className="skyplus-text  chat-section__heading need-help-heading"
      />
      <ul className="chat-section__list">
        <li
          className="chat-section__list__chat-item"
          onClick={() => (isChatboxPath ? window.open(isChatboxPath, '_blank') : false)}
          aria-hidden="true"
        >
          <div
            className={`help-link 
              ${!isChatboxPath ? 'contact-us-contact-option-chat' : ''}`}
          >
            <div className="help-item-left-sec">
              <div className="help-icon">
                <i className="icon-chat-with-us" />
              </div>
              <div className="help-content">
                <div className="help-title"> {bookingHelpOptionsUpdated?.[0]?.title}</div>
                <HtmlBlock
                  html={bookingHelpOptionsUpdated?.[0]?.description?.html}
                  className="skyplus-text help-description"
                />
              </div>
            </div>
            <div className="help-link-icon-right">
              <i className="skyplus-accordion__icon icon-accordion-left-simple" />
            </div>
          </div>
        </li>
        {bookingHelpOptionsUpdated?.length > 1
          ? (
            <li
              className="chat-section__list__chat-item"
            >
              <a
                className="help-link"
                href={manageBookRedirectionUrl}
              >
                <div className="help-item-left-sec">
                  <div className="help-icon">
                    <i className="icon-manage-booking" />
                  </div>
                  <div className="help-content">
                    <div className="help-title"> {bookingHelpOptionsUpdated?.[1]?.title}</div>
                    <HtmlBlock
                      html={bookingHelpOptionsUpdated?.[1]?.description?.html}
                      className="skyplus-text help-description"
                    />
                  </div>
                </div>
                <div className="help-link-icon-right">
                  <i className="skyplus-accordion__icon icon-accordion-left-simple" />
                </div>
              </a>
            </li>
          ) : null}
      </ul>
    </div>
  );
};
export default ChatSection;
