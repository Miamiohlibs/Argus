import { RequestSlipProps } from '@/types/RequestSlipProps';
import { RequestSlipHalfPage } from './RequestSlipHalfPageHtml';
import styles from './MultiPageHtml.module.css';
// This component is called by: app/(printable-layout)/slipsRender/[slug]/page.tsx

// That is where the data comes from
// This component repeatedly calls RequestSlipHalfPage to print each page

export const MultiPageHtml = ({ books }: { books: RequestSlipProps[] }) => {
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

  if (!pairsArr[0] || !pairsArr[0][0]) {
    return <div className="m-5">No entries to print.</div>;
  }
  pairsArr[0][0].displayPrintButton = true; // display print at top of first page

  return (
    <>
      {/*} document-level wrapper */}
      {pairsArr.map((pair, i) => {
        return (
          <div
            className={`${styles.sheetOuter} ${styles.sheetOuterLetter} ${styles.sheetOuterLetterSheet}`}
            key={i}
          >
            <section className={`${styles.sheetPadding5mm} ${styles.sheet}`}>
              <RequestSlipHalfPage {...pair[0]} />
              {pair[1] && <RequestSlipHalfPage {...pair[1]} />}
            </section>
          </div>
        );
      })}
    </>
  );
};
