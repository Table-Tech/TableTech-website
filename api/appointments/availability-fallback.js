// Fallback availability data when database is unavailable
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Generate demo availability data
  const slots = [];
  const today = new Date();
  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

  // Generate slots for next 30 days (weekdays only)
  for (let d = 0; d < 30; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayOfWeek = date.getDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = date.toISOString().split('T')[0];

    // Generate time slots from 9:00 to 17:00
    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        // Make some slots unavailable for realism
        const randomAvailable = Math.random() > 0.3;

        slots.push({
          date: dateStr,
          time: time,
          available: randomAvailable,
          dayName: dayNames[dayOfWeek]
        });
      }
    }
  }

  const response = {
    slots: slots,
    timezone: 'Europe/Amsterdam',
    generatedAt: new Date().toISOString(),
    fallback: true,
    message: 'Using fallback data - database unavailable'
  };

  return res.status(200).json(response);
};