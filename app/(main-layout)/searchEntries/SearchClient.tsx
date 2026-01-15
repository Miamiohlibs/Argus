'use client';

import { useActionState } from 'react';
import { searchAction, SearchState } from './actions';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';

interface SearchClientProps {
  userId: string;
}

const initialState: SearchState = {
  results: [],
  error: null,
};

export default function SearchClient({ userId }: SearchClientProps) {
  const [state, formAction, isPending] = useActionState(
    searchAction,
    initialState
  );

  return (
    <>
      <SearchBox action={formAction} pending={isPending} userId={userId} />

      {state.error && (
        <p role="alert" style={{ color: 'red' }}>
          {state.error}
        </p>
      )}
      <div aria-live="assertive">
        <SearchResults results={state.results} />
      </div>
    </>
  );
}
