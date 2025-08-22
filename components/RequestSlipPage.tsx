// app/pdf/RequestSlip.tsx
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: { padding: 10, fontSize: 10 },
//   section: { border: '1pt solid black', marginBottom: 5 },
//   header: {
//     textAlign: 'center',
//     fontSize: 12,
//     marginBottom: 5,
//     fontWeight: 'bold',
//   },
//   row: { flexDirection: 'row', borderBottom: '1pt solid black' },
//   cell: { flex: 1, padding: 4, borderRight: '1pt solid black' },
//   cellLast: { flex: 1, padding: 4 },
//   label: { fontWeight: 'bold' },
//   checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
//   checkbox: { width: 8, height: 8, border: '1pt solid black', marginRight: 4 },
//   checkedBox: { width: 8, height: 8, backgroundColor: 'black', marginRight: 4 },
// });

type RequestSlipProps = {
  author?: string;
  title?: string;
  callNumber?: string;
  affiliation?: 'Miami' | 'Other';
  status?: 'Undergrad' | 'Graduate' | 'Faculty' | 'Staff' | 'Alumni' | 'Other';
};

export const RequestSlipPage = ({
  author,
  title,
  callNumber,
  affiliation,
  status,
  styles,
}: RequestSlipProps & { styles: any }) => {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        Miami University Libraries {'\n'}
        Special Collections & Archives Request Slip
      </Text>

      {/* Section I: ITEM REQUESTED */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>I. ITEM REQUESTED</Text>
            <Text>(please fill out completely)</Text>
          </View>

          <View style={styles.cell}>
            <Text style={styles.label}>Author (last name)</Text>
            <Text>{author || '________________'}</Text>

            <Text style={styles.label}>Brief Title</Text>
            <Text>{title || '________________'}</Text>
          </View>

          <View style={styles.cellLast}>
            <Text style={styles.label}>CALL NUMBER</Text>
            <Text>{callNumber || '________________'}</Text>
          </View>
        </View>
      </View>

      {/* Section II: RESEARCHER INFORMATION */}
      <View style={styles.section}>
        <Text style={styles.label}>II. RESEARCHER INFORMATION</Text>

        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          {/* Affiliation */}
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>AFFILIATION</Text>
            <View style={styles.checkboxRow}>
              <View
                style={
                  affiliation === 'Miami' ? styles.checkedBox : styles.checkbox
                }
              />
              <Text>Miami University</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View
                style={
                  affiliation === 'Other' ? styles.checkedBox : styles.checkbox
                }
              />
              <Text>Other</Text>
            </View>
          </View>

          {/* Status */}
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>STATUS</Text>
            {[
              'Undergrad',
              'Graduate',
              'Faculty',
              'Staff',
              'Alumni',
              'Other',
            ].map((opt) => (
              <View key={opt} style={styles.checkboxRow}>
                <View
                  style={status === opt ? styles.checkedBox : styles.checkbox}
                />
                <Text>{opt}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  );
};
