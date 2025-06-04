import axios from 'axios';

const baseUrl = 'https://eks-production-01-api-legales.s3.us-east-1.amazonaws.com';

const knownDocuments = [
  'BYC%20ESTADIA%20HOWARD%20JOHNSON%20%28001%29.pdf',
  'BYC%20BOLETOS%20SANTIAGO%20DE%20CHILE.pdf',
  'BYC%20AVELLANA%20MODA.pdf',
  'BASES%20Y%20CONDICIONES%20DOG%20RUN%20-%20JUNIO%202025.pdf',
  'BYC%20FOREST%20DAN%20TORTUGAS%20-%20MINI%20MAURA%20%28001%29.pdf',
  'BYC%20BECA%20CODERHOUSE%202025.pdf',
  'Bases%20y%20Condiciones%20Carrera%2021K%20olimpicos.pdf',
  'BASES%20Y%20CONDICIONES%20DE%20SORTEO%20PAMPAS%20VS%20DOGOS.pdf',
  'TYC-PLAN-TOTAL-ANUAL-WEB.pdf',
  'TYC%20PLAN%20TOTAL%20MENSUAL%20%28WEB%29%20%28002%29.pdf',
  'TYC%20PLAN%20PLUS%20ANUAL%20%28WEB%29%20%28002%29.pdf',
  'TYC%20PLAN%20PLUS%20MENSUAL%20%28WEB%29%20%28002%29.pdf',
  'TYC%20PLAN%20FLEX%20ANUAL%20%28WEB%29%20%28002%29.pdf',
  'TYC%20PLAN%20FLEX%20MENSUAL%20%28WEB%29%20%28002%29.pdf',
];

async function simpleAccessTest() {
  console.log('🔍 Starting basic S3 file access scan...');
  const results = [];

  for (const doc of knownDocuments) {
    try {
      const url = `${baseUrl}/${doc}`;
      const response = await axios.get(url);

      results.push({
        document: doc,
        status: response.status,
        accessible: response.status === 200 ? '✅ Accessible' : '❌ Not Accessible',
      });
    } catch (error) {
      if (error.response) {
        results.push({
          document: doc,
          status: error.response.status,
          accessible: '❌ Not Accessible',
        });
      } else {
        results.push({
          document: doc,
          status: 'Unknown',
          accessible: '❌ Error',
        });
      }
    }
  }

  console.table(results);

  // Bucket enumeration test
  try {
    console.log('🔍 Attempting bucket enumeration...');
    const listResponse = await axios.get(baseUrl);
    console.log('🚨 Bucket listing allowed:', listResponse.status);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Bucket listing is forbidden (secure).');
    } else {
      console.log('❓ Unexpected response during bucket enumeration.', error.message);
    }
  }

  // HTTP Methods Misconfiguration Test
  console.log('🔍 Testing HTTP Methods (HEAD, PUT, DELETE, POST)...');
  const methods = ['HEAD', 'PUT', 'DELETE', 'POST'];
  const methodResults = [];

  for (const method of methods) {
    try {
      const testResponse = await axios({
        url: `${baseUrl}/${knownDocuments[0]}`,
        method,
        validateStatus: () => true,
      });

      methodResults.push({
        method,
        status: testResponse.status,
        vulnerable: testResponse.status === 200 || testResponse.status === 204 ? '🚨 Potential Risk' : '✅ Secure',
      });
    } catch (error) {
      methodResults.push({
        method,
        status: 'Error',
        vulnerable: '❌ Error',
      });
    }
  }

  console.table(methodResults);
}

simpleAccessTest();
