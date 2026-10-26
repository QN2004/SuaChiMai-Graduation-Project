# Tìm hiểu và phân tích yêu cầu hệ thống Sữa Chi Mai

## 1. Giới thiệu

Sữa Chi Mai là hệ thống bán sữa trực tuyến, giúp khách hàng tìm hiểu sản phẩm, lựa chọn loại sữa phù hợp, đặt hàng và theo dõi đơn hàng. Hệ thống đồng thời giúp cửa hàng quản lý sản phẩm, khách hàng, đơn hàng và các yêu cầu tư vấn.

Tài liệu này trình bày hệ thống dưới góc nhìn của người sử dụng và người quản lý cửa hàng. Người đọc không cần có kiến thức về công nghệ thông tin.

## 2. Mục tiêu của hệ thống

- Giúp khách hàng mua sữa trực tuyến thuận tiện và dễ hiểu.
- Cung cấp đủ thông tin để khách lựa chọn sản phẩm phù hợp.
- Giúp khách theo dõi quá trình xử lý đơn hàng.
- Tạo thêm kênh tư vấn nhanh thông qua trợ lý AI.
- Giúp cửa hàng quản lý sản phẩm, tồn kho và đơn hàng tập trung.
- Giúp người quản lý theo dõi tình hình bán hàng và phản hồi của khách.

## 3. Những người sử dụng hệ thống

### 3.1. Khách chưa đăng nhập

Khách chưa đăng nhập có thể:

- Xem, tìm kiếm và lọc sản phẩm.
- Xem thông tin chi tiết và đánh giá sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Hỏi trợ lý AI về sản phẩm hoặc chính sách cửa hàng.
- Gửi yêu cầu liên hệ và tư vấn.
- Đăng ký hoặc đăng nhập tài khoản.

Khách cần đăng nhập trước khi đặt hàng hoặc xem thông tin đơn hàng cá nhân.

### 3.2. Khách hàng đã đăng nhập

Khách hàng đã đăng nhập có thể:

- Cập nhật thông tin cá nhân và địa chỉ nhận hàng.
- Đặt hàng và lựa chọn phương thức thanh toán.
- Xem danh sách và chi tiết đơn hàng của mình.
- Hủy đơn khi đơn vẫn đang chờ cửa hàng xác nhận.
- Tra cứu đơn hàng qua trợ lý AI.
- Đánh giá sản phẩm đã mua và đã nhận hàng.

### 3.3. Nhân viên quản trị

Nhân viên quản trị có thể:

- Quản lý danh mục, thương hiệu và sản phẩm.
- Theo dõi tồn kho và cập nhật thông tin bán hàng.
- Tiếp nhận và xử lý đơn hàng.
- Cập nhật trạng thái đơn hàng và thanh toán.
- Quản lý tài khoản khách hàng.
- Kiểm duyệt đánh giá sản phẩm.
- Tiếp nhận và phản hồi yêu cầu tư vấn.
- Xem các số liệu tổng quan về hoạt động bán hàng.

## 4. Các quy trình sử dụng chính

### 4.1. Tìm và mua sản phẩm

1. Khách truy cập cửa hàng và xem danh sách sản phẩm.
2. Khách tìm kiếm hoặc lọc theo thương hiệu, danh mục hay khoảng giá.
3. Khách xem thông tin chi tiết của sản phẩm.
4. Khách chọn số lượng và thêm sản phẩm vào giỏ hàng.
5. Khách kiểm tra lại giỏ hàng.
6. Khách đăng nhập nếu chưa có phiên đăng nhập.
7. Khách nhập thông tin nhận hàng và chọn cách thanh toán.
8. Hệ thống kiểm tra giá bán và số lượng còn lại.
9. Đơn hàng được tạo và chuyển sang trạng thái chờ xác nhận.

### 4.2. Xử lý đơn hàng

1. Cửa hàng nhận được đơn mới.
2. Nhân viên kiểm tra và xác nhận đơn.
3. Đơn được chuẩn bị và chuyển sang giai đoạn giao hàng.
4. Sau khi khách nhận hàng, đơn được đánh dấu hoàn thành.
5. Nếu đơn bị hủy, số lượng hàng được hoàn lại vào kho.

