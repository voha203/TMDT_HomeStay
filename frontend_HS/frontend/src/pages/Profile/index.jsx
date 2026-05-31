import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Profile() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Bạn cần đăng nhập để xem lịch sử!");
      navigate("/login");
      return;
    }
    setCurrentUser(user);
    fetchMyBookings(user.id);
  }, [navigate]);

  const fetchMyBookings = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/user/${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // HÀM XỬ LÝ HỦY ĐƠN TỪ PHÍA KHÁCH (MỚI)
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy yêu cầu đặt phòng này?")) return;

    try {
      // Gọi lên API đổi trạng thái thành CANCELLED
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status?status=CANCELLED`);
      alert("Hủy đơn đặt phòng thành công!");
      fetchMyBookings(currentUser.id); // Load lại bảng dữ liệu
    } catch (error) {
      console.error(error);
      alert("Hủy đơn thất bại!");
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "PENDING": return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold text-xs border border-yellow-200">Chờ duyệt</span>;
      case "CONFIRMED": return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-xs border border-green-200">Đã xác nhận</span>;
      case "CANCELLED": return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold text-xs border border-red-200">Đã hủy đơn</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-semibold text-xs">{status}</span>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-32">
        {currentUser && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
              <p className="text-gray-500 text-sm">{currentUser.email} • Vai trò: <span className="font-semibold text-blue-900">{currentUser.role}</span></p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-black text-gray-950">Lịch sử đặt phòng của tôi</h1>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Bạn chưa đặt phòng nào!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 pl-6">Mã đơn</th>
                    <th className="p-4">Tên Homestay</th>
                    <th className="p-4">Ngày ở</th>
                    <th className="p-4">Tổng tiền</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 pr-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-600 font-medium">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6 font-bold text-blue-900">#BK-{booking.id}</td>
                      <td className="p-4 font-semibold text-gray-900">{booking.homestay?.title}</td>
                      <td className="p-4 text-xs">
                        <div>In: {booking.checkInDate}</div>
                        <div>Out: {booking.checkOutDate}</div>
                      </td>
                      <td className="p-4 text-gray-900 font-bold">{booking.totalPrice?.toLocaleString()} VNĐ</td>
                      <td className="p-4">{renderStatusBadge(booking.status)}</td>
                      <td className="p-4 pr-6 text-center">
                        {/* CHỈ CHO PHÉP HỦY KHI ĐƠN ĐANG Ở TRẠNG THÁI CHỜ DUYỆT */}
                        {booking.status === "PENDING" ? (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg border border-red-200 hover:bg-red-50 transition text-xs cursor-pointer"
                          >
                            Hủy phòng
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">Không thể can thiệp</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;