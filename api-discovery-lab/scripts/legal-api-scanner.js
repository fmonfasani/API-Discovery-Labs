// scripts/legal-api-scanner.js

const axios = require('axios');
const { URL } = require('url');

async function scanLegalApi() {
  const endpoint = 'https://api-legales.prod.sportclub.com.ar/api/legales?multi=true&origen=2';

  console.log('🚀 Starting Legal API Vulnerability Scanner...');

  try {
    const response = await axios.get(endpoint);

    if (response.data.error || response.status !== 200) {
      console.error('❌ Error fetching data from API.');
      return;
    }

    const legals = response.data.body.flatMap(entry => entry.legals);

    console.log(`🔍 Found ${legals.length} documents.`);

    const results = [];

    for (const doc of legals) {
      const { title, fileLink } = doc;

      try {
        const headResponse = await axios.head(fileLink);

        const url = new URL(fileLink);

        const isPreSignedUrl = url.searchParams.has('X-Amz-Signature');
        const expiresIn = url.searchParams.get('X-Amz-Expires') || 'unknown';

        results.push({
          title,
          fileLink,
          status: headResponse.status,
          preSigned: isPreSignedUrl,
          expiresIn,
          vulnerability: isPreSignedUrl ? '🕵️‍♂️ Pre-Signed URL exposed' : 'None'
        });

      } catch (error) {
        results.push({
          title,
          fileLink,
          status: error.response ? error.response.status : 'Network Error',
          preSigned: 'Unknown',
          expiresIn: 'Unknown',
          vulnerability: '❌ Dead link'
        });
      }
    }

    console.table(results);

    const exposed = results.filter(r => r.vulnerability !== 'None');
    console.log(`\n🚨 Total Vulnerabilities Found: ${exposed.length}`);

    exposed.forEach(vuln => {
      console.log(`⚠️  ${vuln.vulnerability} -> ${vuln.title}`);
    });

  } catch (error) {
    console.error('❌ Failed to scan API:', error.message);
  }
}

scanLegalApi();
