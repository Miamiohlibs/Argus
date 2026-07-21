import { RequestSlipProps } from '@/types/RequestSlipProps';
import styles from './RequestSlipHalfPageHtml.module.css';
import { shortenString } from './RequestSlipHalfPageHtml';

export const bibSectionAspace = (props: RequestSlipProps) => {
  const {
    author,
    title,
    date,
    location,
    callNumber,
    // catalog,
    itemInfo,
    highlightedItemIndex,
    notes,
    box,
    folder,
    ms,
  } = props;

  return (
    <div className={styles.row}>
      <div className={styles.column}>
        {/* <div className={styles.dataPair}>
          <span className={styles.label}>Author:</span>{' '}
          <span className={styles.value}>
            {author && shortenString(author, 150)}
          </span>
        </div> */}
        <div className={styles.dataPair}>
          <span className={styles.label}>Brief Title:</span>{' '}
          <span className={styles.value}>
            {/* {title && shortenString(title)} */}
            {title}
          </span>
        </div>
        {/* <div>
            <span className={styles.label}>Date of item:</span>{' '}
            <span className={styles.value}>{date}</span>
          </div> */}
        {notes && (
          <>
            <h3 className={styles.h3}>Other Information</h3>
            <div className={styles.text}>{notes}</div>
          </>
        )}
      </div>

      <div className={styles.column}>
        <h3 className={styles.h3}>Whereabouts</h3>
        {/* <div className={styles.text}>{location}</div>
         */}
        {callNumber &&
          callNumber != undefined &&
          callNumber != 'undefined' &&
          callNumber.length > 0 && (
            <div className={styles.text}>{callNumber ?? ''}</div>
          )}
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
  );
};