Các trạng thái chính gồm: chờ xác nhận, đã xác nhận, đang giao, hoàn thành và đã hủy.

### 4.3. Tư vấn bằng trợ lý AI

1. Khách nhập câu hỏi hoặc gửi ảnh sản phẩm.
2. Trợ lý nhận biết nội dung khách đang quan tâm.
3. Trợ lý tìm thông tin phù hợp từ sản phẩm, tài liệu cửa hàng hoặc đơn hàng cá nhân.
4. Trợ lý trả lời ngắn gọn và hiển thị sản phẩm, bảng so sánh hoặc đơn hàng khi cần.
5. Khách có thể xem chi tiết, thêm sản phẩm vào giỏ hoặc hỏi tiếp.

### 4.4. Đánh giá sản phẩm

1. Khách hoàn tất đơn hàng có sản phẩm cần đánh giá.
2. Khách chấm điểm từ 1 đến 5 sao và viết nhận xét.
3. Hệ thống kiểm tra khách đã mua sản phẩm hay chưa.
4. Đánh giá được lưu và có thể được cửa hàng kiểm duyệt.

## 5. Danh sách yêu cầu chức năng

### 5.1. Tài khoản khách hàng

| Mã | Yêu cầu |
|---|---|
| YC-01 | Khách có thể đăng ký bằng họ tên, email, số điện thoại và mật khẩu. |
| YC-02 | Hai tài khoản không được sử dụng cùng một email. |
| YC-03 | Khách có thể đăng nhập và đăng xuất. |
| YC-04 | Tài khoản bị khóa không được phép đăng nhập. |
| YC-05 | Khách có thể xem và cập nhật họ tên, số điện thoại, địa chỉ. |
| YC-06 | Khu vực cá nhân, thanh toán và đơn hàng chỉ dành cho người đã đăng nhập. |

### 5.2. Sản phẩm

| Mã | Yêu cầu |
|---|---|
| YC-07 | Khách có thể xem danh sách sản phẩm đang bán. |
| YC-08 | Khách có thể tìm sản phẩm theo tên hoặc thương hiệu. |
| YC-09 | Khách có thể lọc theo danh mục, thương hiệu và khoảng giá. |
| YC-10 | Khách có thể sắp xếp sản phẩm theo thời gian hoặc giá bán. |
| YC-11 | Mỗi sản phẩm có tên, hình ảnh, giá, tình trạng còn hàng và mô tả. |
| YC-12 | Thông tin chi tiết có thể gồm độ tuổi, xuất xứ, khối lượng, thành phần, lợi ích và cách dùng. |
| YC-13 | Hệ thống hiển thị sản phẩm nổi bật, sản phẩm mới và sản phẩm bán chạy. |
| YC-14 | Trang chi tiết hiển thị thêm các sản phẩm có liên quan. |

### 5.3. Giỏ hàng

| Mã | Yêu cầu |
|---|---|
| YC-15 | Khách có thể thêm sản phẩm còn hàng vào giỏ. |
| YC-16 | Khách có thể thay đổi số lượng hoặc xóa sản phẩm khỏi giỏ. |
| YC-17 | Số lượng trong giỏ không được vượt quá số lượng còn trong kho. |
| YC-18 | Hệ thống tự tính tổng số lượng và tổng tiền tạm tính. |
| YC-19 | Giỏ hàng vẫn được giữ khi khách tải lại trang trên cùng thiết bị. |

### 5.4. Đặt hàng và thanh toán

| Mã | Yêu cầu |
|---|---|
| YC-20 | Chỉ khách đã đăng nhập mới được đặt hàng. |
| YC-21 | Khách phải cung cấp người nhận, số điện thoại và địa chỉ giao hàng. |
| YC-22 | Khách có thể thêm ghi chú cho đơn hàng. |
| YC-23 | Khách có thể chọn trả tiền khi nhận hàng hoặc chuyển khoản. |
| YC-24 | Khi chọn chuyển khoản, hệ thống hiển thị mã QR và thông tin thanh toán. |
| YC-25 | Trước khi tạo đơn, hệ thống kiểm tra lại giá và số lượng hàng. |
| YC-26 | Khi đặt hàng thành công, số lượng sản phẩm được trừ khỏi kho. |
| YC-27 | Sau khi đặt hàng, khách được chuyển tới trang chi tiết đơn. |

