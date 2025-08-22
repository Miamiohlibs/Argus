// app/pdf/RequestSlip.tsx
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { RequestSlipPage } from './RequestSlipPage';
const styles = StyleSheet.create({
  page: { padding: 10, fontSize: 10 },
  section: { border: '1pt solid black', marginBottom: 5 },
  header: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  row: { flexDirection: 'row', borderBottom: '1pt solid black' },
  cell: { flex: 1, padding: 4, borderRight: '1pt solid black' },
  cellLast: { flex: 1, padding: 4 },
  label: { fontWeight: 'bold' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  checkbox: { width: 8, height: 8, border: '1pt solid black', marginRight: 4 },
  checkedBox: { width: 8, height: 8, backgroundColor: 'black', marginRight: 4 },
});

export const MultiPagePdf = ({ books }: { books: RequestSlipProps[] }) => {
  console.log(`books: `, JSON.stringify(books));
  console.log('isArray:', Array.isArray(books));
  return (
    <Document>
      {books &&
        books.map((book, i) => {
          return (
            <RequestSlipPage key={`book-${i}`} {...book} styles={styles} />
          );
        })}
    </Document>
  );
};
