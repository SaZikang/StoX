export function getMarketStatus() {
  const now = new Date();
  const gmtHour = now.getUTCHours();
  const gmtMinute = now.getUTCMinutes();
  const totalGmtMinutes = gmtHour * 60 + gmtMinute;
  const day = now.getUTCDay(); // 0 = Sun, 6 = Sat

  // Weekend check for global/forex markets (Closed from Friday 22:00 GMT to Sunday 22:00 GMT)
  const isWeekend =
    (day === 6) ||
    (day === 0 && totalGmtMinutes < 1320) ||
    (day === 5 && totalGmtMinutes >= 1320);

  if (isWeekend) {
    return {
      isOpen: false,
      statusText: 'Market Close',
      mytHours: '10:30 PM – 5:00 AM MYT',
      isEDT: false
    };
  }

  // Global Session Times in GMT:
  // • Sydney Session: 10:00 PM – 7:00 AM GMT (22:00 – 07:00) => 1320 to 420 mins
  // • Tokyo Session: 12:00 AM – 9:00 AM GMT (00:00 – 09:00) => 0 to 540 mins
  // • London Session: 8:00 AM – 5:00 PM GMT (08:00 – 17:00) => 480 to 1020 mins
  // • New York Session: 1:00 PM – 10:00 PM GMT (13:00 – 22:00) => 780 to 1320 mins

  const isSydneyOpen = totalGmtMinutes >= 1320 || totalGmtMinutes < 420;
  const isTokyoOpen = totalGmtMinutes >= 0 && totalGmtMinutes < 540;
  const isLondonOpen = totalGmtMinutes >= 480 && totalGmtMinutes < 1020;
  const isNewYorkOpen = totalGmtMinutes >= 780 && totalGmtMinutes < 1320;

  // Check NYSE specific equity hours (9:30 AM – 4:00 PM ET)
  const nyFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });
  const parts = nyFormatter.formatToParts(now);
  const nyWeekday = parts.find(p => p.type === 'weekday')?.value;
  const nyHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
  const nyMinute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
  const nyTotalMins = nyHour * 60 + nyMinute;
  const isNyEquityOpen = nyWeekday !== 'Sat' && nyWeekday !== 'Sun' && nyTotalMins >= 570 && nyTotalMins < 960;

  let statusText = 'Market Close';
  let isOpen = false;

  if (isNyEquityOpen) {
    isOpen = true;
    statusText = 'NYSE Session Open';
  } else {
    // Collect active sessions. If overlap, put the latest one (chronological order: Sydney -> Tokyo -> London -> New York)
    const openSessions = [];
    if (isSydneyOpen) openSessions.push('Sydney Session Open');
    if (isTokyoOpen) openSessions.push('Tokyo Session Open');
    if (isLondonOpen) openSessions.push('London Session Open');
    if (isNewYorkOpen) openSessions.push('New York Session Open');

    if (openSessions.length > 0) {
      isOpen = true;
      // Overlap rule: "if overlap put the latest one" (last in sequence)
      statusText = openSessions[openSessions.length - 1];
    } else {
      statusText = 'Market Close';
    }
  }

  // Malaysia Time info
  const nyString = now.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' });
  const isEDT = nyString.includes('EDT');
  const openMYT = isEDT ? '9:30 PM' : '10:30 PM';
  const closeMYT = isEDT ? '4:00 AM' : '5:00 AM';
  const mytHours = `${openMYT} – ${closeMYT} MYT`;

  return {
    isOpen,
    statusText,
    mytHours,
    isEDT
  };
}
