export interface PrimoSearchResponse {
  info: {
    totalResultsLocal: number;
    totalResultsPC: number;
    total: number;
    first: number;
    last: number;
  };
  highlights: {
    termsUnion: string[];
  };
  docs: Doc[];
  timelog: Record<string, string | number>;
  facets: Facet[]; // sometimes [], sometimes array of objects
}

export interface Facet {
  name: string;
  values: {
    value: string;
    count: string;
  }[];
}

export interface Doc {
  context: string;
  adaptor: string;
  '@id': string;
  pnx: Pnx;
  delivery?: Delivery; // only in local record (#2), optional
  extras?: Extras; // only in central record (#1), optional
  enrichment?: Enrichment; // only in local record (#2), optional
}

export interface Pnx {
  search?: Record<string, string[]>; // central record
  display?: Record<string, string[]>; // both, but contents differ
  delivery?: Record<string, string[]>; // central record (#1)
  links?: Record<string, string[]>; // central record (#1)
  addata?: Record<string, string[]>; // both
  facets?: Record<string, string[]>; // both
  sort?: Record<string, string[]>; // both
  control?: Record<string, any>; // both, but shape differs
}

export interface Delivery {
  fulltext?: string[]; // central record (#1)
  delcategory?: string[]; // central record (#1)

  // local record (#2) has a rich structure
  bestlocation?: Holding;
  holding?: Holding[];
  electronicServices?: any;
  additionalElectronicServices?: any;
  filteredByGroupServices?: any;
  quickAccessService?: any;
  deliveryCategory?: string[];
  serviceMode?: string[];
  availability?: string[];
  availabilityLinks?: string[];
  availabilityLinksUrl?: string[];
  displayedAvailability?: any;
  displayLocation?: boolean;
  additionalLocations?: boolean;
  physicalItemTextCodes?: any;
  feDisplayOtherLocations?: boolean;
  almaInstitutionsList?: any[];
  recordInstitutionCode?: string | null;
  recordOwner?: string;
  hasFilteredServices?: any;
  digitalAuxiliaryMode?: boolean;
  digitalAuxiliaryThumbnail?: boolean;
  hideResourceSharing?: boolean;
  sharedDigitalCandidates?: any;
  consolidatedCoverage?: any;
  electronicContextObjectId?: any;
  almaOpenurl?: any;
  GetIt1?: {
    category: string;
    links: {
      isLinktoOnline: boolean;
      getItTabText: string;
      adaptorid: string;
      ilsApiId: string;
      link: string;
      inst4opac: string;
      displayText: string | null;
      '@id': string;
    }[];
  }[];
  physicalServiceId?: any;
  link?: {
    '@id': string;
    linkType: string;
    linkURL: string;
    displayLabel: string;
  }[];
  hasD?: any;
}

export interface Holding {
  isValidUser: boolean;
  organization: string;
  libraryCode: string;
  availabilityStatus: string;
  subLocation: string;
  subLocationCode: string;
  mainLocation: string;
  callNumber: string;
  callNumberType: string;
  holdingURL: string;
  adaptorid: string;
  ilsApiId: string;
  holdId: string;
  holKey: string;
  matchForHoldings: {
    matchOn: string;
    holdingRecord: string;
  }[];
  stackMapUrl: string;
  relatedTitle: string | null;
  translateRelatedTitle: string | null;
  yearFilter: string | null;
  volumeFilter: string | null;
  singleUnavailableItemProcessType: string | null;
  boundWith: boolean;
  '@id': string;
}

export interface Extras {
  citationTrails: {
    citing: any[];
    citedby: any[];
  };
  timesCited: Record<string, unknown>;
}

export interface Enrichment {
  virtualBrowseObject: {
    isVirtualBrowseEnabled: boolean;
    callNumber: string;
    callNumberBrowseField: string;
  };
  bibVirtualBrowseObject: {
    isVirtualBrowseEnabled: boolean;
    callNumber: string;
    callNumberBrowseField: string;
  };
}
