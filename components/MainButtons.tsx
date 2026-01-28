import CreateProjectButton from '@/components/CreateProjectButton';
import QuickSlipButton from '@/components/QuickSlipButton';

const MainButtons = ({
  canPrint = false,
  isEditorOrAbove = false,
}: {
  isEditorOrAbove?: boolean;
  canPrint?: boolean;
}) => {
  return (
    <>
      {isEditorOrAbove && <CreateProjectButton />}{' '}
      {canPrint && <QuickSlipButton />}
    </>
  );
};

export default MainButtons;
