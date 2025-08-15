// types/@kenxirwin__alma-search/index.d.ts
declare module '@kenxirwin/alma-search' {
  export class SearchBibs {
    constructor(config: { baseUrl: string; apiKey: string });
    barcodeLookup(barcode: string): Promise<any>;
    idLookup({ mms_id }: { mms_id: string }): Promise<any>;
    holdingsByMmsId(mms_id: string): Promise<any>;
    holdingsItemsByMmsId(mms_id: string, options: object): Promise<any>;
    followLink(link: string): Promise<any>;
  }
}
