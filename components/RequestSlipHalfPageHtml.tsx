// app/pdf/RequestSlipPage.tsx
// called by ./MultipagePdf with one bib's data
import logger from '@/lib/logger';
import type { RequestSlipProps } from '@/types/RequestSlipProps';
import { getProjectPurposes } from '@/lib/utils';

const projectPurposes = getProjectPurposes();
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
}: RequestSlipProps) => {
  logger.verbose('Item Info', itemInfo);
  logger.verbose(`Added fields: ${userStatus}`);
  const volumeLabel = // only show if items to show
    itemInfo && itemInfo.length > 1 ? (
      <>
        <br />
        <span>Volume(s):</span>
        <br />
      </>
    ) : (
      <></>
    );
  return (
    <article>
      <h1>Miami University Libraries</h1>
      <p className="subhead">Special Collections & Archives Request Slip</p>
      <h2>I. ITEM REQUESTED</h2>
      <div className="row">
        <div className="column">
          <div>
            <span className="label">Author:</span>{' '}
            <span className="value">Baer, Elizabeth H</span>
          </div>
          <div>
            <span className="label">Brief Title:</span>{' '}
            <span className="value">
              The history of the Miami University Libraries /
            </span>
          </div>
          <div>
            <span className="label">Date of item:</span>{' '}
            <span className="value">1997</span>
          </div>
        </div>

        <div className="column">
          <h3>Call Number</h3>
          <div>Archives (arcli), Stacks (kngli)</div>
          <div>Z733.M52 B347 1997</div>
          <br />
          <div>Volume:</div>
          <div>
            <b>Archives (arcli) (slip 1/5 for this bib record)</b>
          </div>
        </div>
      </div>

      <h2>II. RESEARCHER INFORMATION</h2>
      <div className="row researcher">
        <div className="inner-column">
          <div>
            <span className="label">Name:</span>
            <span className="value">Ken Irwin</span>
          </div>
        </div>
        <div className="inner-column">
          <div>
            <span className="label">Email:</span>
            <span className="value">irwinkr@miamioh.edu</span>
          </div>
        </div>
        <div className="inner-column">
          <div>
            <span className="label">Printed:</span>
            <span className="value">2/17/2026</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <h3>Institution</h3>
          <div className="list-group">
            <div role="checkbox" aria-checked="true">
              Miami University
            </div>
            <div role="checkbox" aria-checked="false">
              Other
            </div>
          </div>
        </div>
        <div className="column-2">
          <h3>Status</h3>
          <div className="row">
            <div className="inner-column">
              <div className="list-group">
                <div role="checkbox" aria-checked="false">
                  Undergraduate
                </div>
                <div role="checkbox" aria-checked="false">
                  Graduate
                </div>
                <div role="checkbox" aria-checked="false">
                  Faculty
                </div>
              </div>
            </div>
            <div className="inner-column">
              <div className="list-group">
                <div role="checkbox" aria-checked="false">
                  Alumni
                </div>
                <div role="checkbox" aria-checked="true">
                  Staff
                </div>
                <div role="checkbox" aria-checked="false">
                  Other
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>For Internal Use Only</h2>
      <div className="row">
        <div className="column">
          <div className="list-group">
            <div role="checkbox" aria-checked="false">
              Class
            </div>
            <div role="checkbox" aria-checked="false">
              Conservation
            </div>
            <div role="checkbox" aria-checked="true">
              Digitization
            </div>
            <div role="checkbox" aria-checked="false">
              Event
            </div>
            <div role="checkbox" aria-checked="false">
              Exhibit
            </div>
            <div role="checkbox" aria-checked="false">
              Reference
            </div>
            <div role="checkbox" aria-checked="false">
              Other
            </div>
          </div>
        </div>
        <div className="column">
          <div className="list-group">
            <div>
              <span className="label">Slip pulled by:</span>{' '}
              <span className="value"></span>
            </div>
            <div>
              <span className="label">Pulled by:</span>{' '}
              <span className="value"></span>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="list-group">
            <div>
              <span className="label">Reshelved by:</span>{' '}
              <span className="value"></span>
            </div>
            <div>
              <span className="label">Reshelved on date:</span>{' '}
              <span className="value"></span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
