// app/pdf/RequestSlip.tsx
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { RequestSlipPage } from './RequestSlipPage';
// const styles = StyleSheet.create({
//   page: { padding: 10, fontSize: 10 },
//   section: { border: '1pt solid black', marginBottom: 5 },
//   header: {
//     textAlign: 'center',
//     fontSize: 12,
//     marginBottom: 5,
//     fontWeight: 'bold',
//   },
//   row: { flexDirection: 'row', borderBottom: '1pt solid black' },
//   cell: { flex: 1, padding: 4, borderRight: '1pt solid black' },
//   cellLast: { flex: 1, padding: 4 },
//   label: { fontWeight: 'bold' },
//   checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
//   checkbox: { width: 8, height: 8, border: '1pt solid black', marginRight: 4 },
//   checkedBox: { width: 8, height: 8, backgroundColor: 'black', marginRight: 4 },
// });

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Times-Roman',
  },
  header: {
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionHeader: {
    textAlign: 'left',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 6,
    border: '1pt solid black',
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1pt solid black',
  },
  col: {
    flex: 1,
    padding: 4,
    borderRight: '1pt solid black',
  },
  colNoRightBorder: {
    flex: 1,
    padding: 4,
    borderRight: 0,
  },
  lastCol: {
    flex: 1,
    padding: 4,
  },
  blankLine: {
    height: 12,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  centerText: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1pt solid black',
    marginRight: 4,
  },
  checkedBox: { width: 8, height: 8, backgroundColor: 'black', marginRight: 4 },
  // mt: {
  //   marginTop: '5px',
  // },
  // mb: {
  //   marginBottom: '5px',
  // },
  // ml: {
  //   marginLeft: '5px',
  // },
  // mr: {
  //   marginRight: '5px',
  // },
  paragraph: {
    margin: '5px',
    fontWeight: 'bold',
  },
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
