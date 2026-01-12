'use client';

interface Props {
  action: (formData: FormData) => void;
  pending: boolean;
  userId: string;
}

export default function SearchBox({ action, pending, userId }: Props) {
  return (
    <form action={action}>
      <input name="q" type="text" placeholder="Search…" disabled={pending} />
      <input type="hidden" id="userId" name="userId" value={userId} />
      <button type="submit" disabled={pending}>
        {pending ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
