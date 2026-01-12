'use client';

import type { SearchResult } from './actions';

export default function SearchResults({
  results,
}: {
  results: SearchResult[];
}) {
  if (!results.length) return null;

  return (
    <ul>
      {results.map((r) => (
        <li key={r.id}>{r.title}</li>
      ))}
    </ul>
  );
}
