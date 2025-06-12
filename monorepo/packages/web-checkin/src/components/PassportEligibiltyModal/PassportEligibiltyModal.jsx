import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import InfoAlert from '../common/Alerts/InfoAlert';
import UserAvatar from '../common/Avatar/UserAvatar';
import useAppContext from '../../hooks/useAppContext';
import { localStorageKeys } from '../../constants';
import { getPassengerPostData } from '../../pages/WebCheckIn/utils';
import { postPassengerhealthform } from '../../services';
import LocalStorage from '../../utils/LocalStorage';

const PassportEligibiltyModal = ({
  onClose,
  travelDocument = [],
  journey,
  formData,
}) => {
  const {
    state: { aemModel },
    aemLabel,
    formattedAEMLabel,
  } = useAppContext();

  const aemLabels = aemModel?.checkinPassenger;
  const eligibilityAem = aemModel?.checkinPassenger?.eligibilityCheck;

  const ineligibleCount = travelDocument?.filter(
    (doc) => !doc?.documentCheckStatus,
  )?.length;

  const onClickClose = () => {
    onClose();
  };

  const aemLabeller = useMemo(() => {
    return {
      backtoWebcheckin: aemLabel(
        'checkinPassenger.eligibilityPass.backtoWebcheckin',
        'Return to web check-in',
      ),
      nextLink: aemLabel('checkinPassenger.nextLink'),
      webCheckInHomeCTALink: aemLabel(
        'checkinPassenger.eligibilityPass.webCheckInHomeCTALink',
        '/web-check-in.html',
      ),
      countHeading: formattedAEMLabel(
        'checkinPassenger.eligibilityPass.countHeading',
        '{ineligibleCount} out of {total} passenger(s) are not eligible for <span> web checkin</span>',
        {
          ineligibleCount,
          total: travelDocument.length,
        },
      ),
    };
  }, [aemLabel]);

  const onClickCheckIn = async () => {
    const { journeyKey } = journey.journeysDetail;
    const passengerData = getPassengerPostData(formData, journeyKey);

    const invalidPassportUsers = [];

    travelDocument.forEach((passenger, index) => {
      if (passenger?.documentCheckStatus === false) {
        invalidPassportUsers.push(formData?.[index]?.passengerKey);
      }
    });

    await postPassengerhealthform(passengerData);

    const manualCheckinRequestPayload = {
      baggageDeclarationRequest: [],
      manualCheckinRequest: [
        {
          journeyKey,
          passengerkeys: formData
            .map(({ passengerKey }) => ({
              passengerKey,
            }))
            .filter(({ passengerKey }) => {
              return !invalidPassportUsers.includes(passengerKey);
            }),
        },
      ],
    };

    LocalStorage.set(localStorageKeys.m_c_r, manualCheckinRequestPayload);
    window.location.href = aemLabeller.nextLink;
  };

  const notEligible = travelDocument.length === ineligibleCount;

  const onClickBackToCheckin = () => {
    window.location.href = aemLabeller.webCheckInHomeCTALink;
  };

  return (
    <ModalComponent onClose={onClose}>
      <div className="passport-eligibilty-modal">
        <div className="passport-eligibilty-modal__heading">
          {ineligibleCount === 0
            ? 'Passport Eligible'
            : aemLabels?.eligibilityCheck?.note}
        </div>
        <HtmlBlock
          html={aemLabeller.countHeading}
          className="skyplus-heading  h4"
        />
        {travelDocument?.map((passenger) => (
          <div
            key={passenger?.passengerAlternateKey}
            className="passport-eligibilty-modal__passenger-eligibilty passport-eligibilty-modal__border-bottom"
          >
            <div className="passport-eligibilty-modal__passenger-eligibilty__avtar-description">
              <UserAvatar
                av={`${passenger?.name?.first?.charAt(
                  0,
                )}${passenger?.name?.last?.charAt(0)}`}
              />
              <div className="passport-eligibilty-modal__passenger-eligibilty__avtar-description__name">
                {`${passenger?.name?.first} ${passenger?.name?.last}`}
              </div>
            </div>
            {passenger.documentCheckStatus ? (
              <Chip
                containerClass="passport-eligibilty-modal__eligible-chip"
                variant="outlined"
                withBorder
                size="xs"
                color="secondary-light"
                border="system-success"
                txtcol="system-success"
              >
                {eligibilityAem?.markerLabels?.eligible}
              </Chip>
            ) : (
              <Chip
                variant="filled"
                color="secondary-light"
                size="sm"
                border="system-success"
                txtcol="orange"
                containerClass="passport-eligibilty-modal__non-eligible-chip"
              >
                {eligibilityAem?.markerLabels?.notEligible}
              </Chip>
            )}
          </div>
        ))}
        <div className="passport-eligibilty-modal__alert-info mb-10">
          <InfoAlert>{eligibilityAem?.heading}</InfoAlert>
        </div>
        <div className="passport-eligibilty-modal--footer">
          <Button block variant="outline" onClick={onClickClose}>
            {eligibilityAem?.ctaLabel}
          </Button>
          {notEligible ? (
            <Button block onClick={onClickBackToCheckin}>
              {aemLabeller?.backtoWebcheckin}
            </Button>
          ) : (
            <Button block onClick={onClickCheckIn} disabled={notEligible}>
              {eligibilityAem?.secondaryCtaLabel}
            </Button>
          )}
        </div>
      </div>
    </ModalComponent>
  );
};

PassportEligibiltyModal.propTypes = {
  formData: PropTypes.array,
  journey: PropTypes.any,
  onClose: PropTypes.func,
  travelDocument: PropTypes.any,
};

export default PassportEligibiltyModal;
