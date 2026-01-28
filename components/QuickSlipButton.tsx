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
        <DropdownItem
          href={`${process.env.NEXT_PUBLIC_APP_BASEPATH}/quickSlip/alma`}
        >
          From Alma
        </DropdownItem>
        <DropdownItem
          href={`${process.env.NEXT_PUBLIC_APP_BASEPATH}/quickSlip/custom`}
        >
          Custom Entry
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    // <Link href="/quickSlipAlma" className="mb-3 btn btn-primary">
    //   Quick Slip
    // </Link>
  );
};
export default QuickSlipButton;
