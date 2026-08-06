'use client';

import Dropdown from '@/components/ui/Dropdown';

const QuickSlipButton = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="quickslip">
        Quick Slip
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="/quickSlip/alma">From Alma</Dropdown.Item>
        <Dropdown.Item href="/quickSlip/custom">Custom Entry</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    // <Link href="/quickSlipAlma" className="mb-3 btn btn-primary">
    //   Quick Slip
    // </Link>
  );
};
export default QuickSlipButton;
