import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function HomestayDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState(null);
  
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNights, setTotalNights] = useState(0);

  // CÁC STATE MỚI PHỤC VỤ CHO REVIEW
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");

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

  // HÀM LẤY REVIEW (MỚI)
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/reviews/homestay/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // HÀM SUBMIT REVIEW (MỚI)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Bạn phải đăng nhập mới bình luận được!");
      return;
    }
    if (!newComment.trim()) return;

    try {
      await axios.post("http://localhost:8080/api/reviews", {
        comment: newComment,
        userName: user.name,
        homestay: { id: id }
      });
      setNewComment(""); // Xóa sạch ô nhập
      fetchReviews(); // Re-render lại danh sách bình luận ngay lập tức
    } catch (error) {
      console.error(error);
    }
  };

  const handleBooking = async () => {
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

    const bookingData = {
      user: { id: user.id },
      homestay: { id: homestay.id },
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      totalPrice: totalPrice,
    };

    try {
      await axios.post("http://localhost:8080/api/bookings", bookingData);
      alert("🎉 Đặt phòng thành công!");
      navigate("/");
    } catch (error) {
      console.error(error);
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
            
            <hr className="border-gray-100 my-8" />

            {/* KHU VỰC ĐÁNH GIÁ VÀ BÌNH LUẬN (MỚI) */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-gray-950">Đánh giá từ cộng đồng ({reviews.length})</h3>
              
              {/* Form viết bình luận */}
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <textarea
                  className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition resize-none"
                  rows="3"
                  placeholder="Chia sẻ cảm nghĩ của bạn về không gian nghỉ dưỡng này..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition shadow-sm">
                  Gửi bình luận
                </button>
              </form>

              {/* Danh sách bình luận đã đổ ra */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Chưa có bình luận nào. Hãy là người đầu tiên để lại đánh giá!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="font-bold text-gray-900 text-sm">👤 {r.userName}</div>
                      <div className="text-gray-600 text-sm mt-1">{r.comment}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* BOX TÍNH TIỀN ĐẶT PHÒNG BÊN PHẢI (GIỮ NGUYÊN) */}
        <div className="h-fit sticky top-28 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
          <div>
            <span className="text-2xl font-black text-blue-900">{homestay.price?.toLocaleString()} VNĐ</span>
            <span className="text-gray-500 text-sm font-medium"> / đêm</span>
          </div>

          <div className="space-y-4 border border-gray-200 rounded-2xl p-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Check-in</label>
              <input type="date" className="w-full focus:outline-none text-sm text-gray-700" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
            </div>
            <hr className="border-gray-200" />
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Check-out</label>
              <input type="date" className="w-full focus:outline-none text-sm text-gray-700" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
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

          <button onClick={handleBooking} className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition shadow-md">
            Đặt phòng ngay
          </button>
        </div>

      </div>
    </div>
  );
}

export default HomestayDetail;