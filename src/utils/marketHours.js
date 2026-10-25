export function getMarketStatus() {
  const now = new Date();

  // Get current time in New York
  const nyFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });

  const parts = nyFormatter.formatToParts(now);
  const weekday = parts.find(p => p.type === 'weekday')?.value;
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

  // Check if weekend
  const isWeekend = weekday === 'Sat' || weekday === 'Sun';

  // Market hours: 9:30 AM to 4:00 PM ET
  const totalMinutes = hour * 60 + minute;
  const openMinutes = 9 * 60 + 30; // 9:30 AM = 570 mins
  const closeMinutes = 16 * 60;    // 4:00 PM = 960 mins

  const isOpen = !isWeekend && totalMinutes >= openMinutes && totalMinutes < closeMinutes;

  // Check if US is in Daylight Saving Time (EDT vs EST)
  const nyString = now.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' });
  const isEDT = nyString.includes('EDT');

  // Malaysia Time (MYT, UTC+8) conversion:
  // EDT (UTC-4) -> MYT (+12h): 9:30 PM – 4:00 AM MYT
  // EST (UTC-5) -> MYT (+13h): 10:30 PM – 5:00 AM MYT
  const openMYT = isEDT ? '9:30 PM' : '10:30 PM';
  const closeMYT = isEDT ? '4:00 AM' : '5:00 AM';
  const mytHours = `${openMYT} – ${closeMYT} MYT`;

  return {
    isOpen,
    statusText: isOpen ? 'NYSE / NASDAQ OPEN' : 'NYSE / NASDAQ CLOSED',
    mytHours,
    isEDT
  };
}
