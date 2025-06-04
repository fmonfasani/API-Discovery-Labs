import fs from 'fs';
import axios from 'axios';

const baseUrl = 'https://eks-production-01-api-legales.s3.us-east-1.amazonaws.com';
const wordlistPath = 'wordlists/common-files.txt';

async function scanWithWordlist() {
  console.log('🔍 Starting wordlist-based file discovery...');

  // Leer la wordlist
  const words = fs.readFileSync(wordlistPath, 'utf-8').split(/\r?\n/);

  const results = [];

  for (const word of words) {
    if (word.trim() === '') continue; // Saltear líneas vacías
    try {
      const url = `${baseUrl}/${word}`;
      const response = await axios.get(url, { validateStatus: false });

      results.push({
        file: word,
        status: response.status,
        accessible: response.status === 200 ? '✅ Accessible' : '❌ Not Accessible',
      });
    } catch (error) {
      results.push({
        file: word,
        status: 'Error',
        accessible: '❌ Error',
      });
    }
  }

  console.table(results);
}

scanWithWordlist();
                                                                                                                                                