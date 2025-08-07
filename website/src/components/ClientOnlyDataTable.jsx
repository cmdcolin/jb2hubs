import React, { useEffect, useState } from 'react'
import DataTable from './DataTable.jsx'
import Spinner from './ui/react-wrappers/Spinner.jsx'

export default function ClientOnlyDataTable(props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? <DataTable {...props} /> : <Spinner />
}
