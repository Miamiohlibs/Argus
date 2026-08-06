import type { BibDataDraft } from '@/lib/catalogs/types';

const FIELDS: Array<keyof BibDataDraft> = [
  'author',
  'itemTitle',
  'location_display',
  'location_codes',
  'callNumber',
  'pub_date',
  'publisher',
  'catalogId',
  'catalogIdType',
  'url',
];

const BibEntryComponent = ({
  entry,
  extra,
}: {
  entry: BibDataDraft;
  extra?: Record<string, string | undefined>;
}) => {
  const formatLabel = (field: string) =>
    field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');

  return (
    <div className="bib-entry">
      {FIELDS.map((field) => {
        const value = entry[field];
        if (value === null || value === undefined || value === '') {
          return null;
        }
        return (
          <p key={field}>
            <span className="bib-entry-label">{formatLabel(field)}</span>:{' '}
            {String(value)}
          </p>
        );
      })}
      {extra &&
        Object.entries(extra).map(([field, value]) => {
          if (!value) return null;
          return (
            <p key={field}>
              <span className="bib-entry-label">{formatLabel(field)}</span>:{' '}
              {value}
            </p>
          );
        })}
    </div>
  );
};

export default BibEntryComponent;
