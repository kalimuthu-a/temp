const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://10.42.33.144:9000',
    options: {
      'sonar.projectKey': 'Skyplus-Booking-V2',
      'sonar.projectName': 'Skyplus-Booking-V2',
      'sonar.sources': './packages/booking/src/components',
      'sonar.login': 'be3cf0cd68e516f45e580d32827997f3755ca9b1',
    },
  },
  () => {},
);
