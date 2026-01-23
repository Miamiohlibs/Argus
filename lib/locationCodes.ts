import logger from '@/lib/logger';

export type LocationCode = {
  code: string;
  name: string;
  unofficial?: boolean;
};

export const inHouseLocationData = () => {
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

export const inHouseLocationCodes = (): string[] => {
  if (typeof process.env.NEXT_PUBLIC_LOCATION_CODES_JSON === 'string') {
    try {
      const parsedLocations: LocationCode[] = JSON.parse(
        process.env.NEXT_PUBLIC_LOCATION_CODES_JSON
      );
      if (Array.isArray(parsedLocations)) {
        return parsedLocations.map((item) => item.code);
      }
      return [];
    } catch (error) {
      logger.error('Failed to parse NEXT_PUBLIC_LOCATION_CODES_JSON:', error);
      return [];
    }
  }
  return [];
};

export const getLocationNameFromCode = (code: string) => {
  const locations = inHouseLocationData();
  if (typeof locations == 'undefined') {
    return '';
  }
  const location = locations.find((item) => item.code == code);
  return location?.name || '';
};
