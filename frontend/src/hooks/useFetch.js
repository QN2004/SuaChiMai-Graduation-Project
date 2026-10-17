import { useEffect, useRef, useState } from 'react';

export const useFetch = (loader, deps = [], { keepPrevious = true } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasDataRef = useRef(false);

  useEffect(() => {
    let active = true;
    const keep = keepPrevious && hasDataRef.current;
    if (!keep) {
      setLoading(true);
      if (!keepPrevious) {
        hasDataRef.current = false;
        setData(null);
      }
    }

    loader()
      .then((res) => {
        if (!active) return;
        setData(res.data);
        hasDataRef.current = true;
        setError('');
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Có lỗi xảy ra');
        if (!keep) setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, deps);

  return { data, loading, error, setData };
};
