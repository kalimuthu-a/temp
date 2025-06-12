/* eslint-disable react/prop-types */
import React, { forwardRef } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import format from 'date-fns/format';

import Ad from './Ad/Ad';
import { dateFormats } from '../../constants';
import useAppContext from '../../hooks/useAppContext';

const BoardingPassComponent = forwardRef((props, ref) => {
  const { passses, recordLocator } = props;

  const {
    aemLabel,
    formattedAEMLabel,
    state: { ssrs: ssrData },
  } = useAppContext();

  const aemLabels = {
    boardingPassPrintTitle: aemLabel('boardingPass.boardingPassPrintTitle'),
    flightLabel: aemLabel('boardingPass.flightLabel'),
    gateLabel: aemLabel('boardingPass.gateLabel'),
    boardingTimeLabel: aemLabel('boardingPass.boardingTimeLabel'),
    boardingLabel: aemLabel('boardingPass.boardingLabel'),
    seatLabel: aemLabel('boardingPass.seatLabel'),
    sequenceNumber: aemLabel('boardingPass.sequenceNumber'),
    servicesLabel: aemLabel('boardingPass.servicesLabel'),
    departureLabel: aemLabel('boardingPass.departureLabel'),
    dateLabel: aemLabel('boardingPass.dateLabel'),
    pnrLabel: aemLabel('boardingPass.pnrLabel'),
    gateInformation: aemLabel('boardingPass.gateInformation.html'),
    indigoIcon: aemLabel('boardingPass.logoImagePath._publishUrl'),
    toLabel: aemLabel('boardingPass.toLabel', 'To'),
    terminalAbbr: aemLabel('boardingPass.terminalAbbr', 'T'),
    hrsAbbr: aemLabel('boardingPass.hrsAbbr', 'Hrs'),
    zoneLabel: aemLabel('boardingPass.hrsAbbr', ''),
    nextLabel: aemLabel('boardingPass.nextLabel', ''),
    termsAndConditionsLabel: aemLabel(
      'boardingPass.termsAndConditionsLabel',
      '',
    ),
    tierLabel: aemLabel('boardingPass.tierLabel', 'Tier'),
    ffnLabel: aemLabel('boardingPass.ffnLabel', 'FFN'),
    zone: aemLabel('boardingPass.zone', 'Zone'),
  };

  const groupedBoardingPass = passses.reduce((acc, pass) => {
    const { passenger } = pass;

    const key = `${passenger.name.first}-${passenger.name.last}`;

    if (!Reflect.has(acc, key)) {
      acc[key] = [];
    }

    acc[key].push(pass);

    return acc;
  }, {});

  return (
    <div className="boarding-check__print-boarding-pass" ref={ref}>
      {Object.values(groupedBoardingPass).map((passGroup, index) => {
        const [fpass] = passGroup;

        const destinationAd = fpass?.segments?.designator?.destination;

        return (
          <div
            key={uniq()}
            style={{ pageBreakBefore: index === 0 ? 'avoid' : 'always' }}
          >
            {passGroup.map((pass) => {
              const {
                segments,
                passenger,
                seat,
                boardingZone,
                boardingSequence,
                ssrs,
                productClass,
                isNext,
              } = pass;

              const { carrierCode, identifier } = segments.identifier;
              const { boardingTime, designator, departureGate } = segments;
              const { barCodeBase64, isoName } = passenger;

              const {
                arrivalTerminal: at,
                departureTerminal: dt,
                departure,
                destinationStationName,
                originStationName,
                origin,
                destination,
              } = designator;

              const isoNameData = `${isoName.last}/${isoName.first} ${isoName.title}`;

              const departureTerminal = dt ? `(T${dt})` : '';
              const arrivalTerminal = at ? `(T${at})` : '';

              const services = ssrs.length > 0 ? ssrs.join(', ') : '-';

              let servicesLabel = '';

              ssrs.forEach((ssr) => {
                const ssrName = ssrData.get(ssr);
                if (ssrName) {
                  servicesLabel += ` ${ssr}-${ssrName}`;
                }
              });

              if (servicesLabel) {
                servicesLabel += `<span>${aemLabels.termsAndConditionsLabel}</span>`;
              }

              const productClassLabel = aemLabel(
                'boardingPass.fareTypes',
                [],
              )?.find((i) => i.productClass === productClass)?.fareBadge;

              return (
                <div
                  key={passenger.barCode}
                  className="boarding-pass-container"
                >
                  <div className="boarding-root">
                    <section className="indigo-logo">
                      <div className="passenger-details">
                        <img
                          className="indigo-logo-icon"
                          alt=""
                          src={aemLabels.indigoIcon}
                        />
                        <div className="boarding-pass-web">
                          {aemLabels.boardingPassPrintTitle}
                        </div>
                        {isNext && (
                          <div className="boarding-check__next-chip">
                            <p>{productClassLabel}</p>
                          </div>
                        )}
                      </div>
                      <div className="passenger-flight-details">
                        <div className="passenger-name">
                          <div className="subramaniankrish-mr">
                            {isoNameData}
                            {passenger?.program?.number && (
                              <div className="loyalty-tier">
                                <span className="tier">
                                  {aemLabels.tierLabel}:{' '}
                                  <span>{passenger?.program?.levelCode}</span>
                                </span>
                                <span className="ffn">
                                  {aemLabels.ffnLabel}:{' '}
                                  <span>{passenger?.program?.number}</span>
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="route">
                            <div className="delhi-t1-to-container">
                              <span>
                                {originStationName} {departureTerminal}{' '}
                                {`${aemLabels.toLabel} `}
                                <span className="dubai-t1">
                                  {' '}
                                  {destinationStationName} {arrivalTerminal}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flight-details">
                          <div className="flight-details-values">
                            <div className="flight">
                              {aemLabels.flightLabel}
                            </div>
                            <div className="e-7634">{`${carrierCode} ${identifier}`}</div>
                          </div>
                          <div className="flight-details-values1">
                            <div className="gate">{aemLabels.gateLabel}</div>
                            <div className="div">{departureGate ?? '-'}</div>
                          </div>
                          <div className="flight-details-values2">
                            <div className="boarding-time">
                              {aemLabels.boardingTimeLabel}
                            </div>
                            <div className="hrs">
                              {format(boardingTime, dateFormats.HHMM)}{' '}
                              {aemLabels.hrsAbbr}
                            </div>
                          </div>
                          <div className="flight-details-values3">
                            <div className="boarding">
                              {aemLabels.boardingLabel}
                            </div>
                            <div className="zone-1">
                              {aemLabels.zone} {boardingZone}
                            </div>
                          </div>
                          <div className="flight-details-values4">
                            <div className="seat">{aemLabels.seatLabel}</div>
                            <div className="c">{seat}</div>
                          </div>
                        </div>
                        <div className="boarding-info">
                          <img
                            className="mask-group-icon"
                            alt="No"
                            src={barCodeBase64}
                          />
                          <div className="departure-info">
                            <div className="departure-details">
                              <div className="departure-labels">
                                <div className="departure-date">
                                  <div className="date">
                                    {aemLabels.dateLabel}
                                  </div>
                                  <div className="seq">
                                    {aemLabels.sequenceNumber}
                                  </div>
                                </div>
                                <div className="departure-services">
                                  <div className="mar-2019">
                                    {format(departure, 'dd MMM yyyy')}
                                  </div>
                                  <div className="fast-forward">
                                    {boardingSequence?.toString()?.padStart(3, '0')}
                                  </div>
                                </div>
                              </div>
                              <div className="departure-labels1">
                                <div className="departure-parent">
                                  <div className="departure">
                                    {aemLabels.departureLabel}
                                  </div>
                                  <div className="services">
                                    {aemLabels.servicesLabel}
                                  </div>
                                </div>
                                <div className="parent">
                                  <div className="div1">
                                    {format(departure, dateFormats.HHmm)}
                                  </div>
                                  <div className="ffwd">{services ?? ' '}</div>
                                </div>
                              </div>
                            </div>
                            <div className="gate-info">
                              <div className="gate-subject-to-change-wrapper">
                                <div className="gate-subject-to-change">
                                  <HtmlBlock
                                    className="gate-is-subject"
                                    html={aemLabels.gateInformation}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <div className="terminal-info">
                      <div className="your-departure-terminal-is-t1-wrapper">
                        <div className="your-departure-terminal">
                          <span>
                            {formattedAEMLabel(
                              'boardingPass.departureTerminal',
                              '',
                              {
                                terminal: dt ?? '',
                              },
                            )}
                            {dt}
                          </span>
                        </div>
                      </div>
                      <div className="frame-group">
                        <div className="subramaniankrish-mr-parent">
                          <div className="subramaniankrish-mr1">
                            {isoNameData}
                          </div>

                          <div className="route-details">
                            <div className="route-values">
                              <div className="delhi-t1">{`${origin} ${departureTerminal}`}</div>
                            </div>

                            <Icon className="icon-arrow-right-simple" />

                            <div className="route-values1">
                              <div className="dxb-t1">{`${destination} ${arrivalTerminal}`}</div>
                            </div>
                          </div>
                          <div className="flight-info-parent">
                            <div className="flight-info">
                              <div className="flight-number">
                                <div className="flight1">
                                  {aemLabels.flightLabel}
                                </div>
                              </div>
                              <div className="date1">{aemLabels.dateLabel}</div>
                              <div className="pnr">{aemLabels.pnrLabel}</div>
                              <div className="services1">
                                {aemLabels.servicesLabel}
                              </div>
                            </div>
                            <div className="flight-date-pnr">
                              <div className="e-76341">{`${carrierCode} ${identifier}`}</div>
                              <div className="mar-20191">
                                {format(departure, dateFormats.boardingpass)}
                              </div>
                              <div className="w88pyl">{recordLocator}</div>
                              <div className="ffwd1">{services}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mask-group-parent">
                          <img
                            className="mask-group-icon1"
                            loading="lazy"
                            alt=""
                            src={barCodeBase64}
                          />
                          <div className="image">
                            <div className="seat-sequence">
                              <div className="seat-number">
                                <div className="seat1">
                                  {aemLabels.seatLabel}
                                </div>
                              </div>
                              <div className="seq1">
                                {aemLabels.sequenceNumber}
                              </div>
                            </div>
                            <div className="c-parent">
                              <div className="c1">{seat}</div>
                              <div className="div2">
                                {boardingSequence?.toString()?.padStart(3, '0')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <HtmlBlock className="services-label" html={servicesLabel} />
                </div>
              );
            })}
            <Ad destination={destinationAd} />
          </div>
        );
      })}
    </div>
  );
});

export default BoardingPassComponent;
