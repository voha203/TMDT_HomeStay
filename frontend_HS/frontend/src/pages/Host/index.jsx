import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Notification from "../../components/Notification.jsx";

function Host() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hostBookings, setHostBookings] = useState([]); 
  const [myHomestays, setMyHomestays] = useState([]); // Lưu danh sách phòng của Host này
  const [isEditing, setIsEditing] = useState(false); // Trạng thái đang sửa hay đang thêm mới
  const [editId, setEditId] = useState(null);

  // Thêm các state quản lý Review theo gợi ý của bạn
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});

  // Cấu hình thuộc tính category vào state mặc định
  const [homestay, setHomestay] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
    amenities: "", 
    category: "Villa", // Mặc định là Villa
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser || (loggedInUser.role !== "HOST" && loggedInUser.role !== "ADMIN")) {
      Notification.error("Bạn không có quyền!");
      navigate("/");
      return;
    }
    setUser(loggedInUser);
    fetchHostBookings(loggedInUser.id);
    fetchMyHomestays(loggedInUser.id);
    fetchReviews(loggedInUser.id); // Lấy danh sách review khi component mount
  }, [navigate]);

  const fetchHostBookings = async (hostId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/host/${hostId}`);
      setHostBookings(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchMyHomestays = async (hostId) => {
    try {
      const response = await axios.get("http://localhost:8080/api/homestays");
      const filtered = response.data.filter(h => h.user && h.user.id === hostId);
      setMyHomestays(filtered);
    } catch (error) { console.error(error); }
  };

  // Hàm lấy danh sách đánh giá của các homestay thuộc Host này
  const fetchReviews = async (hostId) => {
  try {
    const reviewRes = await axios.get(
      "http://localhost:8080/api/reviews"
    );

    const homestayRes = await axios.get(
      "http://localhost:8080/api/homestays"
    );

    // Lấy danh sách phòng của host
    const hostHomestays =
      homestayRes.data.filter(
        h => h.user?.id === hostId
      );

    const hostIds =
      hostHomestays.map(
        h => h.id
      );

    // Lọc review theo homestay
    const filtered =
      reviewRes.data.filter(
        r => hostIds.includes(r.homestay?.id)
      );

    setReviews(filtered);

    console.log("Review:", filtered);

  } catch (error) {
    console.error(error);
  }
};

  // Hàm gửi phản hồi review lên backend
  const submitReply = async (reviewId) => {
    try {
      if (!replyText[reviewId]?.trim()) {
      Notification.info("Nhập nội dung phản hồi");
      return;
    }
      await axios.put(
        `http://localhost:8080/api/reviews/${reviewId}/reply`,
        replyText[reviewId],
        { headers: { "Content-Type": "text/plain" } } // Thêm định dạng nếu truyền chuỗi raw string
      );
      Notification.success("Đã phản hồi!");
      setReplyText({
      ...replyText,
      [reviewId]: "",
    });

    fetchReviews(user.id);

  } catch (error) {
    console.error(error);
    Notification.error("Không thể phản hồi");
  }
};

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!window.confirm("Xác nhận thay đổi trạng thái đơn hàng?")) return;
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status?status=${newStatus}`);
      Notification.success("Cập nhật thành công!");
      fetchHostBookings(user.id);
    } catch (error) { console.error(error); }
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setHomestay({
      title: item.title,
      description: item.description,
      price: item.price,
      location: item.location,
      image: item.image,
      amenities: item.amenities || "", 
      category: item.category || "Villa", 
    });
  };

  const handleDeleteHomestay = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn căn homestay này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/homestays/${id}`);
      Notification.success("Xóa thành công!");
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
        await axios.put(`http://localhost:8080/api/homestays/${editId}`, homestay);
        Notification.success("Cập nhật thông tin homestay thành công!");
      } else {
        await axios.post(`http://localhost:8080/api/homestays/user/${user.id}`, homestay);
        Notification.success("Đăng bài thành công!");
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

            {/* CHỌN LOẠI HÌNH (CATEGORY) */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Loại hình</label>
              <select
                name="category"
                value={homestay.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 bg-white"
              >
                <option value="Villa">🏡 Biệt thự</option>
                <option value="Apartment">🏢 Căn hộ</option>
                <option value="Bungalow">🪵 Nhà gỗ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tiện nghi</label>
              <textarea
                name="amenities"
                value={homestay.amenities}
                rows="3"
                placeholder="Wifi, Hồ bơi, BBQ, Điều hòa..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 resize-none"
                onChange={handleChange}
              />
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

        {/* CỘT 2 & 3: QUẢN LÝ ĐƠN HÀNG, TÀI SẢN & ĐÁNH GIÁ */}
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

          {/* BẢNG DANH SÁCH TÀI SẢN ĐANG CÓ (CRUD) */}
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

          {/* KHU VỰC PHẢN HỒI ĐÁNH GIÁ (REVIEWS CHƯA/ĐÃ PHẢN HỒI) */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h1 className="text-xl font-black text-gray-950">⭐ Đánh giá từ khách hàng ({reviews.length})</h1>
            </div>
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">Chưa có đánh giá nào cho các homestay của bạn.</div>
            ) : (
              <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-none last:pb-0 text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-gray-900">{review.user?.name || "Khách ẩn danh"}</span>
                        <span className="text-xs text-gray-400 ml-2">đã đánh giá tại</span>
                        <span className="font-semibold text-blue-900 ml-1">[{review.homestay?.title}]</span>
                      </div>
                      <div className="text-yellow-500 font-bold">⭐ {review.rating}/5</div>
                    </div>
                    <p className="text-gray-600 italic bg-gray-50 p-3 rounded-xl mb-3">"{review.comment}"</p>

                    {/* Logic Render Form trả lời hoặc Render nội dung Phản hồi cũ */}
                    <div className="mt-3">
                      {!review.reply ? (
                        <>
                          <textarea
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 resize-none"
                            placeholder="Trả lời khách..."
                            rows="2"
                            value={replyText[review.id] || ""}
                            onChange={(e) =>
                              setReplyText({
                                ...replyText,
                                [review.id]: e.target.value,
                              })
                            }
                          />
                          <button
                            onClick={() => submitReply(review.id)}
                            className="mt-2 bg-blue-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-800 transition"
                          >
                            Trả lời
                          </button>
                        </>
                      ) : (
                        <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                          <div className="font-bold text-blue-900 text-xs mb-1">💬 Phản hồi từ Host</div>
                          <div className="text-gray-700 text-sm">{review.reply}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Host;