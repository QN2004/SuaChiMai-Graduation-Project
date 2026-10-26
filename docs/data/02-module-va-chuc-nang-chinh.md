# Xác định các module và chức năng chính của hệ thống Sữa Chi Mai

## 1. Giới thiệu

Trong tài liệu này, “module” được hiểu đơn giản là một nhóm chức năng cùng phục vụ một mục đích. Ví dụ, đăng ký, đăng nhập và cập nhật hồ sơ được xếp chung vào nhóm “Tài khoản khách hàng”.

Việc chia thành các nhóm giúp người đọc dễ hình dung Sữa Chi Mai gồm những phần nào, mỗi phần giải quyết công việc gì và dành cho ai.

## 2. Danh sách các module chính

| STT | Module | Mục đích |
|---:|---|---|
| 1 | Cửa hàng trực tuyến | Giới thiệu cửa hàng và giúp khách tiếp cận sản phẩm. |
| 2 | Tài khoản khách hàng | Quản lý đăng ký, đăng nhập và thông tin cá nhân. |
| 3 | Sản phẩm và tìm kiếm | Giúp khách tìm, lọc và xem sản phẩm. |
| 4 | Giỏ hàng | Lưu các sản phẩm khách dự định mua. |
| 5 | Đặt hàng và thanh toán | Thu thập thông tin giao hàng và tạo đơn. |
| 6 | Theo dõi đơn hàng | Giúp khách và cửa hàng theo dõi quá trình xử lý đơn. |
| 7 | Đánh giá sản phẩm | Thu thập nhận xét từ khách đã mua hàng. |
| 8 | Liên hệ và tư vấn | Tiếp nhận nhu cầu hỗ trợ trực tiếp từ khách. |
| 9 | Trợ lý AI “Mai” | Tư vấn sản phẩm và hỗ trợ khách qua hội thoại. |
| 10 | Quản lý cửa hàng | Quản lý nội dung, khách hàng và hoạt động bán hàng. |
| 11 | Thống kê và báo cáo | Cung cấp số liệu tổng quan cho người quản lý. |
| 12 | Quản lý dữ liệu và vận hành | Đảm bảo thông tin được lưu giữ và hệ thống hoạt động ổn định. |

## 3. Mô tả chi tiết các module

### Module 1. Cửa hàng trực tuyến

**Mục đích:** Đây là khu vực đầu tiên khách nhìn thấy khi truy cập Sữa Chi Mai, giúp khách hiểu cửa hàng cung cấp gì và nhanh chóng đi đến sản phẩm cần tìm.

**Chức năng:**

- Hiển thị trang chủ và thông tin giới thiệu cửa hàng.
- Trình bày sản phẩm nổi bật, sản phẩm mới và sản phẩm bán chạy.
- Cung cấp menu tới sản phẩm, giỏ hàng, liên hệ và tài khoản.
- Hiển thị thông tin liên hệ của cửa hàng.
- Đặt biểu tượng trợ lý AI ở vị trí dễ sử dụng.

**Người sử dụng:** Tất cả khách truy cập website.

### Module 2. Tài khoản khách hàng

**Mục đích:** Nhận biết khách hàng, bảo vệ thông tin cá nhân và liên kết đơn hàng với đúng người mua.

**Chức năng:**

- Đăng ký tài khoản mới.
- Đăng nhập và đăng xuất.
- Kiểm tra tài khoản có đang được phép hoạt động hay không.
- Xem và cập nhật họ tên, số điện thoại, địa chỉ.
- Yêu cầu đăng nhập trước khi thanh toán hoặc xem đơn hàng.

**Quy tắc:** Mỗi email chỉ dùng cho một tài khoản; tài khoản bị khóa không được đăng nhập; khách chỉ xem thông tin của mình.

### Module 3. Sản phẩm và tìm kiếm

**Mục đích:** Giúp khách hiểu sản phẩm và lựa chọn loại sữa phù hợp.

**Chức năng:**

