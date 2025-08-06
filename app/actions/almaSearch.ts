// import 'dotenv/config';
import { SearchBibs } from '@kenxirwin/alma-search';

// Debug: Log the environment variables
// console.log('ALMA_BASEURL:', process.env.ALMA_BASEURL);
// console.log('ALMA_API_KEY:', process.env.ALMA_API_KEY ? 'Set' : 'Not set');

const alma = new SearchBibs({
  baseUrl: process.env.ALMA_BASEURL || '',
  apiKey: process.env.ALMA_API_KEY || '',
});

export async function findByBarcode(barcode: string) {
  try {
    const results = await alma.barcodeLookup(barcode);
    console.log('Search results by barcode:', results);
    return results;
  } catch (error) {
    console.error('Error searching by barcode:', error);
    throw error;
  }
}

export async function bibById({ mms_id }: { mms_id: string }) {
  try {
    const results = await alma.idLookup(mms_id);
    return results;
  } catch (error) {
    console.error('Error searching by ID:', error);
    throw error;
  }
}
