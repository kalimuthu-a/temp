const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://10.42.33.144:9000',
    options: {
      'sonar.projectKey': 'Skyplus-SRP-V2',
      'sonar.projectName': 'Skyplus-SRP-V2',
      'sonar.sources': './packages/search-results/src/components',
      'sonar.login': 'be3cf0cd68e516f45e580d32827997f3755ca9b1',
    },
  },
  () => {},
);
