import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function HomestayDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState(null);
  
  // State quản lý ngày đặt phòng
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNights, setTotalNights] = useState(0);

  useEffect(() => {
    fetchHomestay();
  }, [id]);

  // Tự động tính tiền khi người dùng thay đổi ngày (Yêu cầu bắt buộc của cô giáo)
  useEffect(() => {
    if (checkInDate && checkOutDate && homestay) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      
      // Tính khoảng cách giữa 2 ngày (trả về mili-giây)
      const differenceInTime = end.getTime() - start.getTime();
      // Đổi sang số ngày (số đêm)
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

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      alert("Bạn phải đăng nhập tài khoản trước khi đặt phòng!");
      navigate("/login");
      return;
    }

    if (totalNights <= 0) {
      alert("Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày!");
      return;
    }

    // Gói dữ liệu gửi lên đúng cấu trúc Entity Booking bên Java
    const bookingData = {
      user: { id: user.id },
      homestay: { id: homestay.id },
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      totalPrice: totalPrice,
    };

    try {
      await axios.post("http://localhost:8080/api/bookings", bookingData);
      alert("🎉 Đặt phòng thành công! Đơn hàng của bạn đang chờ Host duyệt.");
      navigate("/"); // Đặt xong cho về trang chủ
    } catch (error) {
      console.error(error);
      alert("Đặt phòng thất bại, vui lòng kiểm tra lại hệ thống.");
    }
  };

  if (!homestay) {
    return <div className="text-center py-20 font-bold text-xl">Đang tải thông tin Homestay...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT TRÁI: HÌNH ẢNH & THÔNG TIN CHI TIẾT */}
        <div className="lg:col-span-2 space-y-6">
          <img
            src={homestay.image}
            alt={homestay.title}
            className="w-full h-[450px] object-cover rounded-3xl shadow-md"
          />
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-4xl font-black text-gray-900 mb-4">{homestay.title}</h1>
            <p className="text-gray-500 text-lg mb-6">📍 {homestay.location}</p>
            <hr className="border-gray-100 my-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Mô tả không gian</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{homestay.description}</p>
          </div>
        </div>

        {/* CỘT PHẢI: FORM CHỌN NGÀY VÀ TÍNH TIỀN (BOX ĐẶT PHÒNG) */}
        <div className="h-fit sticky top-28 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
          <div>
            <span className="text-2xl font-black text-blue-900">{homestay.price?.toLocaleString()} VNĐ</span>
            <span className="text-gray-500 text-sm font-medium"> / đêm</span>
          </div>

          <div className="space-y-4 border border-gray-200 rounded-2xl p-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Ngày nhận phòng (Check-in)</label>
              <input
                type="date"
                className="w-full focus:outline-none text-sm font-medium text-gray-700 cursor-pointer"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>
            <hr className="border-gray-200" />
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Ngày trả phòng (Check-out)</label>
              <input
                type="date"
                className="w-full focus:outline-none text-sm font-medium text-gray-700 cursor-pointer"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </div>
          </div>

          {/* HIỂN THỊ THÀNH TIỀN TỰ ĐỘNG */}
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

          <button
            onClick={handleBooking}
            className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 text-center block"
          >
            Đặt phòng ngay
          </button>
        </div>

      </div>
    </div>
  );
}

export default Array.prototype.constructor ? HomestayDetail : null;