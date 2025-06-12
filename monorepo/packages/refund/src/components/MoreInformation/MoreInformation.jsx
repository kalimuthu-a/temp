import React, { useEffect, useState } from 'react';
import { any } from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { KEYBOARD_KEYS } from '../../constants';

const MoreInformation = ({ aemData }) => {
  const {
    moreInfoLabel,
    moreInfoOptions,
  } = aemData || [];
  const [accordionData, setAccordionData] = useState([]);
  useEffect(() => {
    const initApp = () => {
      const data = moreInfoOptions && moreInfoOptions?.map((el) => ({ ...el, visible: false }));
      setAccordionData(data);
    };
    initApp();
  }, [aemData]);
  const activeAccordion = (index, e = null) => {
    if (e?.keyCode === KEYBOARD_KEYS.ENTER || e?.which === KEYBOARD_KEYS.ENTER || !e) {
      let accData = [...accordionData];
      accData = accData.map((el, id) => ((id === index) ? ({ ...el, visible: !el.visible }) : el));
      setAccordionData(accData);
    }
  };

  return (
    <>
      <HtmlBlock tagName="h4" className="h4 mb-6" html={moreInfoLabel?.html?.slice(4)} />
      <div className="moreInformation--listItem">
        {accordionData && accordionData.map(({ description, title, icon, visible }, idx) => (
          <div className="rf--accordion">
            <div
              className="rf--accordion__header"
              onKeyDown={(e) => activeAccordion(idx, e)}
              onClick={() => activeAccordion(idx)}
              role="button"
              tabIndex={0}
            >
              <div>
                <Icon className={icon} />
                <p>{title}</p>
              </div>
              <Icon className={`${!visible ? 'icon-accordion-down-simple' : 'icon-accordion-up-simple'}`} />
            </div>
            <div className={`rf--accordion__body ${visible ? 'show' : ''}`}>
              <HtmlBlock tagName="p" html={description?.html} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
MoreInformation.propTypes = {
  aemData: any,
};
export default MoreInformation;
