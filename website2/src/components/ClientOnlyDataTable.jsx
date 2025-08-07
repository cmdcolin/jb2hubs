import React, { useEffect, useState } from 'react';
import DataTable from './DataTable.jsx';

export default function ClientOnlyDataTable(props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <DataTable {...props} /> : null;
}
