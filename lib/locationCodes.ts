import logger from '@/lib/logger';

export type LocationCode = {
  code: string;
  name: string;
  unofficial?: boolean;
};

export const inHouseLocationCodes = () => {
  if (typeof process.env.NEXT_PUBLIC_LOCATION_CODES_JSON === 'string') {
    try {
      const parsedLocations: LocationCode[] = JSON.parse(
        process.env.NEXT_PUBLIC_LOCATION_CODES_JSON
      );
      return parsedLocations;
    } catch (error) {
      console.error('Failed to parse NEXT_PUBLIC_LOCATION_CODES_JSON:', error);
    }
  }
};
