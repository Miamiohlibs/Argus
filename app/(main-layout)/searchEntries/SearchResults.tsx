'use client';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Link from 'next/link';
import deleteEntry from '@/app/actions/deleteEntry';
import { toast } from 'react-toastify';
// import { SearchResult } from '@/types/SearchResult';

import type { SearchResult } from './actions';

export default function SearchResults({
  results,
}: {
  results: SearchResult[];
}) {
  const [currentEntries, setCurrentEntries] = useState<SearchResult[]>([]); // Track current entries
  const [filteredEntries, setFilteredEntries] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  // Initialize data when entries prop changes
  useEffect(() => {
    setCurrentEntries(results);
    setFilteredEntries(results);
    setLoading(false);
  }, [results]); // Only run when entries prop changes

  // Filter entries when filterText or currentEntries change
  useEffect(() => {
    const filtered = currentEntries.filter((entry) =>
      [entry.title, entry.projectName, entry.user].some((val) =>
        val?.toLowerCase().includes(filterText.toLowerCase() || '')
      )
    );
    setFilteredEntries(filtered);
  }, [filterText, currentEntries]); // Use currentEntries instead of entries

  // Move columns inside the component so handleDelete is in scope
  const columns: TableColumn<SearchResult>[] = [
    {
      name: 'Title',
      selector: (row: SearchResult) => row.title ?? '',
      cell: (row: SearchResult) => row.title,
      sortable: true,
    },
    {
      name: 'Project',
      selector: (row: SearchResult) => row.projectId ?? '',
      cell: (row: SearchResult) => (
        <Link href={`/project/${row.projectId}`}>{row.projectName}</Link>
      ),
      sortable: true,
    },
    {
      name: 'Project Owner',
      selector: (row: SearchResult) => row.user ?? '',
      cell: (row: SearchResult) => row.user,
      sortable: true,
    },
  ];

  if (!results.length) return null;

  return (
    <div className="react-data-table" id="entries-table">
      <DataTable
        columns={columns}
        data={filteredEntries}
        progressPending={loading}
        pagination
        paginationPerPage={25}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        highlightOnHover
        striped
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Filter search results..."
            aria-label="Filter search results..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border rounded w-full md:w-1/3"
          />
        }
      />
    </div>
  );
  //   return (
  //     <ul>
  //       {results.map((r) => (
  //         <li key={r.id}>{JSON.stringify(r)}</li>
  //       ))}
  //     </ul>
  //   );
}
