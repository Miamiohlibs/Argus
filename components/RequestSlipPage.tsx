// app/pdf/RequestSlipPage.tsx
// called by ./MultipagePdf with one bib's data
import logger from '@/lib/logger';
import { Page, Text, View } from '@react-pdf/renderer';
import type { RequestSlipProps } from '@/types/RequestSlipProps';

export const RequestSlipPage = ({
  author,
  title,
  date,
  location,
  callNumber,
  itemInfo,
  notes,
  userName,
  userEmail,
  userAffiliation,
  userStatus,
  styles,
}: RequestSlipProps & { styles: any }) => {
  logger.verbose('Item Info', itemInfo);
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
    <Page size="LETTER" style={styles.page}>
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
            <Text style={styles.label}>TYPE OF MATERIAL</Text>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Vault</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Rare</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>German</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Russian</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Miami Archives</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Thesis/Dissertation</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Manuscript</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Western College</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Oxford College</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Reference College</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Archives VF</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Map</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Honors Paper</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Photograph: </Text>
              <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text>Print </Text>
              </View>
              <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text>Negative</Text>
              </View>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Media</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Other</Text>
            </View>
            {/* Add more as needed */}
            <View style={styles.label}>
              <Text>SIZE (if applicable)</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Small</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Folio</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text>Double Oversize</Text>
            </View>
          </View>

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
            <Text>Manuscript #</Text>
            <Text>Box ________ Folder ________</Text>
            <Text>Other information</Text>
            <Text style={styles.paragraph}>{notes}</Text>
          </View>

          <View style={styles.lastCol}>
            <Text style={styles.label}>CALL NUMBER</Text>
            <Text style={styles.centerText}>{location}</Text>
            <Text style={styles.centerText}>{callNumber ?? ''}</Text>
            {volumeLabel}
            {itemInfo?.map((item, i) => {
              return <Text key={`item-${i}`}>{item}</Text>;
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
            <Text>[ ] Conservation</Text>
            <Text>[ ] Cataloguing</Text>
            <Text>[ ] Exhibit</Text>
            <Text>[ ] Digitization</Text>
            <Text>[ ] Hold Shelf/Cart</Text>
            <Text>[ ] Reading Room</Text>
            <Text>[ ] Class</Text>
            <Text>[ ] Other</Text>
          </View>
          <View style={styles.col}>
            <Text>Pulled by:</Text>
            <Text>Location:</Text>
          </View>
          <View style={styles.lastCol}>
            <Text>Reshelved by:</Text>
            <Text>Reshelved on date:</Text>
          </View>
        </View>
      </View>
    </Page>
  );
};
