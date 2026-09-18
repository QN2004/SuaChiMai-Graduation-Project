import { Link } from 'react-router-dom';
import api, { imageUrl } from '../api/client';
import Loading from '../components/Loading';
import { useFetch } from '../hooks/useFetch';

export default function NewsPage() {
  const { data, loading } = useFetch(() => api.get('/news'), []);
  if (loading) return <Loading />;
  return <section className="section"><div className="section-title"><h2>Tin tức khuyến mãi</h2></div><div className="news-grid">{data.map((n) => <Link className="news-card" to={`/news/${n.slug}`} key={n.id}><img src={imageUrl(n.image)} /><strong>{n.title}</strong><p>{n.content?.slice(0, 140)}...</p></Link>)}</div></section>;
}