### 5.5. Theo dõi và quản lý đơn hàng

| Mã | Yêu cầu |
|---|---|
| YC-28 | Khách hàng chỉ được xem các đơn hàng của chính mình. |
| YC-29 | Khách có thể xem mã đơn, ngày đặt, sản phẩm, tổng tiền, thanh toán và trạng thái. |
| YC-30 | Khách có thể hủy đơn khi đơn vẫn đang chờ xác nhận. |
| YC-31 | Khi hủy đơn, số lượng hàng được hoàn lại kho. |
| YC-32 | Nhân viên có thể tìm kiếm và lọc danh sách đơn hàng. |
| YC-33 | Nhân viên có thể cập nhật trạng thái xử lý và thanh toán. |
| YC-34 | Hệ thống giữ chính xác số lượng hàng khi đơn bị hủy hoặc khôi phục. |

### 5.6. Đánh giá sản phẩm

| Mã | Yêu cầu |
|---|---|
| YC-35 | Khách có thể xem các đánh giá đã được chấp nhận. |
| YC-36 | Khách chỉ được đánh giá sản phẩm đã mua trong đơn hoàn thành. |
| YC-37 | Mức đánh giá từ 1 đến 5 sao. |
| YC-38 | Mỗi khách chỉ được đánh giá một lần cho mỗi sản phẩm. |
| YC-39 | Nhân viên có thể hiển thị, ẩn hoặc xóa đánh giá. |

### 5.7. Liên hệ và tư vấn

| Mã | Yêu cầu |
|---|---|
| YC-40 | Khách có thể gửi yêu cầu tư vấn bằng họ tên, số điện thoại và nội dung. |
| YC-41 | Email trong biểu mẫu liên hệ là thông tin không bắt buộc. |
| YC-42 | Nhân viên có thể phân loại yêu cầu mới, đã đọc, đã phản hồi. |
| YC-43 | Nhân viên có thể lưu nội dung và thời gian phản hồi khách. |

### 5.8. Trợ lý AI

| Mã | Yêu cầu |
|---|---|
| YC-44 | Trợ lý trả lời câu hỏi về sản phẩm, giá và chính sách cửa hàng. |
| YC-45 | Trợ lý tư vấn theo độ tuổi và nhu cầu dinh dưỡng chung. |
| YC-46 | Trợ lý trả lời về cách sử dụng, pha, bảo quản và thành phần. |
| YC-47 | Trợ lý tìm sản phẩm tương tự từ ảnh khách gửi. |
| YC-48 | Trợ lý hiển thị sản phẩm để khách xem hoặc thêm vào giỏ. |
| YC-49 | Trợ lý có thể tạo bảng so sánh nhiều sản phẩm. |
| YC-50 | Khách đã đăng nhập có thể tra cứu đơn hàng qua trợ lý. |
| YC-51 | Trợ lý chỉ hiển thị đơn hàng thuộc tài khoản đang đăng nhập. |
| YC-52 | Trợ lý đưa ra câu hỏi gợi ý để khách tiếp tục hội thoại. |
| YC-53 | Câu hỏi không liên quan được từ chối lịch sự và hướng về phạm vi cửa hàng. |

### 5.9. Quản trị cửa hàng

| Mã | Yêu cầu |
|---|---|
| YC-54 | Nhân viên có thể thêm, sửa, xóa danh mục và thương hiệu. |
| YC-55 | Nhân viên có thể thêm, sửa, ẩn và xóa sản phẩm. |
| YC-56 | Nhân viên có thể cập nhật giá, giá khuyến mãi và tồn kho. |
| YC-57 | Nhân viên có thể tải hình ảnh cho nội dung cửa hàng. |
| YC-58 | Nhân viên có thể khóa hoặc mở tài khoản khách hàng. |
| YC-59 | Nhân viên có thể xem tổng quan sản phẩm, khách hàng và đơn hàng. |
| YC-60 | Hệ thống hiển thị doanh thu của các đơn đã hoàn thành. |
| YC-61 | Hệ thống cảnh báo sản phẩm có số lượng tồn kho thấp. |

## 6. Yêu cầu phi chức năng

Đây là các yêu cầu về chất lượng sử dụng, không phải một thao tác riêng lẻ.

