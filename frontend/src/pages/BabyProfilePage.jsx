import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBaby, FaChartLine, FaCheck, FaCheckCircle, FaChevronRight, FaClock, FaEdit, FaExclamationTriangle, FaHeartbeat, FaPlus, FaRoute, FaShieldAlt, FaTrashAlt, FaUtensils } from 'react-icons/fa';
import api, { imageUrl } from '../api/client';
import ReplenishmentList from '../components/ReplenishmentList';
import { useUiFeedback } from '../context/UiFeedbackContext';
import { babyConditions } from '../utils/baby';
import { formatDate } from '../utils/expiry';
import { money } from '../utils/format';

const emptyForm = { name: '', birth_date: '', weight_kg: '', conditions: [] };
const kg = (value) => `${String(value).replace('.', ',')} kg`;
const formulaLabel = (stage) => stage?.stage <= 4 ? `Giai đoạn ${stage.stage}` : 'Tuổi học đường';
const formulaDetail = (stage) => stage?.stage <= 4
  ? `Sữa công thức số ${stage.stage} · ${stage.label.match(/\((.*)\)/)?.[1] || ''}`
  : 'Dinh dưỡng bổ sung · 6–12 tuổi';

function CareJourney({ baby, journey, stageProducts = {} }) {
  const [selectedStage, setSelectedStage] = useState(journey?.current_stage);
  if (!journey) return null;
  const activeStage = journey.stages.find((stage) => stage.key === selectedStage)
    || journey.stages.find((stage) => stage.status === 'current')
    || journey.stages[0];
  const previewProducts = stageProducts[activeStage.key] || [];
  return (
    <section className="care-journey panel">
      <div className="care-journey-head">
        <div>
          <span className="section-kicker"><FaRoute /> Hành trình chăm sóc bé {baby.name}</span>
          <h2>Hành trình {activeStage.label} của bé {baby.name}</h2>
          <p>Những việc nên làm, điều cần chú ý và sản phẩm phù hợp trong giai đoạn này.</p>
        </div>
        <div className="care-current-badge"><small>Tuổi hiện tại</small><strong>{baby.age_text}</strong></div>
      </div>

      <div className="care-stage-nav" role="tablist" aria-label="Các giai đoạn chăm sóc">
        {journey.stages.map((stage) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeStage.key === stage.key}
            key={stage.key}
            className={`care-stage-tab is-${stage.status}${activeStage.key === stage.key ? ' active' : ''}`}
            onClick={() => setSelectedStage(stage.key)}
          >
            <span className="care-stage-dot">{stage.status === 'completed' ? <FaCheck /> : journey.stages.indexOf(stage) + 1}</span>
            <span><strong>{stage.label}</strong><small>{stage.title}</small></span>
          </button>
        ))}
      </div>

      <div className="care-focus-grid">
        <article className="care-stage-focus care-todo-panel">
          <div className="care-stage-focus-head">
            <div><span>{activeStage.label} · {activeStage.title}</span><h3>Cần làm trong giai đoạn này</h3></div>
            {activeStage.status === 'current' && <em>Đang áp dụng</em>}
          </div>
          <div className="care-action-list">
            <div><span className="care-action-icon nutrition"><FaUtensils /></span><p><strong>Ăn uống và dinh dưỡng</strong>{activeStage.nutrition}</p></div>
            <div><span className="care-action-icon growth"><FaHeartbeat /></span><p><strong>Chăm sóc và phát triển</strong>{activeStage.routine} {activeStage.milestone}</p></div>
            <div><span className="care-action-icon safety"><FaShieldAlt /></span><p><strong>An toàn cần nhớ</strong>{activeStage.safety}</p></div>
          </div>
        </article>

        <aside className="care-priority">
          <span className="care-priority-kicker">Theo hồ sơ của bé {baby.name}</span>
          <h3>Chú ý riêng cho bé</h3>
          <div className="care-priority-notes">
            {journey.personalized_notes.length
              ? journey.personalized_notes.map((note) => <p key={note}><FaShieldAlt /> <span>{note}</span></p>)
              : <p><FaCheck /> <span>Hồ sơ chưa ghi nhận cơ địa đặc biệt. Tiếp tục quan sát phản ứng khi đổi thực phẩm hoặc sữa.</span></p>}
          </div>
          <div className="care-next"><span>Chuẩn bị tiếp theo</span><p>{journey.next_milestone}</p><FaChevronRight /></div>
        </aside>
      </div>

      <div className="care-practical-grid">
        <section className="care-weekly-plan">
          <div className="care-subhead"><span><FaCheckCircle /></span><div><small>Kế hoạch ngắn</small><h3>Việc nên làm trong tuần này</h3></div></div>
          <div className="care-checklist">
            {(activeStage.weekly_tasks || []).map((task, index) => <p key={task}><span>{index + 1}</span>{task}</p>)}
          </div>
        </section>
        <section className="care-reference">
          <div className="care-reference-item rhythm"><FaClock /><div><small>Nhịp sinh hoạt tham khảo</small><p>{activeStage.daily_rhythm}</p></div></div>
          <div className="care-reference-item"><FaChartLine /><div><small>Cần theo dõi</small><ul>{(activeStage.tracking || []).map((item) => <li key={item}>{item}</li>)}</ul></div></div>
          <div className="care-reference-item warning"><FaExclamationTriangle /><div><small>Nên hỏi bác sĩ khi</small><ul>{(activeStage.doctor_signs || []).map((item) => <li key={item}>{item}</li>)}</ul></div></div>
        </section>
      </div>

      <section className="care-deep-dive">
        <div className="care-deep-head">
          <div><span>Hiểu và đồng hành cùng bé</span><h3>Gợi ý thực tế cho cả giai đoạn</h3></div>
          <small>Mỗi bé phát triển theo nhịp riêng; dùng các mốc để quan sát, không để so sánh.</small>
        </div>
        <div className="care-guide-grid">
          <article className="care-guide-card milestones">
            <span><FaChartLine /></span><h4>Mốc thường gặp</h4>
            <ul>{(activeStage.development || []).map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="care-guide-card activities">
            <span><FaHeartbeat /></span><h4>Hoạt động cùng bé</h4>
            <ul>{(activeStage.activities || []).map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="care-guide-card meals">
            <span><FaUtensils /></span><h4>Gợi ý ăn uống</h4>
            <ul>{(activeStage.meal_ideas || []).map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
        <div className="care-checkpoint-block">
          <div className="care-checkpoint-title"><span>Lộ trình trong chặng</span><strong>{activeStage.label}</strong></div>
          <div className="care-checkpoint-track">
            {(activeStage.checkpoints || []).map((checkpoint, index) => (
              <article key={checkpoint.age}>
                <span>{index + 1}</span>
                <small>{checkpoint.age}</small>
                <strong>{checkpoint.focus}</strong>
                <p>{checkpoint.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="care-product-preview">
        <div className="care-product-preview-head">
          <div><span>Sản phẩm gợi ý</span><h3>Phù hợp với {activeStage.label} và cơ địa của bé {baby.name}</h3></div>
          <Link to="/products">Xem tất cả <FaChevronRight /></Link>
        </div>
        <div className="care-product-focus"><small>Nên ưu tiên nhóm:</small>{(activeStage.product_focus || []).map((item) => <span key={item}>{item}</span>)}</div>
        {previewProducts.length ? (
          <div className="care-preview-grid">
            {previewProducts.map((product) => (
              <Link className="care-preview-card" to={`/products/${product.slug}`} key={product.id}>
                <img src={imageUrl(product.image)} alt="" loading="lazy" />
                <span>
                  <small>{product.brand_name || 'Sữa Chi Mai'}</small>
                  <strong>{product.name}</strong>
                  <em>{money(product.sale_price || product.price)}</em>
                </span>
                <FaChevronRight />
              </Link>
            ))}
          </div>
        ) : (
          <div className="care-preview-empty">
            Chưa có sản phẩm đúng giai đoạn này và phù hợp cơ địa của bé. <Link to="/contact">Liên hệ cửa hàng</Link>
          </div>
        )}
      </section>

      <div className="care-journey-foot"><small>{journey.disclaimer}</small></div>
    </section>
  );
}

export default function BabyProfilePage() {
  const { toast, confirm } = useUiFeedback();
  const [babies, setBabies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState('');
  const [replenish, setReplenish] = useState([]);

  const current = babies.find((b) => b.is_default) || babies[0] || null;

  const load = async () => {
    const res = await api.get('/babies');
    setBabies(res.data.babies);
    setLoaded(true);
    if (!res.data.babies.length) setShowForm(true);
  };

  useEffect(() => {
    load();
    api.get('/babies/replenishment').then((res) => setReplenish(res.data)).catch(() => setReplenish([]));
  }, []);

  useEffect(() => {
    if (!current) { setAdvice(null); setAdviceLoading(false); setAdviceError(''); return; }
    setAdviceLoading(true);
    setAdviceError('');
    api.get(`/babies/${current.id}/recommendations`)
      .then((res) => setAdvice(res.data))
      .catch(() => {
        setAdvice(null);
        setAdviceError('Chưa tải được hành trình chăm sóc. Vui lòng thử lại sau.');
      })
      .finally(() => setAdviceLoading(false));
  }, [current?.id, current?.birth_date, current?.weight_kg, current?.conditions?.join(',')]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };

  const save = async (event) => {
    event.preventDefault();
    try {
      if (editing) await api.put(`/babies/${editing}`, form);
      else await api.post('/babies', form);
      toast(editing ? 'Đã cập nhật hồ sơ bé' : 'Đã tạo hồ sơ bé');
      setForm(emptyForm);
      setEditing(null);
      setShowForm(false);
      load();
    } catch (err) {
      toast(err.message || 'Không lưu được hồ sơ', 'error');
    }
  };

  const edit = (baby) => {
    setEditing(baby.id);
    setForm({ name: baby.name, birth_date: baby.birth_date, weight_kg: baby.weight_kg ?? '', conditions: baby.conditions });
    setShowForm(true);
  };

  const remove = async (baby) => {
    const ok = await confirm({ title: 'Xóa hồ sơ bé?', message: `Hồ sơ của bé ${baby.name} sẽ bị xóa.`, confirmText: 'Xóa', cancelText: 'Giữ lại', tone: 'danger' });
    if (!ok) return;
    await api.delete(`/babies/${baby.id}`);
    toast('Đã xóa hồ sơ bé');
    load();
  };

  const choose = async (baby) => {
    if (baby.id === current?.id) return;
    await api.put(`/babies/${baby.id}/default`);
    load();
  };

  const toggleCondition = (code) => setForm({
    ...form,
    conditions: form.conditions.includes(code) ? form.conditions.filter((c) => c !== code) : [...form.conditions, code]
  });

  return (
    <section className="section baby-page">
      <div className="baby-shell">
        <header className="baby-header">
          <div className="baby-header-copy">
            <span className="section-kicker">Hồ sơ của bé</span>
            <h1>Mỗi giai đoạn lớn khôn,<br /><em>một lựa chọn phù hợp</em></h1>
            <p>Lưu hồ sơ để theo dõi tuổi, cân nặng và cơ địa. Sữa Chi Mai sẽ giải thích giai đoạn sữa, gợi ý sản phẩm và chuẩn bị hành trình chăm sóc riêng cho bé.</p>
            <div className="baby-hero-points">
              <span><FaCheck /> Đúng độ tuổi</span>
              <span><FaShieldAlt /> Lưu ý cơ địa</span>
              <span><FaRoute /> 5 chặng phát triển</span>
            </div>
            <button type="button" className="btn primary" onClick={openNew}><FaPlus /> Thêm hồ sơ bé</button>
          </div>
          <div className="baby-hero-visual" aria-hidden="true">
            <span className="baby-hero-orbit orbit-one" />
            <span className="baby-hero-orbit orbit-two" />
            <img src="/images/baby-profile-hero-v1.png" alt="" />
            <div className="baby-hero-note note-age"><small>Hôm nay</small><strong>Khỏe mạnh, vui vẻ</strong></div>
            <div className="baby-hero-note note-care"><FaHeartbeat /><span><small>Chăm sóc theo</small><strong>Đúng giai đoạn</strong></span></div>
          </div>
        </header>

        <div className="baby-layout">
          <aside className="baby-side">
            {babies.length > 0 && (
              <div className="panel baby-pick">
                <div className="block-head"><h3>Bé của bạn</h3></div>
                {babies.map((baby) => (
                  <button key={baby.id} type="button" className={`baby-pick-item${baby.id === current?.id ? ' active' : ''}`} onClick={() => choose(baby)}>
                    <span className="baby-avatar"><FaBaby /></span>
                    <span>
                      <strong>{baby.name}</strong>
                      <small>{baby.age_text}{baby.weight_kg ? ` · ${kg(baby.weight_kg)}` : ''}</small>
                    </span>
                    {baby.id === current?.id && <span className="tone-chip pink">Đang tư vấn</span>}
                  </button>
                ))}
              </div>
            )}

            {showForm && (
              <form className="panel baby-form" onSubmit={save}>
                <h3>{editing ? 'Sửa hồ sơ bé' : 'Thêm hồ sơ bé'}</h3>
                <label>Tên gọi
                  <input required maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Bông" />
                </label>
                <div className="two">
                  <label>Ngày sinh
                    <input required type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
                  </label>
                  <label>Cân nặng (kg)
                    <input type="number" step="0.1" min="0.5" max="60" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} placeholder="6,5" />
                  </label>
                </div>
                <div>
                  <span className="field-label">Cơ địa / sức khỏe</span>
                  <div className="condition-chips">
                    {Object.entries(babyConditions).map(([code, label]) => (
                      <button key={code} type="button" className={`condition-chip${form.conditions.includes(code) ? ' on' : ''}`} onClick={() => toggleCondition(code)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn primary" type="submit">{editing ? 'Lưu thay đổi' : 'Tạo hồ sơ'}</button>
                  {babies.length > 0 && <button className="btn ghost" type="button" onClick={() => setShowForm(false)}>Hủy</button>}
                </div>
              </form>
            )}
          </aside>

          <div className="baby-main">
            {current && (
              <div className="panel baby-summary">
                <div className="baby-summary-head">
                  <span className="baby-profile-photo"><img src="/images/baby-profile-hero-v1.png" alt="" /></span>
                  <div>
                    <span className="baby-summary-eyebrow">Hồ sơ đang được tư vấn</span>
                    <h2>Bé {current.name}</h2>
                    <p>Sinh ngày {formatDate(current.birth_date)} · {current.age_text}</p>
                  </div>
                  <div className="actions">
                    <button type="button" className="icon-text-btn" onClick={() => edit(current)}><FaEdit /> Sửa</button>
                    <button type="button" className="icon-text-btn danger" onClick={() => remove(current)}><FaTrashAlt /> Xóa</button>
                  </div>
                </div>
                <div className="baby-tiles">
                  <div className="baby-tile"><span>Tuổi</span><strong>{current.age_text}</strong><small>{current.age_months >= 12 ? `${current.age_months} tháng` : `sinh ${formatDate(current.birth_date)}`}</small></div>
                  <div className="baby-tile formula-tile">
                    <span>Giai đoạn sữa theo tuổi</span>
                    <strong>{formulaLabel(current.formula_stage)}</strong>
                    <small>{formulaDetail(current.formula_stage)}</small>
                  </div>
                  <div className="baby-tile">
                    <span>Size bỉm</span>
                    <strong>{current.diaper_size ? current.diaper_size.size : '—'}</strong>
                    <small>{current.diaper_size ? current.diaper_size.label.match(/\((.*)\)/)?.[1] : 'Nhập cân nặng để tính'}</small>
                  </div>
                  <div className="baby-tile">
                    <span>Cơ địa</span>
                    <div className="baby-tags">
                      {current.condition_labels.length
                        ? current.condition_labels.map((label) => <span key={label} className="tone-chip warn">{label}</span>)
                        : <span className="tone-chip ok">Bình thường</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {replenish.length > 0 && (
              <div>
                <div className="block-head">
                  <div>
                    <span className="section-kicker">Nhắc mua lại</span>
                    <h2>Sắp hết – đặt lại nhé</h2>
                    <p>Tính từ ngày đơn hoàn thành và thời gian dùng hết của sản phẩm (lon 800g khoảng 14 ngày).</p>
                  </div>
                </div>
                <ReplenishmentList items={replenish} />
              </div>
            )}

            {adviceLoading && <div className="baby-advice-state">Đang chuẩn bị hành trình chăm sóc cho bé {current?.name}…</div>}
            {adviceError && <div className="baby-advice-state is-error">{adviceError}</div>}
            {advice && <CareJourney key={advice.baby.id} baby={advice.baby} journey={advice.journey} stageProducts={advice.stage_products} />}

            {loaded && !babies.length && (
              <div className="baby-empty">Tạo hồ sơ đầu tiên ở khung bên trái để nhận gợi ý theo tuổi và cơ địa của bé.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
