import type { AlmaItemHoldingBibData } from '@/types/AlmaItem';
const BibEntryComponent = ({
  entry,
}: // projectId,
{
  entry: AlmaItemHoldingBibData;
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

  const getEntryValue = (
    entry: AlmaItemHoldingBibData,
    field: keyof AlmaItemHoldingBibData
  ) => {
    return entry[field];
  };
  const returnValue = (
    <div className="bib-entry">
      {fields.map((field: string) => {
        if (Object.getOwnPropertyNames(entry).includes(field)) {
          return (
            <p key={field}>
              <span className="bib-entry-label">
                {field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/_/g, ' ')}
              </span>
              : {getEntryValue(entry, field as keyof AlmaItemHoldingBibData)}
            </p>
          );
        }
      })}
    </div>
  );
  return returnValue;
};

export default BibEntryComponent;
