import { useParams } from 'react-router-dom';
import api, { imageUrl } from '../api/client';
import Loading from '../components/Loading';
import { useFetch } from '../hooks/useFetch';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => api.get(`/news/slug/${slug}`), [slug]);
  if (loading) return <Loading />;
  return <article className="section article"><img src={imageUrl(data.image)} /><h1>{data.title}</h1><p>{data.content}</p></article>;
}
