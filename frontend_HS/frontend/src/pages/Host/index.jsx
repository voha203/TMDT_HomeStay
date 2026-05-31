import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Host() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hostBookings, setHostBookings] = useState([]); 
  const [myHomestays, setMyHomestays] = useState([]); // Lưu danh sách phòng của Host này
  const [isEditing, setIsEditing] = useState(false); // Trạng thái đang sửa hay đang thêm mới
  const [editId, setEditId] = useState(null);

  const [homestay, setHomestay] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser || (loggedInUser.role !== "HOST" && loggedInUser.role !== "ADMIN")) {
      alert("Bạn không có quyền!");
      navigate("/");
      return;
    }
    setUser(loggedInUser);
    fetchHostBookings(loggedInUser.id);
    fetchMyHomestays(loggedInUser.id);
  }, [navigate]);

  const fetchHostBookings = async (hostId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/host/${hostId}`);
      setHostBookings(response.data);
    } catch (error) { console.error(error); }
  };

  // Lấy danh sách homestay do chính Host này đăng
  const fetchMyHomestays = async (hostId) => {
    try {
      const response = await axios.get("http://localhost:8080/api/homestays");
      // Lọc ra các phòng có user.id trùng với hostId đang đăng nhập
      const filtered = response.data.filter(h => h.user && h.user.id === hostId);
      setMyHomestays(filtered);
    } catch (error) { console.error(error); }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!window.confirm("Xác nhận thay đổi trạng thái đơn hàng?")) return;
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status?status=${newStatus}`);
      alert("Cập nhật thành công!");
      fetchHostBookings(user.id);
    } catch (error) { console.error(error); }
  };

  // Kích hoạt chế độ sửa: Điền ngược dữ liệu cũ vào các ô Input
  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setHomestay({
      title: item.title,
      description: item.description,
      price: item.price,
      location: item.location,
      image: item.image,
    });
  };

  // Xóa phòng
  const handleDeleteHomestay = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn căn homestay này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/homestays/${id}`);
      alert("Xóa thành công!");
      fetchMyHomestays(user.id);
    } catch (error) { alert("Không thể xóa phòng này do đang có khách đặt!"); }
  };

  const handleChange = (e) => {
    setHomestay({ ...homestay, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Nếu đang sửa -> Gọi API PUT
        await axios.put(`http://localhost:8080/api/homestays/${editId}`, homestay);
        alert("Cập nhật thông tin homestay thành công!");
      } else {
        // Nếu thêm mới -> Gọi API POST
        await axios.post(`http://localhost:8080/api/homestays/user/${user.id}`, homestay);
        alert("Đăng bài thành công!");
      }
      window.location.reload();
    } catch (error) { console.error(error); }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT 1: FORM THÊM / SỬA PHÒNG */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-fit sticky top-28">
          <h2 className="text-xl font-black text-gray-900 mb-4">
            {isEditing ? "📝 Cập nhật thông tin" : "🏠 Đăng tài sản mới"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tên Homestay</label>
              <input type="text" name="title" value={homestay.title} required placeholder="Tên căn hộ..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20" onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Giá / Đêm (VND)</label>
                <input type="number" name="price" value={homestay.price} required placeholder="Giá thuê..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20" onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Vị trí</label>
                <input type="text" name="location" value={homestay.location} required placeholder="Địa chỉ..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20" onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Link hình ảnh</label>
              <input type="text" name="image" value={homestay.image} required placeholder="URL ảnh..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20" onChange={handleChange} />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mô tả chi tiết phòng</label>
              <textarea name="description" value={homestay.description} required rows="4" placeholder="Thông tin phòng..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 resize-none" onChange={handleChange} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-md">
                {isEditing ? "Lưu thay đổi" : "Tạo bài đăng"}
              </button>
              {isEditing && (
                <button type="button" onClick={() => window.location.reload()} className="bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* CỘT 2 & 3: QUẢN LÝ ĐƠN HÀNG & DANH SÁCH TÀI SẢN */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* BẢNG ĐƠN ĐẶT PHÒNG CỦA KHÁCH */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h1 className="text-xl font-black text-gray-950">📥 Đơn đặt phòng cần xử lý ({hostBookings.length})</h1>
            </div>
            {hostBookings.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">Chưa có yêu cầu nào.</div>
            ) : (
              <div className="overflow-x-auto text-xs md:text-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100 text-[11px]">
                      <th className="p-4 pl-6">Mã đơn</th>
                      <th className="p-4">Khách hàng</th>
                      <th className="p-4">Homestay</th>
                      <th className="p-4">Tổng tiền</th>
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
                        <td className="p-4 font-bold text-gray-950">{booking.totalPrice?.toLocaleString()} đ</td>
                        <td className="p-4 pr-6 text-center">
                          {booking.status === "PENDING" ? (
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")} className="px-2.5 py-1.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-xs">Duyệt</button>
                              <button onClick={() => handleUpdateStatus(booking.id, "CANCELLED")} className="px-2.5 py-1.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition text-xs">Từ chối</button>
                            </div>
                          ) : (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{booking.status === "CONFIRMED" ? "Đã duyệt" : "Đã hủy"}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* BẢNG TÍNH NĂNG MỚI: DANH SÁCH TÀI SẢN ĐANG CÓ (CRUD) */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h1 className="text-xl font-black text-gray-950">🏠 Danh sách phòng của tôi ({myHomestays.length})</h1>
            </div>
            {myHomestays.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">Bạn chưa có tài sản nào công khai.</div>
            ) : (
              <div className="overflow-x-auto text-xs md:text-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100 text-[11px]">
                      <th className="p-4 pl-6">Hình ảnh</th>
                      <th className="p-4">Tên căn phòng</th>
                      <th className="p-4">Vị trí</th>
                      <th className="p-4">Giá/Đêm</th>
                      <th className="p-4 pr-6 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                    {myHomestays.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 pl-6">
                          <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-xl" />
                        </td>
                        <td className="p-4 font-bold text-gray-900">{item.title}</td>
                        <td className="p-4">{item.location}</td>
                        <td className="p-4 font-semibold text-blue-900">{item.price?.toLocaleString()} đ</td>
                        <td className="p-4 pr-6 text-center flex gap-2 justify-center pt-7">
                          <button onClick={() => handleEditClick(item)} className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition text-xs cursor-pointer">Sửa</button>
                          <button onClick={() => handleDeleteHomestay(item.id)} className="px-3 py-1 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-100 transition text-xs cursor-pointer">Xóa</button>
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
    </div>
  );
}

export default Host;