- Hiển thị danh sách sản phẩm đang bán.
- Tìm theo tên hoặc thương hiệu.
- Lọc theo danh mục, thương hiệu và khoảng giá.
- Sắp xếp theo sản phẩm mới hoặc giá bán.
- Xem hình ảnh, giá, giá khuyến mãi và tình trạng còn hàng.
- Xem độ tuổi, xuất xứ, khối lượng, thành phần, lợi ích và cách dùng.
- Xem đánh giá và sản phẩm liên quan.

**Người sử dụng:** Tất cả khách truy cập; nhân viên cập nhật nội dung.

### Module 4. Giỏ hàng

**Mục đích:** Tập hợp các sản phẩm khách muốn mua trước khi tạo đơn.

**Chức năng:**

- Thêm sản phẩm từ trang sản phẩm hoặc trợ lý AI.
- Hiển thị sản phẩm, đơn giá, số lượng và thành tiền.
- Tăng, giảm số lượng hoặc xóa sản phẩm.
- Xóa toàn bộ giỏ hàng.
- Tính tổng số lượng và tổng tiền tạm tính.
- Giữ lại giỏ khi khách tải lại trang trên cùng thiết bị.

**Quy tắc:** Không thêm sản phẩm hết hàng; số lượng không vượt quá tồn kho.

### Module 5. Đặt hàng và thanh toán

**Mục đích:** Chuyển các sản phẩm trong giỏ thành một đơn mua hàng chính thức.

**Chức năng:**

- Lấy sẵn thông tin nhận hàng từ hồ sơ.
- Cho phép chỉnh người nhận, số điện thoại và địa chỉ.
- Cho phép thêm ghi chú.
- Chọn trả tiền khi nhận hàng hoặc chuyển khoản.
- Hiển thị mã QR khi chọn chuyển khoản.
- Kiểm tra lại danh sách sản phẩm và tổng tiền.
- Tạo đơn và chuyển khách tới trang chi tiết.

**Người sử dụng:** Khách hàng đã đăng nhập.

**Quy tắc:** Hệ thống kiểm tra lại giá và tồn kho; chuyển khoản hiện vẫn cần cửa hàng đối soát để xác nhận.

### Module 6. Theo dõi đơn hàng

**Mục đích:** Giúp khách biết đơn đang ở giai đoạn nào và giúp cửa hàng kiểm soát quá trình xử lý.

**Chức năng dành cho khách:**

- Xem toàn bộ đơn hàng của mình.
- Xem sản phẩm, số lượng, tổng tiền và thông tin nhận hàng.
- Xem trạng thái xử lý và thanh toán.
- Hủy đơn khi cửa hàng chưa xác nhận.

**Chức năng dành cho cửa hàng:**

- Xem, tìm kiếm và lọc đơn hàng.
- Xác nhận, chuẩn bị, chuyển giao hoặc hoàn thành đơn.
- Cập nhật trạng thái thanh toán.
- Hủy đơn khi cần thiết.

| Trạng thái | Ý nghĩa |
|---|---|
| Chờ xác nhận | Cửa hàng chưa tiếp nhận xử lý. |
| Đã xác nhận | Cửa hàng đã nhận và đang chuẩn bị. |
| Đang giao | Đơn đang được chuyển tới khách. |
| Hoàn thành | Khách đã nhận hàng. |
| Đã hủy | Đơn không tiếp tục được xử lý. |

**Quy tắc:** Khách chỉ xem đơn của mình, chỉ được tự hủy đơn chờ xác nhận và hàng phải được hoàn kho khi hủy.

### Module 7. Đánh giá sản phẩm

**Mục đích:** Tạo nguồn tham khảo từ trải nghiệm mua hàng thực tế và giúp cửa hàng tiếp nhận phản hồi.

**Chức năng:**

- Xem nhận xét của người mua trước.
- Chấm từ 1 đến 5 sao và để lại bình luận.
- Cho phép cửa hàng hiển thị, ẩn hoặc xóa đánh giá.

**Quy tắc:** Chỉ khách đã mua trong đơn hoàn thành mới được đánh giá; mỗi khách đánh giá một sản phẩm một lần.

