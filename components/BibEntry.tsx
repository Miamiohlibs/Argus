type BibEntryProps = {
  mms_id: string;
  author?: string;
  title?: string;
  date_of_publication?: string;
  publisher_const?: string;
  place_of_publication?: string;
  isbn?: string;
  // and other fields are ok too
  [key: string]: any; // Allow additional fields
  // This allows the component to accept any additional properties that may be passed to it
};

const BibEntry = ({
  entry,
  projectId,
}: {
  entry: BibEntryProps;
  projectId: string | number;
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
  let returnValue = (
    <div className="bib-entry">
      {fields.map((field) => {
        if (field in entry && entry[field]) {
          return (
            <p key={field}>
              <span className="bib-entry-label">
                {field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/_/g, ' ')}
              </span>
              : {entry[field] || 'N/A'}
            </p>
          );
        }
      })}
    </div>
  );
  return returnValue;
};

export default BibEntry;
