import { useState, useEffect } from 'react';

export function useColumnVisibility() {
  const [showAllColumns, setShowAllColumns] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('show') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (showAllColumns) {
        params.set('show', 'true');
      } else {
        params.delete('show');
      }
      window.history.replaceState(null, '', `?${params.toString()}${window.location.hash}`);
    }
  }, [showAllColumns]);

  return { showAllColumns, setShowAllColumns };
}