### Module 8. Liên hệ và tư vấn

**Mục đích:** Cung cấp kênh để khách gửi câu hỏi hoặc yêu cầu hỗ trợ trực tiếp.

**Chức năng:**

- Khách nhập họ tên, số điện thoại, email và nội dung.
- Cửa hàng nhận danh sách yêu cầu mới.
- Nhân viên đánh dấu đã đọc hoặc đã phản hồi.
- Nhân viên lưu nội dung và thời gian phản hồi.

**Người sử dụng:** Tất cả khách truy cập và nhân viên quản trị.

### Module 9. Trợ lý AI “Mai”

**Mục đích:** Giúp khách tìm thông tin bằng cách trò chuyện tự nhiên thay vì phải tự mở nhiều trang.

**Chức năng:**

- Chào hỏi và giới thiệu khả năng hỗ trợ.
- Trả lời về sản phẩm, giá, cách sử dụng và chính sách cửa hàng.
- Tư vấn theo độ tuổi và nhu cầu chung.
- Hỏi thêm khi chưa đủ thông tin.
- Tìm sản phẩm tương tự từ ảnh.
- Hiển thị sản phẩm để xem chi tiết hoặc thêm vào giỏ.
- So sánh nhiều sản phẩm trong một bảng.
- Hỗ trợ khách đã đăng nhập tra cứu đơn hàng.
- Gợi ý câu hỏi tiếp theo.
- Từ chối lịch sự câu hỏi ngoài phạm vi.

**Nhóm câu hỏi được hỗ trợ:** sản phẩm và giá; độ tuổi và dinh dưỡng; pha và bảo quản; thành phần và dị ứng; giao hàng và đơn hàng; đổi trả; thông tin cửa hàng.

**Quy tắc:** Trợ lý không tự tạo thông tin, tra cứu đơn phải đăng nhập và trợ lý không thay thế bác sĩ.

### Module 10. Quản lý cửa hàng

**Mục đích:** Giúp nhân viên cập nhật nội dung và điều hành công việc hằng ngày ở một nơi.

**Chức năng quản lý nội dung:**

- Thêm, sửa, xóa danh mục và thương hiệu.
- Thêm, sửa, ẩn, xóa sản phẩm.
- Cập nhật giá, giá giảm, tồn kho và mô tả.
- Tải hình ảnh cho nội dung cửa hàng.

**Chức năng quản lý hoạt động:**

- Xử lý đơn hàng và thanh toán.
- Khóa hoặc mở tài khoản khách hàng.
- Kiểm duyệt đánh giá.
- Tiếp nhận và phản hồi liên hệ.

**Người sử dụng:** Chỉ nhân viên có quyền quản trị.

### Module 11. Thống kê và báo cáo

**Mục đích:** Giúp người quản lý nhanh chóng nắm tình hình cửa hàng.

**Chức năng:**

- Tổng số sản phẩm, danh mục và thương hiệu.
- Số khách hàng và số đơn hàng.
- Số đơn đang chờ xử lý.
- Doanh thu từ các đơn hoàn thành.
- Các đơn hàng mới nhất.
- Cảnh báo sản phẩm sắp hết hàng.
- Doanh thu theo tháng.
- Các sản phẩm bán chạy.

**Lợi ích:** Người quản lý nhận biết nhanh tình hình bán hàng, nhu cầu nhập thêm hàng và công việc cần ưu tiên.

### Module 12. Quản lý dữ liệu và vận hành

**Mục đích:** Đảm bảo thông tin cửa hàng được lưu giữ và hệ thống hoạt động ổn định.

**Các nhóm thông tin cần lưu:**

- Tài khoản và hồ sơ khách hàng.
- Danh mục, thương hiệu và sản phẩm.
- Giá bán và tồn kho.
- Đơn hàng và sản phẩm trong đơn.
- Đánh giá của khách.
- Yêu cầu liên hệ và phản hồi.

**Yêu cầu vận hành:**

