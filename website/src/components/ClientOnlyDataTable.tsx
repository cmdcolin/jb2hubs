import React, { useEffect, useState } from 'react';
import DataTable, { TableProps } from './DataTable.tsx';
import Spinner from './ui/react-wrappers/Spinner.tsx';

export default function ClientOnlyDataTable(props: TableProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <DataTable {...props} /> : <Spinner />;
}
