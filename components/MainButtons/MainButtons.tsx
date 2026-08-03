import CreateProjectButton from '@/components/MainButtons/CreateProjectButton';
import QuickSlipButton from '@/components/MainButtons/QuickSlipButton';

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
