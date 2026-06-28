import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Profile() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // State quản lý Popup thanh toán ảo
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Bạn cần đăng nhập!");
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
    } catch (error) { console.error(error); }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy yêu cầu đặt phòng này?")) return;
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status?status=CANCELLED`);
      alert("Hủy đơn thành công!");
      fetchMyBookings(currentUser.id);
    } catch (error) { console.error(error); }
  };

  // Kích hoạt cổng thanh toán QR ngân hàng ảo
  const handleOpenPayment = (booking) => {
    setSelectedBooking(booking);
    setShowPayModal(true);
  };

  // Thực hiện lệnh xác nhận đã chuyển tiền thành công
  const handleConfirmPayment = async () => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${selectedBooking.id}/pay`);
      alert("💳 Hệ thống đã ghi nhận cổng thanh toán! Hóa đơn số #" + selectedBooking.id + " đã hoàn tất thanh toán thành công.");
      setShowPayModal(false);
      fetchMyBookings(currentUser.id); // Reload dữ liệu
    } catch (error) { alert("Trục trặc cổng thanh toán!"); }
  };

  const renderStatusBadge = (status, payStatus) => {
    if (status === "CANCELLED") return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold text-xs">Đã hủy đơn</span>;
    if (status === "PENDING") return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold text-xs">Chờ Host duyệt</span>;
    
    // Nếu đơn được CONFIRMED thì xét tiếp trạng thái tiền bạc
    if (status === "CONFIRMED") {
      return (
        <div className="flex flex-col gap-1 items-start">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-xs">Đã xác nhận phòng</span>
          {payStatus === "PAID" ? (
            <span className="text-[11px] text-emerald-600 font-bold">✓ Đã thanh toán tiền</span>
          ) : (
            <span className="text-[11px] text-amber-600 font-bold">⚠ Chưa thanh toán</span>
          )}
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-32">
        {currentUser && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentUser.fulllName}</h2>
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
                  <tr className="bg-gray-50 text-gray-700 text-xs font-bold uppercase border-b border-gray-100">
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
                      <td className="p-4">{renderStatusBadge(booking.status, booking.paymentStatus)}</td>
                      <td className="p-4 pr-6 text-center">
                        {booking.status === "PENDING" && (
                          <button onClick={() => handleCancelBooking(booking.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-100 text-xs cursor-pointer">Hủy phòng</button>
                        )}
                        
                        {/* HIỆN NÚT THANH TOÁN KHI ĐƯỢC DUYỆT VÀ CHƯA TRẢ TIỀN */}
                        {booking.status === "CONFIRMED" && booking.paymentStatus === "UNPAID" && (
                          <button onClick={() => handleOpenPayment(booking)} className="px-3 py-1.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 shadow-md text-xs cursor-pointer">
                            💳 Thanh toán ngay
                          </button>
                        )}

                        {booking.paymentStatus === "PAID" && (
                          <span className="text-gray-400 text-xs italic">Giao dịch hoàn tất</span>
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

      {/* POPUP MÔ PHỎNG CỔNG THANH TOÁN QR CODE NGÂN HÀNG (MỚI) */}
      {showPayModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-black text-gray-950">Cổng thanh toán QR trực tuyến</h3>
            <p className="text-xs text-gray-500">Vui lòng quét mã QR dưới đây để thực hiện thanh toán hóa đơn giá trị <span className="font-bold text-gray-900">{selectedBooking.totalPrice?.toLocaleString()} đ</span></p>
            
            {/* Sử dụng API tạo mã QR động theo đúng số tiền cực kỳ xịn sò */}
            <div className="bg-gray-100 p-4 rounded-2xl flex justify-center border border-gray-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PayBooking_ID_${selectedBooking.id}_Amount_${selectedBooking.totalPrice}`} 
                alt="QR Code Payment" 
                className="w-44 h-44 rounded-lg shadow-sm"
              />
            </div>

            <div className="text-[11px] text-gray-400 font-medium">Nội dung CK mặc định: <span className="text-gray-700 font-bold">Luxestay BK-{selectedBooking.id}</span></div>
            
            <div className="flex gap-3 pt-2">
              <button onClick={handleConfirmPayment} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition text-sm">
                Tôi đã chuyển khoản xong
              </button>
              <button onClick={() => setShowPayModal(false)} className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition text-sm">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;