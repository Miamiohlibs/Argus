'use client';

import { useActionState } from 'react';
import { searchAction, SearchState } from './actions';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';

const initialState: SearchState = {
  results: [],
  error: null,
};

export default function SearchClient() {
  const [state, formAction, isPending] = useActionState(
    searchAction,
    initialState
  );

  return (
    <>
      <SearchBox action={formAction} pending={isPending} />

      {state.error && (
        <p role="alert" style={{ color: 'red' }}>
          {state.error}
        </p>
      )}

      <SearchResults results={state.results} />
    </>
  );
}
