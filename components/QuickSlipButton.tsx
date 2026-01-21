import Link from 'next/link';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'react-bootstrap';

const QuickSlipButton = () => {
  return (
    <Dropdown style={{ display: 'inline' }}>
      <DropdownToggle variant="primary" id="quickslip">
        Quick Slip
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem href="#">From Alma</DropdownItem>
        <DropdownItem href="#">Custom Entry</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    // <Link href="/quickSlipAlma" className="mb-3 btn btn-primary">
    //   Quick Slip
    // </Link>
  );
};
export default QuickSlipButton;
