import { any } from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import RedirectTo from '../../utils/redirect';

const ChatWithUs = ({ chatWithUs }) => {
  return (
    <div className="chatWithUs--wrapper">
      <div className="left">
        <img src={chatWithUs?.image?._publishUrl} alt="" />
        <div>
          <h4>{chatWithUs?.title}</h4>
          <HtmlBlock tag="p" html={chatWithUs?.description?.html} />
        </div>
      </div>
      <Icon className="icon-accordion-left-24" size="md" onClick={() => RedirectTo(chatWithUs?.path)} />
    </div>
  );
};
ChatWithUs.propTypes = {
  chatWithUs: any,
};
export default ChatWithUs;
