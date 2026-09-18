import { useEffect, useState } from 'react';

export const useFetch = (loader, deps = []) => {
  const [data, setData] = useState({ banners: [], categories: [], featured: [], latest: [], best: [], news: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    loader()
      .then((res) => active && setData(res.data))
      .catch((err) => active && setError(err.message || 'Co loi xay ra'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, deps);

  return { data, loading, error, setData };
};
