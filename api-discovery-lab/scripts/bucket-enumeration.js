import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const bucketUrl = 'https://eks-production-01-api-legales.s3.us-east-1.amazonaws.com/';

async function tryBucketEnumeration() {
  console.log('🔍 Attempting bucket enumeration...');
  
  try {
    const response = await axios.get(bucketUrl);
    const data = await parseStringPromise(response.data);
    
    if (data.ListBucketResult && data.ListBucketResult.Contents) {
      console.log('📂 Bucket is listable! Here are the files:');
      data.ListBucketResult.Contents.forEach(item => {
        console.log(`- ${item.Key[0]}`);
      });
    } else {
      console.log('✅ Bucket listing is not allowed (secured).');
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Bucket listing is forbidden (secure).');
    } else if (error.response && error.response.status === 404) {
      console.log('❌ Bucket not found or misconfigured.');
    } else {
      console.log('❌ Unknown error:', error.message);
    }
  }
}

tryBucketEnumeration();
