import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Notification from "../../components/Notification.jsx";

function HomestayDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNights, setTotalNights] = useState(0);

  // BƯỚC 6: THÊM STATE SỐ LƯỢNG KHÁCH
  const [guests, setGuests] = useState(1);

  // CÁC STATE PHỤC VỤ CHO REVIEW
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  // Thêm state chọn số sao mặc định là 5
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchHomestay();
    fetchReviews(); // Gọi lấy danh sách bình luận
  }, [id]);

  useEffect(() => {
    if (checkInDate && checkOutDate && homestay) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const differenceInTime = end.getTime() - start.getTime();
      const nights = Math.ceil(differenceInTime / (1000 * 3600 * 24));

      if (nights > 0) {
        setTotalNights(nights);
        setTotalPrice(nights * homestay.price);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkInDate, checkOutDate, homestay]);

  const fetchHomestay = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/homestays/${id}`);
      setHomestay(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // HÀM LẤY REVIEW
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/reviews/homestay/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // HÀM SUBMIT REVIEW
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      Notification.warning("Bạn phải đăng nhập mới bình luận được!");
      return;
    }
    if (!newComment.trim()) return;

    try {
      // 1. Gọi xuống API lấy lịch sử đặt phòng của chính User này để kiểm tra
      const bookingRes = await axios.get(`http://localhost:8080/api/bookings/user/${user.id}`);
      const myBookings = bookingRes.data;

      // 2. Kiểm tra xem user này đã từng có đơn nào ĐÃ DUYỆT (CONFIRMED) tại chính homestay này chưa
      const hasStayed = myBookings.some(
        (b) => b.homestay?.id === parseInt(id) && b.status === "CONFIRMED"
      );

      if (!hasStayed) {
        Notification.warning(" Chỉ những khách hàng đã đặt phòng và được Host duyệt thành công mới có quyền để lại đánh giá!");
        return;
      }

      // 3. Tiến hành gửi bình luận kèm số sao chọn từ dropdown
      await axios.post("http://localhost:8080/api/reviews", {
        comment: newComment,
        userName: user.name,
        rating: rating, // Gửi rating lên backend
        homestay: { id: id }
      });

      setNewComment("");
      setRating(5); // Reset số sao về 5 sau khi gửi thành công
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  // HÀM ĐẶT PHÒNG
  const handleBooking = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      Notification.error("Bạn phải đăng nhập tài khoản trước khi đặt phòng!");
      navigate("/login");
      return;
    }

    if (totalNights <= 0) {
      Notification.error("Ngày trả phòng không hợp lệ!");
      return;
    }

    // BƯỚC 7: THÊM GUESTS VÀO PAYLOAD GỬI ĐI
    const bookingPayload = {
      checkInDate: checkInDate,   // Chuỗi định dạng YYYY-MM-DD
      checkOutDate: checkOutDate, // Chuỗi định dạng YYYY-MM-DD
      homestay: { id: homestay.id },
      user: { id: user.id },
      totalPrice: totalPrice,
      guests: guests // Truyền số lượng khách xuống backend
    };

    try {
      const response = await axios.post("http://localhost:8080/api/bookings", bookingPayload);

      // Kiểm tra phản hồi thành công từ Backend
      if (response.status === 201 || response.status === 200) {
        Notification.success("🎉 Đặt phòng thành công! Vui lòng chờ Host duyệt đơn.");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Lỗi chi tiết khi đặt phòng:", error);

      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === "object" && errorData !== null) {
          alert("❌ " + (errorData.message || JSON.stringify(errorData)));
        } else {
          alert("❌ " + errorData);
        }
      } else {
         Notification.error("❌ Đơn đặt phòng thất bại, hệ thống bận hoặc trùng lịch đặt!");
      }
    }
  };

  if (!homestay) {
    return <div className="text-center py-20 font-bold text-xl">Đang tải...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2 space-y-6">
          <img src={homestay.image} alt="" className="w-full h-[450px] object-cover rounded-3xl shadow-md" />

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-4xl font-black text-gray-900 mb-4">{homestay.title}</h1>
            <p className="text-gray-500 text-lg mb-6">📍 {homestay.location}</p>
            <hr className="border-gray-100 my-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả không gian</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8">{homestay.description}</p>

            {/* HIỂN THỊ TIỆN NGHI NGAY DƯỚI MÔ TẢ */}
            <hr className="border-gray-100 my-8" />

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Tiện nghi
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {homestay.amenities
                ?.split(",")
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 text-blue-900 px-4 py-2 rounded-xl text-sm font-semibold"
                  >
                    ✅ {item.trim()}
                  </div>
                ))}
            </div>

            <hr className="border-gray-100 my-8" />

            {/* KHU VỰC ĐÁNH GIÁ VÀ BÌNH LUẬN */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900">Đánh giá từ cộng đồng ({reviews.length})</h3>

              {/* Form viết bình luận */}
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-700">Đánh giá của bạn:</span>
                  {/* Form review dropdown chọn số sao */}
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="border p-2 rounded-xl bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  >
                    <option value="1">⭐ 1</option>
                    <option value="2">⭐ 2</option>
                    <option value="3">⭐ 3</option>
                    <option value="4">⭐ 4</option>
                    <option value="5">⭐ 5</option>
                  </select>
                </div>

                <textarea
                  className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition resize-none"
                  rows="3"
                  placeholder="Chia sẻ cảm nghĩ của bạn về không gian nghỉ dưỡng này..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition shadow-sm cursor-pointer">
                  Gửi bình luận
                </button>
              </form>

              {/* Danh sách bình luận đã đổ ra */}
              {/* Danh sách bình luận đã đổ ra */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    Chưa có bình luận nào.
                  </p>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-gray-900 text-sm">
                          👤 {r.userName}
                        </div>

                        <div className="text-yellow-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg">
                          {"⭐".repeat(r.rating || 5)}
                        </div>
                      </div>

                      <div className="text-gray-600 text-sm mt-2">
                        {r.comment}
                      </div>

                      {/* PHẢN HỒI HOST */}
                      {r.reply && (
                        <div className="mt-4 ml-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">

                          <div className="text-xs font-black text-blue-900 mb-2">
                            💬 Chủ Homestay phản hồi
                          </div>

                          <div className="text-sm text-gray-700">
                            {r.reply}
                          </div>

                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* BOX TÍNH TIỀN ĐẶT PHÒNG BÊN PHẢI */}
        <div className="h-fit sticky top-28 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
          <div>
            <span className="text-2xl font-black text-blue-900">{homestay.price?.toLocaleString()} VNĐ</span>
            <span className="text-gray-500 text-sm font-medium"> / đêm</span>
          </div>

          <div className="space-y-4 border border-gray-200 rounded-2xl p-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Check-in</label>
              <input type="date" className="w-full focus:outline-none text-sm text-gray-700 cursor-pointer" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
            </div>
            <hr className="border-gray-200" />
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Check-out</label>
              <input type="date" className="w-full focus:outline-none text-sm text-gray-700 cursor-pointer" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
            </div>

            <hr className="border-gray-200" />
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Số khách
              </label>

              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full border rounded-xl p-2"
              />
            </div>
          </div>

          {totalNights > 0 && (
            <div className="bg-blue-50/50 p-4 rounded-2xl space-y-2 text-sm text-gray-700 font-medium">
              <div className="flex justify-between">
                <span>Giá thuê ({totalNights} đêm)</span>
                <span>{(homestay.price * totalNights).toLocaleString()} VNĐ</span>
              </div>
              <hr className="border-blue-100/50" />
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Tổng thành tiền</span>
                <span className="text-blue-900">{totalPrice.toLocaleString()} VNĐ</span>
              </div>
            </div>
          )}

          <button onClick={handleBooking} className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition shadow-md cursor-pointer">
            Đặt phòng ngay
          </button>
        </div>

      </div>
    </div>
  );
}

export default HomestayDetail;