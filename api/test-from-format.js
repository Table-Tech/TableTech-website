// Debug endpoint to test from email formatting
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Test different from formats
  const testCases = [
    'TableTech Team noreply@tabletech.nl',
    'TableTech <noreply@tabletech.nl>',
    'noreply@tabletech.nl',
    '"TableTech Team" <noreply@tabletech.nl>',
    'TableTech Team <noreply@tabletech.nl>'
  ];

  const results = {};

  for (const testCase of testCases) {
    let formatted = testCase;

    // Apply same logic as in create.js
    let cleanFrom = testCase.replace(/["']/g, '').trim();

    if (!cleanFrom.includes('<') && !cleanFrom.includes('>')) {
      const parts = cleanFrom.split(' ');
      if (parts.length >= 2) {
        const email = parts[parts.length - 1];
        const name = parts.slice(0, -1).join(' ');
        formatted = `${name} <${email}>`;
      } else {
        formatted = `TableTech <${cleanFrom}>`;
      }
    } else {
      formatted = cleanFrom;
    }

    results[testCase] = {
      input: testCase,
      output: formatted,
      valid: formatted.includes('<') && formatted.includes('>')
    };
  }

  // Show actual environment variables
  const envVars = {
    MAIL_FROM: {
      value: process.env.MAIL_FROM || 'NOT SET',
      length: process.env.MAIL_FROM?.length,
      formatted: null
    },
    FROM_EMAIL: {
      value: process.env.FROM_EMAIL || 'NOT SET',
      formatted: null
    }
  };

  // Format MAIL_FROM if exists
  if (process.env.MAIL_FROM) {
    let cleanFrom = process.env.MAIL_FROM.replace(/["']/g, '').trim();

    if (!cleanFrom.includes('<') && !cleanFrom.includes('>')) {
      const parts = cleanFrom.split(' ');
      if (parts.length >= 2) {
        const email = parts[parts.length - 1];
        const name = parts.slice(0, -1).join(' ');
        envVars.MAIL_FROM.formatted = `${name} <${email}>`;
      } else {
        envVars.MAIL_FROM.formatted = `TableTech <${cleanFrom}>`;
      }
    } else {
      envVars.MAIL_FROM.formatted = cleanFrom;
    }
  }

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    testCases: results,
    environmentVariables: envVars,
    recommendation: 'Set MAIL_FROM to: TableTech Team <noreply@tabletech.nl>'
  });
};