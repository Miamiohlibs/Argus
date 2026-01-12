'use client';

interface Props {
  action: (formData: FormData) => void;
  pending: boolean;
}

export default function SearchBox({ action, pending }: Props) {
  return (
    <form action={action}>
      <input name="q" type="text" placeholder="Search…" disabled={pending} />
      <button type="submit" disabled={pending}>
        {pending ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
