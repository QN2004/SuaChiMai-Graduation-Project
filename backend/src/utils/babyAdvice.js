// Tư vấn theo hồ sơ bé: tháng tuổi, size bỉm, giai đoạn sữa, cảnh báo an toàn, gợi ý, nhắc mua lại.
// Các hàm thuần (không đọc CSDL) để kiểm thử được.

export const CONDITIONS = {
  CMPA: 'Dị ứng đạm sữa bò',
  LACTOSE: 'Bất dung nạp lactose',
  CONSTIPATION: 'Hay táo bón',
  UNDERWEIGHT: 'Nhẹ cân',
  PREMATURE: 'Sinh non'
};

export const parseConditions = (value) =>
  [...new Set(String(value || '').split(',').map((item) => item.trim()).filter((item) => CONDITIONS[item]))];

const parts = (value) => String(value).slice(0, 10).split('-').map(Number);

export const ageInMonths = (birthDate, today) => {
  const [by, bm, bd] = parts(birthDate);
  const [ty, tm, td] = parts(today);
  let months = (ty - by) * 12 + (tm - bm);
  if (td < bd) months -= 1;
  return Math.max(0, months);
};

export const formatAge = (months) => {
  if (months < 12) return `${months} tháng`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} tuổi ${rest} tháng` : `${years} tuổi`;
};

const formatStageAge = (months) => (months % 12 === 0 && months >= 12 ? `${months / 12} tuổi` : `${months} tháng`);

// Bảng size bỉm chuẩn (kg). Các size chồng lấn nhau; chọn size nhỏ nhất còn dư ít nhất 1 kg để bé lớn.
export const DIAPER_SIZES = [
  { size: 'NB', min: 0, max: 5 },
  { size: 'S', min: 4, max: 8 },
  { size: 'M', min: 6, max: 11 },
  { size: 'L', min: 9, max: 14 },
  { size: 'XL', min: 12, max: 17 },
  { size: 'XXL', min: 15, max: 25 }
];

export const diaperSize = (weightKg) => {
  const w = Number(weightKg);
  if (!w || w <= 0) return null;
  const fit = DIAPER_SIZES.find((item) => w >= item.min && w <= item.max - 1)
    || DIAPER_SIZES.find((item) => w >= item.min && w <= item.max)
    || DIAPER_SIZES[DIAPER_SIZES.length - 1];
  return { ...fit, label: `${fit.size} (${fit.min === 0 ? `dưới ${fit.max}` : `${fit.min}–${fit.max}`} kg)` };
};

export const FORMULA_STAGES = [
  { stage: 1, min: 0, max: 6, label: 'Số 1 (0–6 tháng)' },
  { stage: 2, min: 6, max: 12, label: 'Số 2 (6–12 tháng)' },
  { stage: 3, min: 12, max: 36, label: 'Số 3 (1–3 tuổi)' },
  { stage: 4, min: 36, max: 72, label: 'Số 4 (3–6 tuổi)' },
  { stage: 5, min: 72, max: 144, label: 'Dinh dưỡng tuổi học đường (6–12 tuổi)' }
];

export const formulaStage = (months) =>
  FORMULA_STAGES.find((item) => months >= item.min && months < item.max) || FORMULA_STAGES[FORMULA_STAGES.length - 1];

export const CARE_STAGES = [
  {
    key: 'newborn', min: 0, max: 6, label: '0–6 tháng', title: 'Khởi đầu và làm quen',
    nutrition: 'Ưu tiên sữa mẹ. Nếu dùng sữa công thức, chọn đúng số 1 và pha chính xác theo nhãn.',
    routine: 'Theo dõi cữ bú, số tã ướt, giấc ngủ và dấu hiệu dung nạp sau mỗi lần đổi sữa.',
    milestone: 'Theo dõi tăng trưởng, tiêm chủng và khả năng kiểm soát đầu – cổ.',
    safety: 'Không cho ăn dặm sớm, không thêm đường/mật ong và không dùng lại sữa thừa sau cữ bú.',
    weekly_tasks: ['Ghi lại số cữ bú và phản ứng sau bú trong 3 ngày', 'Cho bé nằm sấp có giám sát mỗi ngày', 'Kiểm tra lịch tiêm chủng và lịch khám định kỳ', 'Cân bé cùng một thời điểm mỗi tuần nếu cần theo dõi'],
    daily_rhythm: 'Bú theo nhu cầu, ngủ nhiều giấc ngắn; ưu tiên nhận biết dấu hiệu đói và buồn ngủ thay vì ép lịch cố định.',
    tracking: ['Cân nặng và chiều dài', 'Số tã ướt mỗi ngày', 'Khả năng ngẩng và giữ đầu'],
    doctor_signs: ['Bỏ bú hoặc bú kém kéo dài', 'Nôn vọt, khó thở, phát ban hoặc ít tã ướt bất thường'],
    checkpoints: [
      { age: '0–2 tháng', focus: 'Gắn kết và thích nghi', detail: 'Da kề da, đáp ứng tiếng khóc, quan sát cữ bú và phản ứng với âm thanh.' },
      { age: '3–4 tháng', focus: 'Kiểm soát đầu – cổ', detail: 'Tăng thời gian nằm sấp có giám sát, trò chuyện và cho bé với lấy đồ vật an toàn.' },
      { age: '5–6 tháng', focus: 'Chuẩn bị chuyển giai đoạn', detail: 'Quan sát khả năng ngồi có hỗ trợ và dấu hiệu sẵn sàng ăn dặm; chưa bắt đầu chỉ vì đủ tháng.' }
    ],
    development: ['Nhìn theo khuôn mặt và vật chuyển động', 'Phản ứng với âm thanh, giọng nói quen thuộc', 'Dần giữ đầu vững và với lấy đồ vật'],
    activities: ['Nằm sấp có giám sát khi bé thức', 'Nói chuyện, hát và bắt chước âm thanh của bé', 'Đưa đồ chơi mềm trong tầm với để bé tập cầm'],
    meal_ideas: ['Sữa mẹ theo nhu cầu', 'Sữa công thức số 1 nếu cần và theo đúng hướng dẫn pha', 'Chưa cần nước, nước trái cây hay thức ăn dặm trước khi phù hợp'],
    product_focus: ['Sữa công thức số 1', 'Vitamin theo chỉ định', 'Sản phẩm vệ sinh dịu nhẹ']
  },
  {
    key: 'weaning', min: 6, max: 12, label: '6–12 tháng', title: 'Ăn dặm và khám phá',
    nutrition: 'Tiếp tục sữa mẹ hoặc sữa số 2; bắt đầu ăn dặm đủ nhóm chất với độ thô tăng dần.',
    routine: 'Giới thiệu từng thực phẩm mới, quan sát phản ứng 2–3 ngày và tập uống nước bằng cốc.',
    milestone: 'Khuyến khích ngồi, bò, cầm nắm và tương tác trong bữa ăn.',
    safety: 'Tránh mật ong trước 12 tháng, thức ăn dễ hóc, sữa bò tươi làm thức uống chính và nêm mặn.',
    weekly_tasks: ['Thử một thực phẩm mới và theo dõi 2–3 ngày', 'Tăng dần độ thô phù hợp khả năng nhai nuốt', 'Duy trì sữa mẹ hoặc sữa số 2 bên cạnh ăn dặm', 'Tập cho bé ngồi ăn cùng gia đình và uống bằng cốc'],
    daily_rhythm: 'Duy trì 2–3 bữa ăn dặm tùy tháng tuổi, xen kẽ các cữ sữa và giấc ngủ ổn định.',
    tracking: ['Cân nặng và chiều dài', 'Phản ứng với thực phẩm mới', 'Khả năng ngồi, bò và cầm nắm'],
    doctor_signs: ['Nổi mề đay, sưng môi hoặc khó thở sau ăn', 'Không tăng cân, tiêu chảy hoặc táo bón kéo dài'],
    checkpoints: [
      { age: '6–7 tháng', focus: 'Làm quen thức ăn', detail: 'Bắt đầu lượng nhỏ, mềm và đặc vừa; giới thiệu từng món trong tâm thế không ép ăn.' },
      { age: '8–9 tháng', focus: 'Tăng độ thô và tự ăn', detail: 'Chuyển dần sang nghiền thô, miếng mềm cầm tay; tập ngồi ăn và uống bằng cốc.' },
      { age: '10–12 tháng', focus: 'Đa dạng bữa ăn', detail: 'Tăng số bữa theo nhu cầu, phối hợp nhiều nhóm thực phẩm và tiến gần bữa ăn gia đình.' }
    ],
    development: ['Ngồi vững dần, bò hoặc tự di chuyển theo cách riêng', 'Chuyển đồ vật giữa hai tay và nhặt miếng nhỏ', 'Bập bẹ, phản ứng khi gọi tên và thích tương tác'],
    activities: ['Chơi ú òa, giấu đồ chơi để bé tìm', 'Cho cầm thức ăn mềm phù hợp và tự đưa lên miệng', 'Đọc sách tranh, gọi tên người và đồ vật quanh bé'],
    meal_ideas: ['Cháo đặc hoặc cơm nát kèm đạm, rau và chất béo', 'Trứng, thịt, cá, đậu được chế biến mềm và phù hợp dị ứng', 'Trái cây chín mềm hoặc sữa chua phù hợp lứa tuổi làm bữa phụ'],
    product_focus: ['Sữa công thức số 2', 'Bột/cháo ăn dặm đúng tháng', 'Men vi sinh khi có chỉ định']
  },
  {
    key: 'toddler', min: 12, max: 36, label: '1–3 tuổi', title: 'Tự lập từng bước',
    nutrition: 'Duy trì 3 bữa chính, 2–3 bữa phụ; chọn sữa số 3 phù hợp và ưu tiên thực phẩm đa dạng.',
    routine: 'Tạo giờ ăn – ngủ ổn định, cho bé tự xúc và hạn chế đồ uống nhiều đường.',
    milestone: 'Theo dõi ngôn ngữ, vận động, răng miệng và biểu đồ tăng trưởng định kỳ.',
    safety: 'Không ép ăn; cắt nhỏ thực phẩm tròn/cứng và luôn có người lớn quan sát khi ăn.',
    weekly_tasks: ['Lên thực đơn đủ nhóm chất cho 5–7 ngày', 'Cho bé tự xúc trong ít nhất một bữa mỗi ngày', 'Duy trì giờ ăn và giờ ngủ ổn định', 'Đánh răng sáng và tối với sự hỗ trợ của người lớn'],
    daily_rhythm: 'Ba bữa chính, 2–3 bữa phụ, ngủ trưa và vận động chủ động hằng ngày.',
    tracking: ['Chiều cao và cân nặng', 'Số từ và khả năng giao tiếp', 'Vận động đi, chạy và cầm nắm'],
    doctor_signs: ['Sụt cân hoặc không tăng trưởng qua nhiều tháng', 'Mất kỹ năng đã có hoặc chậm giao tiếp rõ rệt'],
    checkpoints: [
      { age: '12–18 tháng', focus: 'Tập tự lập', detail: 'Tập dùng thìa, cốc; khuyến khích đi và gọi tên đồ vật quen thuộc.' },
      { age: '18–24 tháng', focus: 'Ngôn ngữ và vận động', detail: 'Đọc sách, trò chuyện hai chiều, chơi xếp khối và vận động toàn thân hằng ngày.' },
      { age: '24–36 tháng', focus: 'Nề nếp gia đình', detail: 'Ăn cùng gia đình, tự làm việc nhỏ, học chờ lượt và diễn đạt nhu cầu.' }
    ],
    development: ['Đi, chạy và leo bậc với khả năng tăng dần', 'Vốn từ và câu ngắn phát triển rõ qua từng giai đoạn', 'Bắt chước người lớn và bắt đầu chơi giả vờ'],
    activities: ['Đọc sách và hỏi bé chỉ hình, gọi tên', 'Xếp khối, vẽ nguệch ngoạc và chơi phân loại', 'Chơi bóng, đi bộ và vận động ngoài trời có giám sát'],
    meal_ideas: ['Cơm mềm với thịt/cá/trứng/đậu và rau', 'Sữa chua không quá ngọt, trái cây hoặc phô mai phù hợp làm bữa phụ', 'Nước lọc là đồ uống chính giữa các bữa'],
    product_focus: ['Sữa công thức số 3', 'Bữa phụ giàu dinh dưỡng', 'Sản phẩm chăm sóc răng miệng']
  },
  {
    key: 'preschool', min: 36, max: 72, label: '3–6 tuổi', title: 'Phát triển toàn diện',
    nutrition: 'Ăn theo bữa gia đình cân bằng; sữa số 4 hoặc sữa phù hợp lứa tuổi chỉ là phần bổ sung.',
    routine: 'Duy trì vận động hằng ngày, ngủ đủ, giới hạn màn hình và hình thành thói quen tự chăm sóc.',
    milestone: 'Theo dõi chiều cao, cân nặng, thị lực, răng miệng và kỹ năng hòa nhập trước tuổi học đường.',
    safety: 'Ưu tiên thực phẩm ít chế biến, hạn chế nước ngọt và không tự dùng sản phẩm tăng cân.',
    weekly_tasks: ['Chuẩn bị thực đơn gia đình cân bằng', 'Dành thời gian vận động ngoài trời mỗi ngày', 'Giới hạn màn hình và duy trì giờ ngủ', 'Cho bé tham gia một việc tự chăm sóc phù hợp'],
    daily_rhythm: 'Ba bữa chính, bữa phụ hợp lý, vận động tối thiểu mỗi ngày và ngủ đúng giờ.',
    tracking: ['Chiều cao và cân nặng', 'Thị lực và răng miệng', 'Khả năng giao tiếp và hòa nhập'],
    doctor_signs: ['Tăng hoặc giảm cân nhanh', 'Khó nhìn, khó nghe hoặc vận động khác thường'],
    checkpoints: [
      { age: '3–4 tuổi', focus: 'Tự chăm sóc cơ bản', detail: 'Tập tự ăn, mặc đồ đơn giản, dọn đồ chơi và nói rõ nhu cầu.' },
      { age: '4–5 tuổi', focus: 'Hợp tác và sáng tạo', detail: 'Chơi đóng vai, kể chuyện, vẽ và tham gia trò chơi có luật đơn giản.' },
      { age: '5–6 tuổi', focus: 'Sẵn sàng đi học', detail: 'Rèn nề nếp ngủ, tập trung theo lứa tuổi, tự phục vụ và giao tiếp với bạn.' }
    ],
    development: ['Nói câu dài hơn và kể lại sự việc đơn giản', 'Chơi cùng bạn, biết chờ lượt và làm theo quy tắc', 'Chạy, nhảy, ném bắt và phối hợp tay mắt tốt dần'],
    activities: ['Đọc truyện rồi cùng kể lại bằng tranh', 'Chơi ngoài trời, đạp xe hoặc trò chơi bóng', 'Cho bé phụ việc nhà an toàn và tự chuẩn bị đồ cá nhân'],
    meal_ideas: ['Bữa gia đình gồm tinh bột, đạm, rau và chất béo phù hợp', 'Trái cây nguyên miếng, sữa chua ít đường hoặc hạt chế biến an toàn', 'Bữa sáng đơn giản như trứng, bánh mì và trái cây'],
    product_focus: ['Sữa công thức số 4', 'Sữa chua và bữa phụ', 'Vitamin khi có chỉ định']
  },
  {
    key: 'school', min: 72, max: 144, label: '6–12 tuổi', title: 'Bền bỉ tuổi học đường',
    nutrition: 'Bữa sáng đầy đủ, đa dạng đạm – rau – tinh bột; chọn sữa theo nhu cầu thay vì theo số công thức.',
    routine: 'Kết hợp học tập với vận động ít nhất mỗi ngày, ngủ đúng giờ và uống đủ nước.',
    milestone: 'Theo dõi tăng trưởng, tư thế, thị lực, răng miệng và thay đổi tâm sinh lý theo tuổi.',
    safety: 'Không lạm dụng thực phẩm bổ sung; khám chuyên môn khi tăng trưởng lệch khỏi biểu đồ.',
    weekly_tasks: ['Chuẩn bị bữa sáng đủ chất trước khi đi học', 'Duy trì hoạt động thể lực hầu hết các ngày', 'Kiểm tra tư thế học và thời gian màn hình', 'Trao đổi với bé về giấc ngủ và cảm xúc trong tuần'],
    daily_rhythm: 'Ăn đủ bữa, vận động, học tập xen kẽ nghỉ mắt và ngủ theo giờ ổn định.',
    tracking: ['Tốc độ tăng chiều cao', 'Thị lực, tư thế và răng miệng', 'Giấc ngủ và tâm lý học đường'],
    doctor_signs: ['Tăng trưởng lệch rõ khỏi biểu đồ', 'Mệt kéo dài, mất ngủ hoặc thay đổi cảm xúc đáng kể'],
    checkpoints: [
      { age: '6–8 tuổi', focus: 'Thích nghi trường học', detail: 'Ổn định giờ ngủ, bữa sáng, tư thế học và thời gian vận động sau giờ học.' },
      { age: '9–10 tuổi', focus: 'Tự quản lý thói quen', detail: 'Cùng bé lập lịch học – chơi, chọn bữa phụ và nhận biết cảm xúc.' },
      { age: '11–12 tuổi', focus: 'Chuẩn bị dậy thì', detail: 'Trao đổi cởi mở về thay đổi cơ thể, vệ sinh cá nhân, giấc ngủ và hình ảnh bản thân.' }
    ],
    development: ['Khả năng tập trung, lập kế hoạch và tự chịu trách nhiệm tăng dần', 'Kỹ năng bạn bè và nhận biết cảm xúc trở nên quan trọng', 'Cơ thể có thể bắt đầu thay đổi theo dậy thì với nhịp độ riêng'],
    activities: ['Chọn môn vận động bé thích và duy trì đều', 'Cùng chuẩn bị một bữa ăn hoặc đọc nhãn thực phẩm', 'Duy trì thời gian trò chuyện riêng không có màn hình'],
    meal_ideas: ['Bữa sáng có tinh bột, đạm và trái cây', 'Bữa phụ như sữa/sữa chua ít đường, trái cây hoặc bánh kẹp nhỏ', 'Bữa chính đa dạng rau, đạm và tinh bột nguyên hạt khi có thể'],
    product_focus: ['Sữa tuổi học đường', 'Bữa sáng và bữa phụ', 'Vi chất theo đánh giá chuyên môn']
  }
];

const CONDITION_CARE = {
  CMPA: 'Dị ứng đạm sữa bò: không tự thử lại sữa thường. Trao đổi bác sĩ về sữa thủy phân hoàn toàn hoặc axit amin và đọc kỹ nhãn thực phẩm.',
  LACTOSE: 'Bất dung nạp lactose: xác định nguyên nhân với bác sĩ; chỉ chọn sản phẩm không lactose khi phù hợp và vẫn bảo đảm đủ canxi.',
  CONSTIPATION: 'Hay táo bón: tăng nước và chất xơ phù hợp độ tuổi, vận động đều; khám nếu đau bụng, nôn hoặc có máu trong phân.',
  UNDERWEIGHT: 'Nhẹ cân: theo dõi biểu đồ tăng trưởng, tăng mật độ năng lượng của bữa ăn và tránh tự dùng sản phẩm tăng cân thay bữa.',
  PREMATURE: 'Sinh non: theo dõi theo tuổi hiệu chỉnh trong 2 năm đầu và tái khám dinh dưỡng/phát triển theo lịch chuyên khoa.'
};

export const buildCareJourney = (baby) => {
  const matchedIndex = CARE_STAGES.findIndex((stage) => baby.age_months >= stage.min && baby.age_months < stage.max);
  const currentIndex = matchedIndex >= 0 ? matchedIndex : CARE_STAGES.length - 1;
  const current = CARE_STAGES[currentIndex] || CARE_STAGES[CARE_STAGES.length - 1];
  const span = Math.max(1, current.max - current.min);
  const progress = Math.min(100, Math.max(0, Math.round(((baby.age_months - current.min) / span) * 100)));
  return {
    current_stage: current.key,
    progress_percent: progress,
    next_milestone: CARE_STAGES[currentIndex + 1]
      ? `Còn khoảng ${Math.max(1, CARE_STAGES[currentIndex + 1].min - baby.age_months)} tháng đến giai đoạn ${CARE_STAGES[currentIndex + 1].label}.`
      : 'Tiếp tục duy trì thói quen dinh dưỡng và theo dõi tăng trưởng định kỳ.',
    personalized_notes: baby.conditions.map((code) => CONDITION_CARE[code]).filter(Boolean),
    stages: CARE_STAGES.map((stage, index) => ({
      ...stage,
      status: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'upcoming'
    })),
    disclaimer: 'Gợi ý mang tính hỗ trợ chăm sóc, không thay thế chẩn đoán hoặc phác đồ của bác sĩ.'
  };
};

export const describeBaby = (baby, today) => {
  const months = ageInMonths(baby.birth_date, today);
  const conditions = parseConditions(baby.conditions);
  return {
    ...baby,
    conditions,
    condition_labels: conditions.map((code) => CONDITIONS[code]),
    age_months: months,
    age_text: formatAge(months),
    formula_stage: formulaStage(months),
    diaper_size: diaperSize(baby.weight_kg)
  };
};

// Cảnh báo khi mua sản phẩm cho bé. danger = không nên dùng; warn = cần cân nhắc.
export const checkProductForBaby = (product, baby) => {
  if (product.audience && product.audience !== 'CHILD') return [];
  const warnings = [];
  const months = baby.age_months;
  const min = product.stage_min_months;
  const max = product.stage_max_months;
  if (min !== null && min !== undefined && months < Number(min)) {
    warnings.push({ type: 'AGE', level: 'danger', message: `Sản phẩm dành cho trẻ từ ${formatStageAge(Number(min))}, bé ${baby.name} mới ${formatAge(months)}.` });
  } else if (max !== null && max !== undefined && months >= Number(max)) {
    warnings.push({ type: 'AGE', level: 'warn', message: `Sản phẩm dành cho trẻ dưới ${formatStageAge(Number(max))}, bé ${baby.name} đã ${formatAge(months)}; nên chuyển sang giai đoạn ${baby.formula_stage.label}.` });
  }
  if (baby.conditions.includes('CMPA') && !Number(product.cmpa_safe)) {
    warnings.push({ type: 'CMPA', level: 'danger', message: `Bé ${baby.name} dị ứng đạm sữa bò: sản phẩm này có đạm sữa thông thường. Hãy hỏi bác sĩ về sữa thủy phân hoàn toàn hoặc sữa axit amin.` });
  }
  if (baby.conditions.includes('LACTOSE') && !Number(product.lactose_free)) {
    warnings.push({ type: 'LACTOSE', level: 'danger', message: `Bé ${baby.name} bất dung nạp lactose: sản phẩm này có lactose.` });
  }
  return warnings;
};

const CONDITION_HINTS = {
  CONSTIPATION: { pattern: /táo bón|tiêu hóa|tiêu hoá|chất xơ|hmo|fos|gos|lợi khuẩn|probiotic|men vi sinh/i, reason: 'hỗ trợ tiêu hóa' },
  UNDERWEIGHT: { pattern: /tăng cân|năng lượng|cân nặng|chiều cao|pediasure|grow/i, reason: 'hỗ trợ tăng cân' },
  PREMATURE: { pattern: /sinh non|nhẹ cân|dha|não|miễn dịch|đề kháng/i, reason: 'bổ sung DHA, miễn dịch' }
};

// Gợi ý: đúng giai đoạn tuổi, còn hàng, không có cảnh báo; ưu tiên sản phẩm hợp cơ địa.
export const recommendForBaby = (products, baby, limit = 8) =>
  products
    .filter((p) => (p.audience || 'CHILD') === 'CHILD' && Number(p.stock) > 0)
    // Trang hồ sơ cam kết gợi ý theo đúng số/giai đoạn, không chỉ là khoảng tuổi có giao nhau.
    // Ví dụ bé 9 tháng ở giai đoạn Số 2 (6–12 tháng) không nhận sữa Số 1 hoặc dòng 0–12 tháng.
    .filter((p) => Number(p.stage_min_months) === baby.formula_stage.min
      && Number(p.stage_max_months) === baby.formula_stage.max)
    .filter((p) => checkProductForBaby(p, baby).length === 0)
    .map((p) => {
      const text = `${p.name} ${p.benefits || ''} ${p.short_description || ''}`;
      const reasons = [`hợp ${baby.age_text}`];
      let score = p.stage_max_months !== null && p.stage_max_months !== undefined ? 2 : 1;
      for (const code of baby.conditions) {
        const hint = CONDITION_HINTS[code];
        if (hint && hint.pattern.test(text)) {
          score += 3;
          reasons.push(hint.reason);
        }
      }
      return { ...p, match_score: score, match_reasons: reasons };
    })
    .sort((a, b) => b.match_score - a.match_score || b.id - a.id)
    .slice(0, limit);

// Nhắc mua lại: ngày hết = ngày đơn hoàn thành + usage_days × số lượng.
// Chỉ xét lần mua gần nhất; bỏ qua nếu đơn gần nhất chưa hoàn thành (đang giao) hoặc đã hết quá lâu.
export const REMIND_BEFORE_DAYS = 3;
export const REMIND_AFTER_DAYS = 14;

export const replenishmentDue = (purchases, today) => {
  const dayNumber = (value) => {
    const [y, m, d] = parts(value);
    return Date.UTC(y, m - 1, d) / 86400000;
  };
  const latest = new Map();
  for (const row of purchases) {
    const current = latest.get(row.product_id);
    if (!current || String(row.ordered_at) > String(current.ordered_at)) latest.set(row.product_id, row);
  }
  const due = [];
  for (const row of latest.values()) {
    if (row.order_status !== 'COMPLETED' || !row.completed_at) continue;
    const coverDays = Number(row.usage_days) * Number(row.quantity);
    const runOutDay = dayNumber(row.completed_at) + coverDays;
    const daysLeft = runOutDay - dayNumber(today);
    // Đã hết quá lâu (lâu hơn chính thời gian dùng, tối đa 14 ngày) thì coi như khách không dùng tiếp, thôi nhắc.
    const staleAfter = Math.min(REMIND_AFTER_DAYS, Math.max(REMIND_BEFORE_DAYS, coverDays));
    if (daysLeft > REMIND_BEFORE_DAYS || daysLeft < -staleAfter) continue;
    const runOut = new Date(runOutDay * 86400000).toISOString().slice(0, 10);
    due.push({ ...row, run_out_date: runOut, days_left: daysLeft });
  }
  return due.sort((a, b) => a.days_left - b.days_left);
};
