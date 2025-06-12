/** Current webcheckin enables 48 hours before */

export default function webCheckInNotifier(departure) {
  const hours48InMilliSec = 48 * 3600 * 1000;
  const departureDate = new Date(departure);
  const departureTime = departureDate.getTime();
  const currentTime = Date.now();
  return (departureTime - currentTime) <= hours48InMilliSec;
}
