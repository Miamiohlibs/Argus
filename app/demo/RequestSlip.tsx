import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './RequestSlip.css'; // for print styling
import { EntryWithItems } from '@/types/EntryWithItems';

interface RequestSlipProps {
  entry: EntryWithItems;
}

export default function RequestSlip({ entry }: RequestSlipProps) {
  return (
    <Container fluid className="request-slip border p-3">
      <div>{JSON.stringify(entry)}</div>
      {/* Header */}
      <Row>
        <Col className="text-center">
          <h5>Miami University Libraries</h5>
          <h6>Special Collections & Archives Request Slip</h6>
        </Col>
      </Row>

      {/* I. ITEM REQUESTED */}
      <Row className="mt-3">
        <Col>
          <h6>
            I. ITEM REQUESTED <small>(please fill out completely)</small>
          </h6>
        </Col>
      </Row>

      <Row className="section border">
        {/* Left Column */}
        <Col md={3} className="border-end p-2">
          <p>
            <b>TYPE OF MATERIAL</b>
          </p>
          <ul className="checklist">
            <li>[ ] Vault</li>
            <li>[ ] Rare</li>
            <li>[ ] German</li>
            <li>[ ] Russian</li>
            <li>[ ] Miami Archives</li>
            <li>[ ] Thesis/Dissertation</li>
            <li>[ ] Manuscript</li>
          </ul>

          <ul className="checklist">
            <li>[ ] Western College</li>
            <li>[ ] Oxford College</li>
            <li>[ ] Reference</li>
            <li>[ ] Archives VF</li>
            <li>[ ] Map</li>
            <li>[ ] Honors Paper</li>
            <li>[ ] Photograph</li>
          </ul>

          <p>
            <b>SIZE (if applicable)</b>
          </p>
          <ul className="checklist">
            <li>[ ] Small</li>
            <li>[ ] Folio</li>
            <li>[ ] Double Oversize</li>
            <li>[ ] Media</li>
            <li>[ ] Other: _____________</li>
          </ul>
        </Col>

        {/* Middle Column */}
        <Col md={5} className="px-3 p-2">
          <p>Author (last name): {entry.author}</p>
          <p>Brief Title: {entry.itemTitle}</p>
          <p>Date of item: __________________________________</p>
          <p>Manuscript #: _________________________________</p>

          <Row>
            <Col>Box: _____________</Col>
            <Col>Folder: _____________</Col>
          </Row>

          <p className="mt-2">Other information:</p>
          <div className="blank-box">{entry.notes}</div>
        </Col>

        {/* Right Column */}
        <Col md={2} className="border-start p-2">
          <h6 className="text-center">CALL NUMBER</h6>
          <p>{entry.location}</p>
          <p>{entry.callNumber}</p>

          <p>Volume(s):</p>
          <div className="blank-box tall" />
        </Col>
      </Row>

      {/* II. Researcher Information */}
      <Row className="mt-4">
        <Col>
          <h6>II. RESEARCHER INFORMATION</h6>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Last Name (printed): ____________________________</p>
        </Col>
      </Row>

      <Row className="mt-2 section border p-2">
        <Col md={3}>
          <p>
            <b>AFFILIATION</b>
          </p>
          <ul className="checklist">
            <li>[ ] Miami University</li>
            <li>[ ] Other</li>
          </ul>
        </Col>
        <Col md={3}>
          <p>
            <b>Institution</b>
          </p>
          <ul className="checklist">
            <li>[ ] Undergraduate</li>
            <li>[ ] Graduate</li>
            <li>[ ] Faculty</li>
          </ul>
        </Col>
        <Col md={3}>
          <p>
            <b>Status</b>
          </p>
          <ul className="checklist">
            <li>[ ] Alumni</li>
            <li>[ ] Staff</li>
            <li>[ ] Other</li>
          </ul>
        </Col>
      </Row>

      {/* Internal Use Only */}
      <Row className="mt-4 border-top pt-2">
        <Col>
          <h6 className="text-center">— For Internal Use Only —</h6>
        </Col>
      </Row>
      <Row className="section border p-2">
        <Col md={4}>
          <ul className="checklist">
            <li>[ ] Conservation</li>
            <li>[ ] Exhibit</li>
            <li>[ ] Digitization</li>
            <li>[ ] Cataloguing</li>
          </ul>
        </Col>
        <Col md={4}>
          <ul className="checklist">
            <li>[ ] Hold Shelf/Cart</li>
            <li>[ ] Reading Room</li>
            <li>[ ] Class</li>
            <li>[ ] Other</li>
          </ul>
        </Col>
        <Col md={4}>
          <p>Pulled by: __________________</p>
          <p>Location: ___________________</p>
          <p>Resolved by: _______________</p>
          <p>Resolved on date: ___________</p>
        </Col>
      </Row>
      <pre>{JSON.stringify(entry)}</pre>
    </Container>
  );
}
