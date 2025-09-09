// app/pdf/MultipagePdf.tsx
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { RequestSlipHalfPage } from './RequestSlipHalfPage';

// This component is called by: app/api/slipsPdf/[...slub]/route.tsx
// That is where the data comes from
// This component repeatedly calls RequestSlipHalfPage to print each page

const styles = StyleSheet.create({
  halfpage: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Times-Roman',
    height: '50%',
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
  // get pairs of books to pass to <RequestSlipPage />
  const pairsArr = books
    .map((element, index, array) => {
      if (index % 2 == 0) {
        if (array[index + 1] !== undefined) {
          return [element, array[index + 1]];
        } else {
          return [element];
        }
      } else {
        return null;
      }
    })
    .filter((entry) => Array.isArray(entry));

  return (
    <Document>
      {/* {books &&
        books.map((book, i) => {
          return (
            <RequestSlipHalfPage key={`book-${i}`} {...book} styles={styles} />
          );
        })} */}
      {pairsArr.map((pair, i) => {
        return (
          <Page>
            <RequestSlipHalfPage {...pair[0]} styles={styles} />
            {pair[1] && <RequestSlipHalfPage {...pair[1]} styles={styles} />}
          </Page>
        );
      })}
    </Document>
  );
};
