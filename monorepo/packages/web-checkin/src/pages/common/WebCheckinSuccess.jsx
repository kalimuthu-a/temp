import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import useAppContext from '../../hooks/useAppContext';

const WebCheckInSuccessModal = ({ size = 'md' }) => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const { aemLabel } = useAppContext();

  const aemLabels = useMemo(() => {
    return {
      webcheckinDone: aemLabel('dangerousGoods.webcheckin.title'),
      webcheckinDescription: aemLabel('dangerousGoods.webcheckin.description'),
      okCta: aemLabel('dangerousGoods.webcheckin.ok', 'Ok'),
      okCtaLink: aemLabel('dangerousGoods.webcheckin.okCtaLink'),
      selectSeatCta: aemLabel('dangerousGoods.webcheckin.selectSeatCta'),
      selectSeatCtaLink: aemLabel('dangerousGoods.webcheckin.selectSeatCta'),
    };
  }, [aemLabel]);

  const onClickOkHandler = () => {
    window.location.href = aemLabels.okCtaLink;
  };

  const onClickSeatSelectHandler = () => {
    window.location.href = aemLabels.selectSeatCtaLink;
  };

  return createPortal(
    <div className="skyplus-modal webckeckin-success">
      <div className={`skyplus-modal-content ${size}`}>
        <div className="skyplus-modal-content-heading">
          {aemLabels.webcheckinDone}
        </div>
        <div className="skyplus-modal-content-body">
          {aemLabels.webcheckinDescription}
        </div>
        <div className="skyplus-modal-content-footer">
          <Button onClick={onClickOkHandler} block>
            {aemLabels.okCta}
          </Button>
          <Button onClick={onClickSeatSelectHandler} variant="outline">
            {aemLabels.selectSeatCta}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default WebCheckInSuccessModal;
