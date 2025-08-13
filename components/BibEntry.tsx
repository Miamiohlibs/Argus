import type { BibEntry } from '@prisma/client';

const BibEntry = ({
  entry,
}: // projectId,
{
  entry: BibEntry;
  // projectId: string | number;
}) => {
  const fields = [
    'author',
    'title',
    'date_of_publication',
    'publisher_const',
    'place_of_publication',
    'isbn',
    'mms_id',
  ];

  const getEntryValue = (entry: BibEntry, field: keyof BibEntry) => {
    return entry[field];
  };

  const returnValue = (
    <div className="bib-entry">
      {fields.map((field) => {
        if (field in entry && getEntryValue(entry, field as keyof BibEntry)) {
          return (
            <p key={field}>
              <span className="bib-entry-label">
                {field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/_/g, ' ')}
              </span>
              : {getEntryValue(entry, field as keyof BibEntry) || 'N/A'}
            </p>
          );
        }
      })}
    </div>
  );
  return returnValue;
};

export default BibEntry;