- Dữ liệu không bị mất khi hệ thống khởi động lại.
- Có dữ liệu ban đầu để cửa hàng bắt đầu sử dụng.
- Hình ảnh sản phẩm được lưu và hiển thị ổn định.
- Thông tin bí mật được bảo vệ.
- Có phương án sao lưu và khôi phục khi triển khai thực tế.

## 4. Mối liên hệ giữa các module

| Module bắt đầu | Module liên quan | Mối liên hệ |
|---|---|---|
| Sản phẩm | Giỏ hàng | Khách thêm sản phẩm đang xem vào giỏ. |
| Giỏ hàng | Đặt hàng | Sản phẩm trong giỏ trở thành nội dung đơn hàng. |
| Tài khoản | Đặt hàng | Khách phải đăng nhập để tạo đơn. |
| Đặt hàng | Theo dõi đơn | Đơn vừa tạo xuất hiện trong danh sách của khách và cửa hàng. |
| Theo dõi đơn | Đánh giá | Đơn hoàn thành là điều kiện để khách đánh giá. |
| Trợ lý AI | Sản phẩm | Trợ lý tìm, tư vấn và so sánh sản phẩm. |
| Trợ lý AI | Giỏ hàng | Khách có thể thêm sản phẩm từ kết quả tư vấn. |
| Trợ lý AI | Theo dõi đơn | Khách đăng nhập có thể hỏi về đơn hàng của mình. |
| Quản lý cửa hàng | Các nhóm nghiệp vụ | Nhân viên duy trì nội dung và xử lý hoạt động phát sinh. |
| Thống kê | Sản phẩm và đơn hàng | Báo cáo được tổng hợp từ hoạt động bán hàng. |

## 5. Phân chia trách nhiệm

### Khách hàng

- Cung cấp thông tin tài khoản và nhận hàng chính xác.
- Kiểm tra sản phẩm, số lượng và tổng tiền trước khi đặt.
- Sử dụng đúng tài khoản để xem đơn hàng.
- Đánh giá trung thực sản phẩm đã mua.

### Nhân viên cửa hàng

- Cập nhật thông tin, giá và tồn kho sản phẩm.
- Xử lý đơn đúng trạng thái thực tế.
- Xác nhận thanh toán và giao hàng.
- Phản hồi yêu cầu tư vấn và kiểm duyệt nội dung.

### Hệ thống

- Bảo vệ thông tin khách hàng.
- Kiểm tra quyền sử dụng.
- Tính giá và tồn kho chính xác.
- Lưu các hoạt động mua bán quan trọng.
- Chỉ hiển thị dữ liệu phù hợp cho từng người dùng.

### Trợ lý AI

- Hiểu câu hỏi và chọn đúng nhóm hỗ trợ.
- Trả lời dựa trên thông tin của cửa hàng.
- Hỏi thêm khi chưa đủ thông tin.
- Không tự tạo thông tin và không chẩn đoán y khoa.

## 6. Hướng phát triển trong tương lai

- Xác nhận thanh toán trực tuyến tự động.
- Kết nối đơn vị vận chuyển và theo dõi hành trình giao hàng.
- Áp dụng mã giảm giá và chương trình tích điểm.
- Đồng bộ giỏ hàng trên nhiều thiết bị.
- Quản lý nhà cung cấp, nhập hàng, lô sản phẩm và hạn sử dụng.
- Gửi thông báo qua email hoặc tin nhắn.
- Quản lý nhiều cửa hàng hoặc nhiều kho.
- Lưu lịch sử các thay đổi quan trọng của nhân viên.

## 7. Kết luận

Các module của Sữa Chi Mai được tổ chức theo toàn bộ hành trình mua hàng: khách tìm sản phẩm, nhận tư vấn, thêm giỏ, đặt hàng, theo dõi và đánh giá; trong khi cửa hàng quản lý nội dung, xử lý đơn và xem báo cáo. Cách phân chia này giúp người không am hiểu kỹ thuật vẫn hiểu được vai trò của từng phần và mối quan hệ giữa chúng.

