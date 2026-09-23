/* 
  The page components returned by this file override the default
  layouts for the printable request slips defined in:
  - components/request/BibSection-default
  - components/request/BibSection-aspace

  This file is customizable when you fork the Argus repo for local use.
  Changes you make to this file will not be overwritten by future software
  updates. 
  
  To get started, you may wish to copy and paste the default code used in the
  files referenced above and make any edits you desire to those starting 
  layouts.
*/

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
