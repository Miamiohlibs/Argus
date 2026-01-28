// app/pdf/RequestSlipPage.tsx
// called by ./MultipagePdf with one bib's data
import logger from '@/lib/logger';
import { Text, View } from '@react-pdf/renderer';
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
  styles,
  personPrinting,
  projectName,
  purpose,
}: RequestSlipProps & { styles: any }) => {
  logger.verbose('Item Info', itemInfo);
  logger.verbose(`Added fields: ${userStatus}`);
  const volumeLabel = // only show if items to show
    itemInfo && itemInfo.length > 1 ? (
      <>
        <Text style={styles.blankLine} />
        <Text>Volume(s):</Text>
        <Text style={styles.blankLine} />
      </>
    ) : (
      <Text></Text>
    );
  return (
    <View style={styles.halfpage}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Miami University Libraries</Text>
        <Text>Special Collections & Archives Request Slip</Text>
      </View>

      <Text style={styles.label}>
        I. ITEM REQUESTED (please fill out completely)
      </Text>
      {/* Section I */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text>
              Author: <Text style={styles.bold}>{author}</Text>
            </Text>
            <Text>
              Brief Title: <Text style={styles.bold}>{title}</Text>
            </Text>
            <Text>
              Date of item: <Text style={styles.bold}>{date}</Text>
            </Text>

            {notes && (
              <>
                <Text>Other information</Text>
                <Text style={styles.paragraph}>{notes}</Text>
              </>
            )}
          </View>

          <View style={styles.lastCol}>
            <Text style={styles.label}>CALL NUMBER</Text>
            <Text style={styles.centerText}>{location}</Text>
            <Text style={styles.centerText}>{callNumber ?? ''}</Text>
            {ms && (
              <Text>
                Manuscript #<Text style={styles.bold}>{ms}</Text>
              </Text>
            )}
            {(box || folder) && (
              <Text>
                Box {<Text style={styles.bold}>{box}</Text>}
                {'      '}Folder {<Text style={styles.bold}>{folder}</Text>}
              </Text>
            )}
            {volumeLabel}
            {itemInfo?.map((item, i) => {
              const styleTag = i == highlightedItemIndex ? styles.bold : {};
              const counter =
                i == highlightedItemIndex && itemInfo.length > 1
                  ? ` (slip ${i + 1}/${itemInfo.length} for this bib record)`
                  : '';
              item += counter;
              return (
                <Text key={`item-${i}`} style={styleTag}>
                  {item}
                </Text>
              );
            })}
          </View>
        </View>
      </View>

      {/* Section II */}
      <View style={styles.section}>
        <Text style={styles.label}>II. RESEARCHER INFORMATION</Text>
        <View style={styles.header}>
          <Text>
            Name:
            <Text style={styles.bold}>
              {userName} ({userEmail})
            </Text>
            {'      '}
            Printed:{' '}
            <Text style={styles.bold}>{new Date().toLocaleDateString()}</Text>
            {'      '}
            For:<Text style={styles.bold}> {projectName}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.sectionHeader}>AFFILIATION</Text>
            <Text style={styles.paragraph}>Please check all that apply</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionHeader}>Institution</Text>
            <View style={styles.checkboxRow}>
              <View
                style={
                  userAffiliation == 'Miami'
                    ? styles.checkedBox
                    : styles.checkbox
                }
              />
              <Text>Miami University</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View
                style={
                  userAffiliation == 'Other'
                    ? styles.checkedBox
                    : styles.checkbox
                }
              />
              <Text>Other</Text>
            </View>
          </View>
          <View style={styles.colNoRightBorder}>
            <Text style={styles.sectionHeader}>Status</Text>
            <View style={styles.checkboxRow}>
              <View
                style={
                  userStatus == 'Undergrad'
                    ? styles.checkedBox
                    : styles.checkbox
                }
              />
              <Text>Undergraduate</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View
                style={
                  userStatus == 'Graduate' ? styles.checkedBox : styles.checkbox
                }
              />
              <Text>Graduate</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View
                style={
                  userStatus == 'Faculty' ? styles.checkedBox : styles.checkbox
                }
              />
              <Text>Faculty</Text>
            </View>
          </View>

          <View style={styles.lastCol}>
            <View style={styles.blankLine}>{/* Blank on purpose*/}</View>
            <View style={styles.checkboxRow}>
              <View
                style={
                  userStatus == 'Alumni' ? styles.checkedBox : styles.checkbox
                }
              />
              <Text>Alumni</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View
                style={
                  userStatus == 'Staff' ? styles.checkedBox : styles.checkbox
                }
              />
              <Text>Staff</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View
                style={
                  userStatus == 'Other' ? styles.checkedBox : styles.checkbox
                }
              />
              <Text>Other</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Section III (Internal Use) */}
      <View style={styles.section}>
        <Text style={{ textAlign: 'center' }}>
          ————————— For Internal Use Only —————————
        </Text>
        <View style={styles.row}>
          <View style={styles.col}>
            {projectPurposes.map((item) => {
              return (
                <View style={styles.checkboxRow} key={item}>
                  <View
                    style={
                      item == purpose ? styles.checkedBox : styles.checkbox
                    }
                  />
                  <Text>{item}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.col}>
            <Text>Slip printed by: {personPrinting}</Text>
            <Text>Pulled by:</Text>
          </View>
          <View style={styles.lastCol}>
            <Text>Reshelved by:</Text>
            <Text>Reshelved on date:</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
