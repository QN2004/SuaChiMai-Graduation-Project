import api from '../../api/client';
import Loading from '../../components/Loading';
import { useFetch } from '../../hooks/useFetch';

export default function AdminReviewPage() {
  const { data, loading, setData } = useFetch(() => api.get('/reviews/admin/all'), []);

  const toggle = async (review) => {
    const status = review.status ? 0 : 1;
    await api.put(`/reviews/${review.id}/status`, { status });
    setData(data.map((item) => (item.id === review.id ? { ...item, status } : item)));
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div>
          <span className="admin-kicker">Nội dung</span>
          <h1>Quản lý đánh giá</h1>
          <p>Duyệt phản hồi từ khách hàng để giữ khu vực đánh giá sạch, hữu ích và có kiểm soát.</p>
        </div>
        <div className="admin-hero-metrics">
          <span><strong>{data.length}</strong> đánh giá</span>
        </div>
      </div>

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr><th>Sản phẩm</th><th>Khách</th><th>Sao</th><th>Nội dung</th><th>Hiển thị</th></tr>
          </thead>
          <tbody>
            {data.length ? data.map((review) => (
              <tr key={review.id}>
                <td>{review.product_name}</td>
                <td>{review.full_name}</td>
                <td><span className="status-chip warn">{review.rating}/5</span></td>
                <td>{review.comment}</td>
                <td><div className="table-actions"><button type="button" onClick={() => toggle(review)}>{review.status ? 'Ẩn' : 'Hiện'}</button></div></td>
              </tr>
            )) : (
              <tr><td colSpan="5"><div className="empty-state">Chưa có đánh giá nào.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
