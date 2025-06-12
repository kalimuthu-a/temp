import React, { useMemo } from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import useAppContext from '../../../hooks/useAppContext';

const ChatSection = () => {
  const { aemLabel } = useAppContext();

  const aemLabels = useMemo(() => {
    return {
      needHelpHeading: aemLabel('boardingPass.needHelpLabel.html'),
      chatWithUs: aemLabel('boardingPass.needHelpOptions.0.title'),
      helpDescription: aemLabel(
        'boardingPass.needHelpOptions.0.description.html',
      ),
      helpLink: aemLabel(
        'boardingPass.needHelpOptions.0.path',
        '/support.html',
      ),
    };
  }, [aemLabel]);

  return (
    <div className="chat-section withoutprn">
      <HtmlBlock
        className="skyplus-text chat-section__heading need-help-heading px-4"
        html={aemLabels.needHelpHeading}
      />
      <ul className="chat-section__list">
        <li className="chat-section__list__chat-item" aria-hidden="true">
          <a
            className="help-link "
            href={aemLabels.helpLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="help-item-left-sec">
              <div className="help-icon">
                <i className="icon-chat-with-us" />
              </div>
              <div className="help-content">
                <div className="help-title">{aemLabels.chatWithUs}</div>
                <HtmlBlock
                  className="skyplus-text help-description"
                  html={aemLabels.helpDescription}
                />
              </div>
            </div>
            <div className="help-link-icon-right">
              <i className="skyplus-accordion__icon icon-accordion-left-simple" />
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
};
export default ChatSection;
