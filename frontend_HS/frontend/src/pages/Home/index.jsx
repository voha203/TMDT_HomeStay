import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import HomestayCard from "../../components/HomestayCard";

function Home() {
  const [homestays, setHomestays] = useState([]);
  
  // State phục vụ bộ lọc và sắp xếp
  const [searchLocation, setSearchLocation] = useState("");
  const [sortType, setSortType] = useState(""); // "asc" (thấp đến cao), "desc" (cao đến thấp)

  useEffect(() => {
    fetchHomestays();
  }, []);

  const fetchHomestays = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/homestays");
      setHomestays(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // LOGIC XỬ LÝ LỌC VÀ SẮP XẾP BẰNG JAVASCRIPT
  const filteredAndSortedHomestays = homestays
    .filter((item) => {
      // Tìm kiếm không phân biệt chữ hoa chữ thường
      return item.location.toLowerCase().includes(searchLocation.toLowerCase());
    })
    .sort((a, b) => {
      if (sortType === "asc") return a.price - b.price;
      if (sortType === "desc") return b.price - a.price;
      return 0; // Giữ nguyên vị trí ban đầu nếu chưa chọn sắp xếp
    });

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="h-[70vh] relative">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt=""
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Tinh hoa kỳ nghỉ Việt
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-200">
            Luxury Homestay Booking
          </p>
        </div>
      </section>

      {/* THANH BỘ LỌC VÀ SẮP XẾP (MỚI THÊM) */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">📍 Tìm theo địa điểm / vị trí</label>
            <input
              type="text"
              placeholder="Nhập địa điểm (Ví dụ: Vũng Tàu, Hà Nội...)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-sm"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">💰 Sắp xếp theo giá tiền</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-sm font-medium text-gray-700"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="">Mặc định (Mới đăng lên trước)</option>
              <option value="asc">Giá từ thấp đến cao ↑</option>
              <option value="desc">Giá từ cao đến thấp ↓</option>
            </select>
          </div>
        </div>
      </section>

      {/* HOMESTAY LIST */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-gray-950 mb-8">
          Homestay nổi bật ({filteredAndSortedHomestays.length})
        </h2>

        {filteredAndSortedHomestays.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            ❌ Không tìm thấy homestay nào phù hợp với bộ lọc của bạn!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedHomestays.map((item) => (
              <HomestayCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;