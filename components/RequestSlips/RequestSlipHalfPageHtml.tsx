// components/RequestSlipHalfPageHtml.tsx
// called by ./MultiPageHtml with one bib's data
'use client';
import type { RequestSlipProps } from '@/types/RequestSlipProps';
import Button from '@/components/ui/Button';
import styles from './RequestSlipHalfPageHtml.module.css';
import { Roboto } from 'next/font/google';
import { bibSectionAspace } from './BibSection-aspace';
import { bibSectionDefault } from './BibSection-default';
import { bibSectionOverrides } from './BibSectionOverrides';
import { getUserAffiliations, getUserStatuses } from '@/lib/utils';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export function shortenString(str: string, maxChars: number = 100) {
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

export const bibSection = (props: RequestSlipProps) => {
  const { catalog } = props;
  if (catalog == 'ASPACE') {
    // if (bibSectionOverrides.aspace(props)) {
    // return bibSectionOverrides.aspace(props);
    // }
    return bibSectionAspace(props);
  } else {
    return bibSectionDefault(props);
  }
};

export const RequestSlipHalfPage = (props: RequestSlipProps) => {
  const {
    author,
    title,
    date,
    location,
    callNumber,
    catalog,
    itemInfo,
    highlightedItemIndex,
    notes,
    box,
    folder,
    ms,
    patronName,
    patronAffiliation,
    patronStatus,
    userName,
    userEmail,
    userAffiliation,
    userStatus,
    personPrinting,
    projectName,
    purpose,
    displayPrintButton,
  } = props;
  // console.log('Item Info', itemInfo);
  // console.log(`Added fields: ${userStatus}`);

  const bibSectionHtml = bibSection(props);

  // patron status/affiliation overrides user status/affiliation
  const status = patronStatus ?? userStatus;
  const affiliation = patronAffiliation ?? userAffiliation;
  const allStatuses = getUserStatuses();
  const half = Math.ceil(allStatuses.length / 2);
  const firstHalfStatuses = allStatuses.slice(0, half);
  const secondHalfStatuses = allStatuses.slice(half);

  return (
    <article
      className={`${styles.sheetOuterLetterArticle} ${styles.sheetArticle}`}
    >
      {displayPrintButton && <PrintButton>Print</PrintButton>}
      <h1 className={styles.h1}>{process.env.NEXT_PUBLIC_SLIP_HEADER}</h1>
      <p className={styles.subhead}>{process.env.NEXT_PUBLIC_SLIP_SUBHEAD}</p>
      <h2 className={styles.h2}>I. ITEM REQUESTED</h2>
      {bibSectionHtml}

      <h2 className={styles.h2}>II. RESEARCHER INFORMATION</h2>
      <div className={`${styles.row} ${styles.researcher} `}>
        <div className={`${styles.innerColumn} ${styles.flex2}`}>
          <div>
            <span className={styles.label}>For:</span>{' '}
            <span className={styles.value}>
              {shortenString(projectName || '', 50)}
            </span>
          </div>
        </div>
        <div className={styles.innerColumn}>
          <div>
            <span className={styles.label}>Printed:</span>{' '}
            <span className={styles.value}>
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className={`${styles.innerColumn} ${styles.flex3}`}>
          <div>{/* this space intentionally left blank */}</div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.column}>
          <h3 className={styles.h3}>Institution</h3>
          <div className="flex flex-col">
            {getUserAffiliations().map((option) => (
              <div
                key={option}
                role="checkbox"
                aria-checked={affiliation == option}
                className={styles.listGroupDiv}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.column2}>
          <h3 className={styles.h3}>Status</h3>
          <div className={styles.row}>
            <div className={styles.innerColumn}>
              <div className={styles.listGroup}>
                {firstHalfStatuses.map((option: string) => (
                  <div
                    key={option}
                    role="checkbox"
                    aria-checked={status == option}
                    className={styles.listGroupDiv}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.innerColumn}>
              <div className={styles.listGroup}>
                {secondHalfStatuses.map((option: string) => (
                  <div
                    key={option}
                    role="checkbox"
                    aria-checked={status == option}
                    className={styles.listGroupDiv}
                  >
                    {option}
                  </div>
                ))}
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
              aria-checked={purpose == 'Class'}
              className={styles.listGroupDiv}
            >
              Class
            </div>
            <div
              role="checkbox"
              aria-checked={purpose == 'Conservation'}
              className={styles.listGroupDiv}
            >
              Conservation
            </div>
            <div
              role="checkbox"
              aria-checked={purpose == 'Digitization'}
              className={styles.listGroupDiv}
            >
              Digitization
            </div>
            <div
              role="checkbox"
              aria-checked={purpose == 'Event'}
              className={styles.listGroupDiv}
            >
              Event
            </div>
            <div
              role="checkbox"
              aria-checked={purpose == 'Exhibit'}
              className={styles.listGroupDiv}
            >
              Exhibit
            </div>
            <div
              role="checkbox"
              aria-checked={purpose == 'Reference'}
              className={styles.listGroupDiv}
            >
              Reference
            </div>
            <div
              role="checkbox"
              aria-checked={purpose == 'Other'}
              className={styles.listGroupDiv}
            >
              Other
            </div>
          </div>
        </div>
        <div className={styles.column}>
          <div className="flex flex-col">
            <div>
              <span className={styles.label}>Patron name:</span>{' '}
              <span className={styles.value}>{patronName}</span>
            </div>
            <div>
              <span className={styles.label}>Project owner:</span>{' '}
              <span className={styles.value}>{userName}</span>
            </div>
            <div>
              <span className={styles.label}>Slip pulled by:</span>{' '}
              <span className={styles.value}>{personPrinting}</span>
            </div>
            <div>
              <span className={styles.label}>Pulled by:</span>{' '}
              <span className={styles.value}></span>
            </div>
          </div>
        </div>
        <div className={styles.column}>
          <div className="flex flex-col">
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
