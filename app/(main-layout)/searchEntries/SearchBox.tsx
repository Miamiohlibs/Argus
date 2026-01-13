'use client';
import { FormGroup, Button, InputGroup, Form } from 'react-bootstrap';
interface Props {
  action: (formData: FormData) => void;
  pending: boolean;
  userId: string;
}

export default function SearchBox({ action, pending, userId }: Props) {
  return (
    <Form action={action} className="mb-5">
      <InputGroup>
        <Form.Control
          name="q"
          type="text"
          placeholder="Search title and author keywords …"
          disabled={pending}
        />
        <Button type="submit" disabled={pending}>
          {pending ? 'Searching…' : 'Search'}
        </Button>
      </InputGroup>
      <Form.Control type="hidden" id="userId" name="userId" value={userId} />
    </Form>
  );
}
