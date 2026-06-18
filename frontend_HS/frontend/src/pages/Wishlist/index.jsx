import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const API_BASE_URL = "http://localhost:8080/api";

function getStoredUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchWishlist(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/wishlist/user/${userId}`);
      setWishlistItems(response.data);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách yêu thích!");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveWishlist(homestayId) {
    const user = getStoredUser();
    if (!user?.id) return;

    try {
      await axios.post(`${API_BASE_URL}/wishlist/toggle?userId=${user.id}&homestayId=${homestayId}`);
      setWishlistItems((items) => items.filter((item) => item.homestay?.id !== homestayId));
    } catch (error) {
      console.error(error);
      alert("Không thể bỏ yêu thích homestay này!");
    }
  }

  useEffect(() => {
    const user = getStoredUser();
    if (!user?.id) {
      alert("Bạn cần đăng nhập để xem danh sách yêu thích!");
      navigate("/login");
      return;
    }

    fetchWishlist(user.id);
  }, [navigate]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-32">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-950">Homestay yêu thích</h1>
          <p className="text-gray-500 mt-2">Danh sách các homestay bạn đã lưu để xem lại sau.</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-500 font-semibold shadow-sm">
            Đang tải danh sách yêu thích...
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">♡</div>
            <h2 className="text-xl font-bold text-gray-900">Bạn chưa có homestay yêu thích nào</h2>
            <Link to="/" className="inline-block mt-5 bg-blue-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition">
              Khám phá homestay
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => {
              const homestay = item.homestay;
              if (!homestay) return null;

              return (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition">
                  <Link to={`/homestay/${homestay.id}`}>
                    <img src={homestay.image} alt={homestay.title} className="w-full h-56 object-cover" />
                  </Link>

                  <div className="p-5 space-y-3">
                    <div>
                      <Link to={`/homestay/${homestay.id}`} className="text-lg font-black text-gray-950 hover:text-blue-900 transition">
                        {homestay.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">📍 {homestay.location}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-blue-900 font-black">{homestay.price?.toLocaleString()} VNĐ / đêm</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold">{homestay.category}</span>
                    </div>

                    <button onClick={() => handleRemoveWishlist(homestay.id)} className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-100 transition cursor-pointer">
                      Bỏ yêu thích
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Wishlist;