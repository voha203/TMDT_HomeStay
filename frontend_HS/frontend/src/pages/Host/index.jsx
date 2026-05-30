import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Host() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hostBookings, setHostBookings] = useState([]); // State lưu đơn đặt phòng của khách
  
  const [homestay, setHomestay] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      alert("Bạn cần đăng nhập trước!");
      navigate("/login");
    } else if (loggedInUser.role !== "HOST" && loggedInUser.role !== "ADMIN") {
      alert("Tài khoản của bạn không có quyền của Chủ nhà!");
      navigate("/");
    } else {
      setUser(loggedInUser);
      fetchHostBookings(loggedInUser.id); // Lấy danh sách đơn hàng của Host này
    }
  }, [navigate]);

  // Hàm gọi API lấy các đơn đặt phòng của khách gửi tới căn nhà của mình
  const fetchHostBookings = async (hostId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/host/${hostId}`);
      setHostBookings(response.data);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng của Host:", error);
    }
  };

  // Hàm xử lý khi Host bấm nút Duyệt hoặc Từ chối đơn
  const handleUpdateStatus = async (bookingId, newStatus) => {
    const message = newStatus === "CONFIRMED" ? "Bạn muốn duyệt đơn này?" : "Bạn muốn hủy đơn này?";
    if (!window.confirm(message)) return;

    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status?status=${newStatus}`);
      alert("Cập nhật trạng thái đơn hàng thành công!");
      fetchHostBookings(user.id); // Reload lại bảng danh sách đơn sau khi cập nhật
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại!");
    }
  };

  const handleChange = (e) => {
    setHomestay({ ...homestay, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/homestays/user/${user.id}`, homestay);
      alert("Đăng bài cho thuê Homestay thành công!");
      window.location.reload(); // Reset lại trang để xóa trắng form
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo phòng!");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* PHẦN 1 (Kích thước 1 cột): FORM ĐĂNG PHÒNG MỚI */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-fit">
          <h2 className="text-xl font-black text-gray-900 mb-4">Đăng tài sản mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tên Homestay</label>
              <input type="text" name="title" required placeholder="Tên căn hộ..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition" onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Giá / Đêm (VND)</label>
                <input type="number" name="price" required placeholder="Giá thuê..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition" onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Thành phố/Vị trí</label>
                <input type="text" name="location" required placeholder="Địa chỉ..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition" onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Link hình ảnh</label>
              <input type="text" name="image" required placeholder="URL ảnh..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition" onChange={handleChange} />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mô tả chi tiết phòng</label>
              <textarea name="description" required rows="4" placeholder="Thông tin phòng..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition resize-none" onChange={handleChange} />
            </div>
            <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-md">
              Tạo bài đăng
            </button>
          </form>
        </div>

        {/* PHẦN 2 (Kích thước 2 cột): QUẢN LÝ ĐƠN ĐẶT PHÒNG CỦA KHÁCH KHÁCH */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-black text-gray-950">Quản lý đơn đặt phòng của khách</h1>
            <p className="text-gray-500 text-sm mt-1">Duyệt hoặc từ chối các yêu cầu thuê phòng từ khách hàng</p>
          </div>

          {hostBookings.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Hiện tại chưa có khách nào đặt phòng của bạn.</div>
          ) : (
            <div className="overflow-x-auto text-xs md:text-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 font-bold uppercase border-b border-gray-100">
                    <th className="p-4 pl-6">Mã đơn</th>
                    <th className="p-4">Khách đặt</th>
                    <th className="p-4">Homestay</th>
                    <th className="p-4">Thời gian ở</th>
                    <th className="p-4">Tổng thu</th>
                    <th className="p-4 pr-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {hostBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6 font-bold text-blue-900">#BK-{booking.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{booking.user?.name}</div>
                        <div className="text-gray-400 text-xs">{booking.user?.email}</div>
                      </td>
                      <td className="p-4 font-semibold text-gray-900">{booking.homestay?.title}</td>
                      <td className="p-4 text-xs">
                        <div>Từ: {booking.checkInDate}</div>
                        <div>Đến: {booking.checkOutDate}</div>
                      </td>
                      <td className="p-4 font-bold text-gray-950">{booking.totalPrice?.toLocaleString()} đ</td>
                      <td className="p-4 pr-6 text-center">
                        {booking.status === "PENDING" ? (
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")} className="px-3 py-1.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-xs">
                              Duyệt
                            </button>
                            <button onClick={() => handleUpdateStatus(booking.id, "CANCELLED")} className="px-3 py-1.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition text-xs">
                              Từ chối
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            booking.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {booking.status === "CONFIRMED" ? "Đã duyệt" : "Đã hủy đơn"}
                          </span>
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

export default Host;