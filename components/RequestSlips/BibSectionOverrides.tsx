import { RequestSlipProps } from '@/types/RequestSlipProps';
import styles from './RequestSlipHalfPageHtml.module.css';
import { shortenString } from './RequestSlipHalfPageHtml';

export const bibSectionOverrides = {
  aspace: (props: RequestSlipProps): React.JSX.Element | null => {
    // return <>Custom Aspace BibSection</>
    return null;
  },
  default: (props: RequestSlipProps): React.JSX.Element | null => {
    // return <>Custom Default BibSection</>
    return null;
  },
};
