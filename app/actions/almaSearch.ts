// import 'dotenv/config';
'use server';
import { SearchBibs } from '@kenxirwin/alma-search';

// Debug: Log the environment variables
// console.log('ALMA_BASEURL:', process.env.ALMA_BASEURL);
// console.log('ALMA_API_KEY:', process.env.ALMA_API_KEY ? 'Set' : 'Not set');

export async function findByBarcode(barcode: string) {
  try {
    const alma = new SearchBibs({
      baseUrl: process.env.ALMA_BASEURL || '',
      apiKey: process.env.ALMA_API_KEY || '',
    });
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
    const alma = new SearchBibs({
      baseUrl: process.env.ALMA_BASEURL || '',
      apiKey: process.env.ALMA_API_KEY || '',
    });
    const results = await alma.idLookup({ mms_id });
    console.log('Search results by ID:', results);
    return { data: results };
  } catch (error) {
    console.error('Error searching by ID:', error);
    return { error: 'Lookup failed with message:' + `: ${error}` };
  }
}
