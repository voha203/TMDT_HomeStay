import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const API_BASE_URL = "http://localhost:8080/api";
const DEFAULT_RATING = 5;
const MIN_GUESTS = 1;
const STAR_VALUES = [1, 2, 3, 4, 5];
const MILLISECONDS_PER_DAY = 1000 * 3600 * 24;

function StarRating({ value, onChange, readonly = false, sizeClass = "text-2xl" }) {
  return (
    <div className="flex items-center gap-1">
      {STAR_VALUES.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${sizeClass} ${star <= value ? "text-yellow-400" : "text-gray-300"} ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition`}
          aria-label={`${star} sao`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function HomestayDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNights, setTotalNights] = useState(0);
  const [guests, setGuests] = useState(MIN_GUESTS);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(DEFAULT_RATING);

  async function fetchHomestay() {
    try {
      const response = await axios.get(`${API_BASE_URL}/homestays/${id}`);
      setHomestay(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchReviews() {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/homestay/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchAverageRating() {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/homestay/${id}/average`);
      setAverageRating(response.data || 0);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchHomestay();
    fetchReviews();
    fetchAverageRating();
  }, [id]);

  useEffect(() => {
    if (checkInDate && checkOutDate && homestay) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const differenceInTime = end.getTime() - start.getTime();
      const nights = Math.ceil(differenceInTime / MILLISECONDS_PER_DAY);

      if (nights > 0) {
        setTotalNights(nights);
        setTotalPrice(nights * homestay.price);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkInDate, checkOutDate, homestay]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Bạn phải đăng nhập mới bình luận được!");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const bookingRes = await axios.get(`${API_BASE_URL}/bookings/user/${user.id}`);
      const myBookings = bookingRes.data;
      const hasStayed = myBookings.some(
        (b) => b.homestay?.id === Number(id) && b.status === "CONFIRMED"
      );

      if (!hasStayed) {
        alert("Chỉ những khách hàng đã đặt phòng và được Host duyệt thành công mới có quyền để lại đánh giá!");
        return;
      }

      await axios.post(`${API_BASE_URL}/reviews`, {
        comment: newComment.trim(),
        userName: user.fullName,
        rating,
        homestay: { id: Number(id) }
      });

      setNewComment("");
      setRating(DEFAULT_RATING);
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Không thể gửi đánh giá!");
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Bạn phải đăng nhập tài khoản trước khi đặt phòng!");
      navigate("/login");
      return;
    }

    if (totalNights <= 0) {
      alert("Ngày trả phòng không hợp lệ!");
      return;
    }

    const bookingPayload = {
      checkInDate,
      checkOutDate,
      homestay: { id: homestay.id },
      user: { id: user.id },
      totalPrice,
      guests
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/bookings`, bookingPayload);

      if (response.status === 201 || response.status === 200) {
        alert("🎉 Đặt phòng thành công! Vui lòng chờ Host duyệt đơn.");
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
        alert("❌ Đơn đặt phòng thất bại, hệ thống bận hoặc trùng lịch đặt!");
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
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-lg mb-6">
              <span>📍 {homestay.location}</span>
              <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl text-sm font-bold">
                ⭐ {averageRating > 0 ? averageRating.toFixed(1) : "Chưa có"} ({reviews.length} đánh giá)
              </span>
            </div>
            <hr className="border-gray-100 my-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả không gian</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8">{homestay.description}</p>

            <hr className="border-gray-100 my-8" />

            <h3 className="text-xl font-bold text-gray-800 mb-3">Tiện nghi</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {homestay.amenities
                ?.split(",")
                .map((item, index) => (
                  <div key={index} className="bg-blue-50 text-blue-900 px-4 py-2 rounded-xl text-sm font-semibold">
                    ✅ {item.trim()}
                  </div>
                ))}
            </div>

            <hr className="border-gray-100 my-8" />

            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-black text-gray-900">Đánh giá từ cộng đồng ({reviews.length})</h3>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl">
                  <StarRating value={Math.round(averageRating)} readonly sizeClass="text-lg" />
                  <span className="text-sm font-bold text-gray-700">{averageRating > 0 ? averageRating.toFixed(1) : "0.0"}/5</span>
                </div>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-700">Đánh giá của bạn:</span>
                  <StarRating value={rating} onChange={setRating} />
                  <span className="text-sm font-bold text-amber-600">{rating}/5</span>
                </div>

                <textarea
                  className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition resize-none"
                  rows="3"
                  placeholder="Chia sẻ cảm nghĩ của bạn về không gian nghỉ dưỡng này..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition shadow-sm cursor-pointer">
                  Gửi đánh giá
                </button>
              </form>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Chưa có bình luận nào. Hãy là người đầu tiên để lại đánh giá!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-gray-900 text-sm">👤 {r.userName}</div>
                        <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg">
                          <StarRating value={r.rating || DEFAULT_RATING} readonly sizeClass="text-sm" />
                          <span>{r.rating || DEFAULT_RATING}/5</span>
                        </div>
                      </div>
                      <div className="text-gray-600 text-sm mt-1">{r.comment}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

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
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Số khách</label>
              <input type="number" min={MIN_GUESTS} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full border rounded-xl p-2" />
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
