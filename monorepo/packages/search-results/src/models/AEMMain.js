class AEMMain {
  selectLabel = 'Select your departure flight from {from} to {to}';

  allFlightsLabel = 'ALL FLIGHTS';

  continueNextPath = '';

  modificationContinueNextPath = '';

  continueNextCtaLabel = '';

  filters = {
    nonStopLabel: 'Non-stop',
    oneStopLabel: 'One Stop',
    lowCostFirstLabel: 'Low cost first',
    dayDepartLabel: 'Day departures',
    earlyDepartLabel: 'Early Departure',
    lateDepartLabel: 'Late Departure',
  };

  recommendationsLabel = 'Recommendations';

  travelRecommendationLabel = null;

  fareTypeLabel = 'Fare type';

  selectFlightLabel = 'Select';

  startsAtLabel = 'Starts at';

  fillingFastLabel = 'Filling Fast';

  nonStopLabel = 'Non-stop';

  stopsLabel = 'stop';

  offers = [];

  nextBackground = {
    _publishUrl: '',
  };

  nextServiceImages = [];

  nextDisableForUMNR = 'Fare Type is not applicable for unaccompanied minor';

  constructor(obj) {
    Object.assign(this, obj);
  }
}

export default AEMMain;
