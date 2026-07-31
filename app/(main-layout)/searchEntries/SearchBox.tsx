'use client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputGroup from '@/components/ui/InputGroup';
interface Props {
  action: (formData: FormData) => void;
  pending: boolean;
  userId: string;
}

export default function SearchBox({ action, pending, userId }: Props) {
  return (
    <form action={action} className="mb-12">
      <InputGroup>
        <Input
          name="q"
          type="text"
          placeholder="Search title and author keywords …"
          aria-label="Search keywords"
          disabled={pending}
        />
        <Button type="submit" disabled={pending}>
          {pending ? 'Searching…' : 'Search'}
        </Button>
      </InputGroup>
      <input type="hidden" id="userId" name="userId" value={userId} />
    </form>
  );
}
