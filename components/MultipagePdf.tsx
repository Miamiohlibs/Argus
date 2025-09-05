// app/pdf/MultipagePdf.tsx
import { Document, StyleSheet } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { RequestSlipPage } from './RequestSlipPage';

// This component is called by: app/api/slipsPdf/[...slub]/route.tsx
// That is where the data comes from
// This component repeatedly calls RequestSlipPage to print each page

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
  paragraph: {
    margin: '5px',
    fontWeight: 'bold',
  },
});

export const MultiPagePdf = ({ books }: { books: RequestSlipProps[] }) => {
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
