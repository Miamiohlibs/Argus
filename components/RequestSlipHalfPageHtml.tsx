// app/pdf/RequestSlipPage.tsx
// called by ./MultipageHtml with one bib's data
'use client';
import type { RequestSlipProps } from '@/types/RequestSlipProps';
import { Button } from 'react-bootstrap';
import styles from './RequestSlipHalfPageHtml.module.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

function shortenString(str: string, maxChars: number = 100) {
  let newStr = str.substring(0, maxChars - 3);
  if (newStr !== str) {
    newStr += '...';
  }
  return newStr;
}

const PrintButton: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const handlePrint = () => {
    window.print(); // Triggers the browser's print dialog for the frame
  };

  return (
    <>
      <Button
        size="sm"
        onClick={handlePrint}
        className={`${styles.printButton} ${roboto.className}`}
      >
        {children ?? 'Print this document'}
      </Button>
    </>
  );
};

export const RequestSlipHalfPage = ({
  author,
  title,
  date,
  location,
  callNumber,
  itemInfo,
  highlightedItemIndex,
  notes,
  box,
  folder,
  ms,
  userName,
  userEmail,
  userAffiliation,
  userStatus,
  personPrinting,
  projectName,
  purpose,
  displayPrintButton,
}: RequestSlipProps) => {
  // console.log('Item Info', itemInfo);
  // console.log(`Added fields: ${userStatus}`);
  const volumeLabel = // only show if items to show
    itemInfo && itemInfo.length > 1 ? (
      <div className={styles.bold}>Volume(s):</div>
    ) : (
      <></>
    );
  return (
    <article
      className={`${styles.sheetOuterLetterArticle} ${styles.sheetArticle}`}
    >
      {displayPrintButton && <PrintButton>Print</PrintButton>}
      <h1 className={styles.h1}>Miami University Libraries</h1>
      <p className={styles.subhead}>
        Special Collections & Archives Request Slip
      </p>
      <h2 className={styles.h2}>I. ITEM REQUESTED</h2>
      <div className={styles.row}>
        <div className={styles.column}>
          <div>
            <span className={styles.label}>Author:</span>{' '}
            <span className={styles.value}>
              {author && shortenString(author)}
            </span>
          </div>
          <div>
            <span className={styles.label}>Brief Title:</span>{' '}
            <span className={styles.value}>
              {title && shortenString(title)}
            </span>
          </div>
          <div>
            <span className={styles.label}>Date of item:</span>{' '}
            <span className={styles.value}>{date}</span>
          </div>
          {notes && (
            <>
              <h3 className={styles.h3}>Other Information</h3>
              <div className={styles.text}>{notes}</div>
            </>
          )}
        </div>

        <div className={styles.column}>
          <h3 className={styles.h3}>Call Number</h3>
          <div className={styles.text}>{location}</div>
          <div className={styles.text}>{callNumber ?? ''}</div>
          {ms && (
            <div>
              <span className={styles.label}>Manuscript #</span>{' '}
              <span className={styles.value}>{ms}</span>
            </div>
          )}
          {box && (
            <div>
              <span className={styles.label}>Box</span>{' '}
              <span className={styles.value}>{box}</span>
            </div>
          )}
          {folder && (
            <div>
              <span className={styles.label}>Folder</span>{' '}
              <span className={styles.value}>{folder}</span>
            </div>
          )}
          <br />
          {volumeLabel}
          {itemInfo?.map((item, i) => {
            const counter =
              i == highlightedItemIndex && itemInfo.length > 1
                ? ` (slip ${i + 1}/${itemInfo.length} for this bib record)`
                : '';
            item += counter;
            if (i == highlightedItemIndex)
              return (
                <div key={i} className={styles.text}>
                  {item}
                </div>
              );
          })}
        </div>
      </div>

      <h2 className={styles.h2}>II. RESEARCHER INFORMATION</h2>
      <div className={`${styles.row} ${styles.researcher} `}>
        <div className={styles.innerColumn}>
          <div>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>{userName}</span>
          </div>
        </div>
        <div className={styles.innerColumn}>
          <div>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{userEmail}</span>
          </div>
        </div>
        <div className={styles.innerColumn}>
          <div>
            <span className={styles.label}>Printed:</span>
            <span className={styles.value}>
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.column}>
          <h3 className={styles.h3}>Institution</h3>
          <div className="list-group">
            <div
              role="checkbox"
              aria-checked="true"
              className={styles.listGroupDiv}
            >
              Miami University
            </div>
            <div
              role="checkbox"
              aria-checked="false"
              className={styles.listGroupDiv}
            >
              Other
            </div>
          </div>
        </div>
        <div className={styles.column2}>
          <h3 className={styles.h3}>Status</h3>
          <div className={styles.row}>
            <div className={styles.innerColumn}>
              <div className={styles.listGroup}>
                <div
                  role="checkbox"
                  aria-checked="false"
                  className={styles.listGroupDiv}
                >
                  Undergraduate
                </div>
                <div
                  role="checkbox"
                  aria-checked="false"
                  className={styles.listGroupDiv}
                >
                  Graduate
                </div>
                <div
                  role="checkbox"
                  aria-checked="false"
                  className={styles.listGroupDiv}
                >
                  Faculty
                </div>
              </div>
            </div>
            <div className={styles.innerColumn}>
              <div className={styles.listGroup}>
                <div
                  role="checkbox"
                  aria-checked="false"
                  className={styles.listGroupDiv}
                >
                  Alumni
                </div>
                <div
                  role="checkbox"
                  aria-checked="true"
                  className={styles.listGroupDiv}
                >
                  Staff
                </div>
                <div
                  role="checkbox"
                  aria-checked="false"
                  className={styles.listGroupDiv}
                >
                  Other
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className={styles.h2}>For Internal Use Only</h2>
      <div className={styles.row}>
        <div className={styles.column}>
          <div className={styles.listGroup}>
            <div
              role="checkbox"
              aria-checked="false"
              className={styles.listGroupDiv}
            >
              Class
            </div>
            <div
              role="checkbox"
              aria-checked="false"
              className={styles.listGroupDiv}
            >
              Conservation
            </div>
            <div
              role="checkbox"
              aria-checked="true"
              className={styles.listGroupDiv}
            >
              Digitization
            </div>
            <div
              role="checkbox"
              aria-checked="false"
              className={styles.listGroupDiv}
            >
              Event
            </div>
            <div
              role="checkbox"
              aria-checked="false"
              className={styles.listGroupDiv}
            >
              Exhibit
            </div>
            <div
              role="checkbox"
              aria-checked="false"
              className={styles.listGroupDiv}
            >
              Reference
            </div>
            <div
              role="checkbox"
              aria-checked="false"
              className={styles.listGroupDiv}
            >
              Other
            </div>
          </div>
        </div>
        <div className={styles.column}>
          <div className="list-group">
            <div>
              <span className={styles.label}>Slip pulled by:</span>{' '}
              <span className={styles.value}></span>
            </div>
            <div>
              <span className={styles.label}>Pulled by:</span>{' '}
              <span className={styles.value}></span>
            </div>
          </div>
        </div>
        <div className={styles.column}>
          <div className="list-group">
            <div>
              <span className={styles.label}>Reshelved by:</span>{' '}
              <span className={styles.value}></span>
            </div>
            <div>
              <span className={styles.label}>Reshelved on date:</span>{' '}
              <span className={styles.value}></span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