### 6.1. Dễ sử dụng

- Giao diện rõ ràng, sử dụng tiếng Việt và phù hợp với khách hàng phổ thông.
- Giá, tình trạng hàng và nút mua dễ nhận biết.
- Biểu mẫu thông báo rõ trường còn thiếu hoặc dữ liệu không hợp lệ.
- Giao diện sử dụng được trên máy tính và màn hình nhỏ.
- Trợ lý AI trả lời ngắn gọn, dễ đọc và trình bày thoáng.

### 6.2. An toàn và riêng tư

- Mật khẩu khách hàng phải được bảo vệ.
- Khách chỉ được xem hồ sơ và đơn hàng của mình.
- Chỉ nhân viên quản trị mới được dùng chức năng quản trị.
- Thông tin đơn hàng cá nhân không được cung cấp cho người chưa đăng nhập.
- Thông tin bí mật của hệ thống không được hiển thị cho người dùng.

### 6.3. Chính xác và toàn vẹn

- Giá và tồn kho được kiểm tra lại tại thời điểm đặt hàng.
- Không tạo đơn nếu sản phẩm ngừng bán hoặc không đủ hàng.
- Việc tạo, hủy và đổi trạng thái đơn không được làm sai tồn kho.
- Doanh thu chỉ tính từ đơn đã hoàn thành.
- Dữ liệu do trợ lý AI lựa chọn được kiểm tra lại trước khi hiển thị.

### 6.4. Tốc độ và ổn định

- Danh sách sản phẩm được chia thành từng trang để dễ tải và dễ xem.
- Hệ thống có thông báo khi đang xử lý hoặc xảy ra lỗi.
- Nếu trợ lý AI tạm thời không phản hồi, khách nhận được thông báo dễ hiểu.
- Dữ liệu bán hàng được giữ lại khi hệ thống khởi động lại.

### 6.5. Khả năng mở rộng

- Các nhóm chức năng được tách rõ để thuận tiện sửa đổi.
- Có thể bổ sung thanh toán, vận chuyển hoặc chương trình khách hàng thân thiết.
- Dữ liệu và cấu hình quan trọng cần được sao lưu và quản lý an toàn.

## 7. Các quy tắc kinh doanh quan trọng

1. Giá khuyến mãi được ưu tiên khi sản phẩm đang giảm giá.
2. Khách không thể đặt số lượng lớn hơn số lượng còn trong kho.
3. Đơn mới bắt đầu ở trạng thái chờ xác nhận và chưa thanh toán.
4. Khách chỉ được tự hủy đơn đang chờ xác nhận.
5. Hủy đơn phải hoàn lại số lượng sản phẩm vào kho.
6. Chỉ đơn hoàn thành mới được tính vào doanh thu và số lượng bán.
7. Khách chỉ được đánh giá sản phẩm đã mua và đã nhận.
8. Mỗi khách chỉ được đánh giá một sản phẩm một lần.
9. Trợ lý AI không được tự tạo giá, sản phẩm hoặc đơn hàng không tồn tại.
10. Tra cứu đơn hàng luôn yêu cầu khách đăng nhập.

## 8. Những nội dung chưa có trong phiên bản hiện tại

- Thanh toán trực tuyến được ngân hàng xác nhận tự động.
- Theo dõi vị trí giao hàng theo thời gian thực.
- Mã giảm giá, tích điểm và hạng thành viên.
- Quản lý nhiều cửa hàng hoặc nhiều kho.
- Quản lý nhà cung cấp, lô hàng và hạn sử dụng.
- Gửi thông báo tự động qua email hoặc tin nhắn.
- Khôi phục mật khẩu bằng mã xác nhận.
- Hỗ trợ nhiều ngôn ngữ và nhiều loại tiền tệ.

## 9. Kết luận

Sữa Chi Mai đáp ứng chu trình bán hàng cơ bản từ giới thiệu sản phẩm, tư vấn, giỏ hàng, đặt hàng đến theo dõi và quản lý sau bán. Điểm nổi bật là trợ lý AI được kết hợp với dữ liệu của cửa hàng để hỗ trợ khách nhanh hơn. Khi phát triển tiếp, hệ thống nên ưu tiên thanh toán tự động, vận chuyển, thông báo và chương trình khách hàng thân thiết.

