'use server';

export interface SearchResult {
  id: number;
  title: string;
}

export interface SearchState {
  results: SearchResult[];
  error: string | null;
}

export async function searchAction(
  prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const query = formData.get('q')?.toString().trim();

  if (!query) {
    return {
      results: [],
      error: 'Please enter a search term',
    };
  }

  // Fake search (replace with real API / DB)
  const results: SearchResult[] = [
    { id: 1, title: `Result for "${query}" #1` },
    { id: 2, title: `Result for "${query}" #2` },
  ];

  return {
    results,
    error: null,
  };
}
