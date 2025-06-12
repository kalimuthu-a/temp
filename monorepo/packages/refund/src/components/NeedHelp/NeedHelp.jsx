import { any, string } from 'prop-types';
// import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import BookAgain from '../BookAgain/BookAgain';
// import ChatWithUs from '../ChatWithUs/ChatWithUs';

const NeedHelp = ({ bookAgain, trackAnotherRefundLabel, trackAnotherRefundPath }) => {
  return (
    <>
      {trackAnotherRefundLabel
        && (
        <a
          href={trackAnotherRefundPath || '/'}
          className="trackAnotherLink"
        >
          {trackAnotherRefundLabel}
        </a>
        )}
      {/* <HtmlBlock tag="h4" className="h4 mb-6" html={needHelp?.html?.slice(4)} /> */}
      {/* <ChatWithUs chatWithUs={chatWithUs} /> */}
      <BookAgain bookAgain={bookAgain} />
    </>
  );
};

NeedHelp.propTypes = {
  // chatWithUs: any,
  bookAgain: any,
  // needHelp: any,
  trackAnotherRefundLabel: string,
  trackAnotherRefundPath: string,
};
export default NeedHelp;
