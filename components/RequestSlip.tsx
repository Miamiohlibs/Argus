// components/RequestSlip.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Times-Roman',
  },
  header: {
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 6,
    border: '1pt solid black',
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1pt solid black',
  },
  col: {
    flex: 1,
    padding: 4,
    borderRight: '1pt solid black',
  },
  lastCol: {
    flex: 1,
    padding: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1pt solid black',
    marginRight: 4,
  },
});

const RequestSlip = () => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Miami University Libraries</Text>
        <Text>Special Collections & Archives Request Slip</Text>
      </View>

      {/* Section I */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>
              I. ITEM REQUESTED (please fill out completely)
            </Text>
            <Text>TYPE OF MATERIAL</Text>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Vault</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Rare</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>German</Text>
            </View>
            {/* Add more as needed */}
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>Author (last name)</Text>
            <Text>Brief Title</Text>
            <Text>Date of item</Text>
            <Text>Manuscript #</Text>
            <Text>Box ________ Folder ________</Text>
            <Text>Other information</Text>
          </View>

          <View style={styles.lastCol}>
            <Text style={styles.label}>CALL NUMBER</Text>
            <Text>Volume(s):</Text>
          </View>
        </View>
      </View>

      {/* Section II */}
      <View style={styles.section}>
        <Text style={styles.label}>II. RESEARCHER INFORMATION</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text>Last Name (printed):</Text>
            <Text>AFFILIATION</Text>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Miami University</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Other</Text>
            </View>
          </View>

          <View style={styles.col}>
            <Text>Institution</Text>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Undergraduate</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Graduate</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Faculty</Text>
            </View>
          </View>

          <View style={styles.lastCol}>
            <Text>Status</Text>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Alumni</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Staff</Text>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} /> <Text>Other</Text>
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
          </View>
          <View style={styles.col}>
            <Text>Pulled by:</Text>
            <Text>Location:</Text>
          </View>
          <View style={styles.lastCol}>
            <Text>Resolved by:</Text>
            <Text>Resolved on date:</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default RequestSlip;
