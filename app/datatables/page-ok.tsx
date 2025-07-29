'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

import 'datatables.net-dt/css/dataTables.dataTables.css';

const DataTable = dynamic(
  async () => {
    const dtReact = import('datatables.net-react');
    const dtNet = import(`datatables.net-dt`);

    const [reactMod, dtNetMod] = await Promise.all([dtReact, dtNet]);

    reactMod.default.use(dtNetMod.default);
    return reactMod.default;
  },
  { ssr: false }
);

export default function Home() {
  const [tableData, setTableData] = useState([
    ['Tiger Nixon', 'System Architect'],
    ['Garrett Winters', 'Accountant'],
    // ...
  ]);

  return (
    <DataTable data={tableData} className="display">
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
        </tr>
      </thead>
    </DataTable>
  );
}
