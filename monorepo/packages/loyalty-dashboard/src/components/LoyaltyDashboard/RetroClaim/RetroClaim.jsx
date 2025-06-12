import React from 'react';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { useUserSummaryContext } from '../../../store/user-summary-context';

const RetroClaim = () => {
  const [isMobile] = useIsMobile();
  const { aemData } = useUserSummaryContext();
  return (
    <div className="loyalty-db-retro-claim">
      <div className="loyalty-db-retro-claim__content">
        { isMobile && <p>{aemData?.retroClaimCtaLabel || 'Retro Claim your miles'}</p> }
        <h4
          dangerouslySetInnerHTML={{
            __html: aemData?.retroClaimCtaDescription?.html || 'Earn points on your past flights',
          }}
        />
      </div>
      <div className="loyalty-db-retro-claim__action">
        <a href={aemData?.retroClaimCtaPath}>
          { !isMobile && <p>{aemData?.retroClaimCtaLabel || 'Retro Claim your miles'}</p> }
          <span><i className="icon-arrow-top-right" /></span>
        </a>
      </div>
    </div>
  );
};

export default RetroClaim;
