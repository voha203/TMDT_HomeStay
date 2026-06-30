import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Notification from "../../components/Notification.jsx";

// Danh sách Category
const CATEGORIES = [
  { id: "all", label: "✨ Tất cả", value: "all" },
  { id: "villa", label: "🏡 Biệt thự", value: "Villa" },
  { id: "apartment", label: "🏢 Căn hộ", value: "Apartment" },
  { id: "bungalow", label: "🪵 Nhà gỗ", value: "Bungalow" },
];

// Danh sách địa điểm phổ biến
const POPULAR_DESTINATIONS = [
  {
    name: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    count: "120+ Homestay"
  },
  {
    name: "Hà Nội",
    image: "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=800&q=80",
    count: "85+ Homestay"
  },
  {
    name: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    count: "200+ Homestay"
  },
  {
    name: "Phú Quốc",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80",
    count: "150+ Homestay"
  },
];

function Home() {
    const navigate = useNavigate();
    const [allHomestays, setAllHomestays] = useState([]);
    const [filteredHomestays, setFilteredHomestays] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [likedRoomIds, setLikedRoomIds] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortPrice, setSortPrice] = useState("");

    const [bestSellers, setBestSellers] = useState([]);
    const [newestHomestays, setNewestHomestays] = useState([]);
    const [mostViewed, setMostViewed] = useState([]);

    const [bestPage, setBestPage] = useState(1);
    const [newestPage, setNewestPage] = useState(1);
    const [viewPage, setViewPage] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 6;
    const homestaysPerPage = 6;

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchHomestays();
        fetchHomeSections();

        if (user) {
            fetchUserWishlist();
        }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, sortPrice]);

    const fetchHomeSections = async () => {
        try {
            const [bestRes, newestRes, viewedRes] = await Promise.all([
                axios.get("http://localhost:8080/api/homestays/best-sellers"),
                axios.get("http://localhost:8080/api/homestays/newest"),
                axios.get("http://localhost:8080/api/homestays/most-viewed"),
            ]);

            setBestSellers(bestRes.data);
            setNewestHomestays(newestRes.data);
            setMostViewed(viewedRes.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu trang home:", error);
        }
    };

    const paginate = (items, page) => {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    };

    const viewedTotalPages = Math.ceil(mostViewed.length / itemsPerPage);
    const viewedPageItems = paginate(mostViewed, viewPage);

    const bestTotalPages = Math.ceil(bestSellers.length / itemsPerPage);
    const bestSellerPageItems = paginate(bestSellers, bestPage);

    const newestTotalPages = Math.ceil(newestHomestays.length / itemsPerPage);
    const newestPageItems = paginate(newestHomestays, newestPage);

    const fetchHomestays = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/homestays");
            setAllHomestays(response.data);
            setFilteredHomestays(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserWishlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/wishlist/user/${user.id}`);
            const ids = response.data.map(item => item.homestay?.id);
            setLikedRoomIds(ids);
        } catch (error) {
            console.error(error);
        }
    };

    // 2. Reset về trang 1 khi đổi Category
    const handleCategoryChange = (categoryValue) => {
        setCurrentPage(1);
        setSelectedCategory(categoryValue);
        if (categoryValue === "all") {
            setFilteredHomestays(allHomestays);
        } else {
            const filtered = allHomestays.filter(h => h.category === categoryValue);
            setFilteredHomestays(filtered);
        }
    };

    const handleToggleLike = async (e, homestayId) => {
        e.preventDefault();
        if (!user) {
            Notification.warning("⚠️ Bạn cần đăng nhập để sử dụng tính năng yêu thích!");
            return;
        }
        try {
            const res = await axios.post(`http://localhost:8080/api/wishlist/toggle?userId=${user.id}&homestayId=${homestayId}`);
            if (res.data === "ADDED") setLikedRoomIds([...likedRoomIds, homestayId]);
            else if (res.data === "REMOVED") setLikedRoomIds(likedRoomIds.filter(id => id !== homestayId));
        } catch (error) {
            console.error(error);
        }
    };

    // 3. Tạo dữ liệu sau khi search + sort
    const filteredAndSortedHomestays = [...filteredHomestays]
        .filter(
            room =>
                room.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                room.location?.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        .sort((a, b) => {
            if (sortPrice === "asc") {
                return a.price - b.price;
            }
            if (sortPrice === "desc") {
                return b.price - a.price;
            }
            return 0;
        });

    // 4. Tính toán phân trang
    const indexOfLastHomestay = currentPage * homestaysPerPage;
    const indexOfFirstHomestay = indexOfLastHomestay - homestaysPerPage;
    const currentHomestays = filteredAndSortedHomestays.slice(
        indexOfFirstHomestay,
        indexOfLastHomestay
    );
    const totalPages = Math.ceil(filteredAndSortedHomestays.length / homestaysPerPage);

    return (
        <div className="bg-white min-h-screen">
            <Navbar/>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

                {/* 1. Hero Banner */}
                <section className="relative h-[500px] rounded-[2rem] overflow-hidden mb-12 shadow-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600"
                        className="w-full h-full object-cover"
                        alt="Hero Banner"
                    />
                    <div
                        className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center p-4">
                        <h1 className="text-6xl font-black mb-4 tracking-tight">Luxestay</h1>
                        <p className="text-2xl font-light max-w-2xl">
                            Khám phá không gian sống sang trọng và tìm thấy homestay lý tưởng cho kỳ nghỉ của bạn.
                        </p>
                    </div>
                </section>

                {/* 2. Search Bar */}
                <section className="max-w-5xl mx-auto -mt-24 relative z-20 mb-20">
                    <div
                        className="bg-white shadow-2xl rounded-3xl p-4 md:p-8 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Địa
                                điểm</label>
                            <input
                                type="text"
                                placeholder="Bạn muốn đi đâu?"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full border-none focus:ring-0 text-gray-700 font-medium placeholder-gray-300"
                            />
                        </div>
                        <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Ngày
                                đến</label>
                            <input type="date" className="w-full border-none focus:ring-0 text-gray-700"/>
                        </div>
                        <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Ngày đi</label>
                            <input type="date" className="w-full border-none focus:ring-0 text-gray-700"/>
                        </div>
                        <button
                            className="w-full md:w-auto bg-blue-900 hover:bg-blue-800 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20">
                            Tìm kiếm
                        </button>
                    </div>
                </section>

                {/* 3. Popular Destinations */}
                <section className="mb-20">
                    <h2 className="text-3xl font-black text-gray-900 mb-8">Địa điểm phổ biến</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {POPULAR_DESTINATIONS.map((dest, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="relative h-64 rounded-3xl overflow-hidden mb-3">
                                    <img src={dest.image}
                                         className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                         alt={dest.name}/>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="font-bold text-xl">{dest.name}</p>
                                        <p className="text-xs text-gray-200">{dest.count}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Category Tabs & Sort Dropdown */}
                <section className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <h2 className="text-3xl font-black text-gray-900">Homestay nổi bật</h2>

                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={sortPrice}
                                onChange={(e) => setSortPrice(e.target.value)}
                                className="px-5 py-2.5 rounded-full text-sm font-bold bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all cursor-pointer"
                            >
                                <option value="">⏳ Sắp xếp giá</option>
                                <option value="asc">📉 Giá thấp → cao</option>
                                <option value="desc">📈 Giá cao → thấp</option>
                            </select>

                            <div className="flex space-x-2 overflow-x-auto pb-1">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.value)}
                                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                            selectedCategory === cat.value
                                                ? "bg-blue-900 text-white shadow-lg"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 5. Featured Homestays & 6. Sửa điều kiện rỗng */}
                    {filteredAndSortedHomestays.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl text-gray-400 font-medium italic">
                            Chưa có homestay nào thuộc danh mục này.
                        </div>
                    ) : (
                        <>
                            {/* 5. Sửa phần render sử dụng currentHomestays */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {currentHomestays.map((room) => (
                                    <Link to={`/homestay/${room.id}`} key={room.id} className="group">
                                        <div
                                            className="relative rounded-[2rem] overflow-hidden mb-4 shadow-md group-hover:shadow-2xl transition-all duration-500">
                                            <img src={room.image} alt={room.title}
                                                 className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"/>

                                            {/* Nút Like */}
                                            <button
                                                onClick={(e) => handleToggleLike(e, room.id)}
                                                className="absolute top-5 right-5 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-lg hover:scale-110 transition active:scale-95 z-10"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill={likedRoomIds.includes(room.id) ? "#ef4444" : "none"}
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke={likedRoomIds.includes(room.id) ? "#ef4444" : "#64748b"}
                                                    className="w-5 h-5"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                                </svg>
                                            </button>

                                            {/* Rating Tag */}
                                            <div
                                                className="absolute bottom-5 left-5 bg-blue-900/80 backdrop-blur text-white px-3 py-1 rounded-xl text-sm font-bold flex items-center gap-1">
                                                ⭐ 4.9
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">{room.title}</h3>
                                                <span
                                                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-bold">{room.category}</span>
                                            </div>
                                            <p className="text-gray-500 flex items-center gap-1 text-sm mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                </svg>
                                                {room.location}
                                            </p>
                                            <p className="text-gray-900 font-black text-xl">
                                                {room.price?.toLocaleString()} VNĐ <span
                                                className="text-sm text-gray-400 font-normal">/ đêm</span>
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* 7. Thêm Pagination UI */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        className="px-4 py-2 rounded-xl border disabled:opacity-50"
                                    >
                                        ←
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`w-10 h-10 rounded-xl font-bold transition ${
                                                currentPage === index + 1
                                                    ? "bg-blue-900 text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        className="px-4 py-2 rounded-xl border disabled:opacity-50"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* HOMESTAY BÁN CHẠY */}
                <section className="mb-20">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                        Homestay bán chạy
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Những homestay được khách hàng đặt nhiều nhất
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {bestSellerPageItems.map((room) => (
                            <Link to={`/homestay/${room.id}`} key={room.id} className="group">
                                <div className="relative rounded-[2rem] overflow-hidden mb-4 shadow-md group-hover:shadow-2xl transition-all duration-500">
                                    <img
                                        src={room.image}
                                        alt={room.title}
                                        className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    <div className="absolute bottom-5 left-5 bg-blue-900/80 backdrop-blur text-white px-3 py-1 rounded-xl text-sm font-bold">
                                        🔥 {room.bookingCount || 0} lượt đặt
                                    </div>
                                </div>

                                <div className="px-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                                            {room.title}
                                        </h3>
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-bold">
              {room.category}
            </span>
                                    </div>

                                    <p className="text-gray-500 flex items-center gap-1 text-sm mb-3">
                                        📍 {room.location}
                                    </p>

                                    <p className="text-gray-900 font-black text-xl">
                                        {room.price?.toLocaleString()} VNĐ
                                        <span className="text-sm text-gray-400 font-normal"> / đêm</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {bestTotalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                disabled={bestPage === 1}
                                onClick={() => setBestPage(bestPage - 1)}
                                className="px-4 py-2 rounded-xl border disabled:opacity-50"
                            >
                                ←
                            </button>

                            {[...Array(bestTotalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setBestPage(index + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold transition ${
                                        bestPage === index + 1
                                            ? "bg-blue-900 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                disabled={bestPage === bestTotalPages}
                                onClick={() => setBestPage(bestPage + 1)}
                                className="px-4 py-2 rounded-xl border disabled:opacity-50"
                            >
                                →
                            </button>
                        </div>
                    )}
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                        Homestay được xem nhiều nhất
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Những địa điểm đang được người dùng quan tâm nhiều
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {viewedPageItems.map((room) => (
                            <Link to={`/homestay/${room.id}`} key={room.id} className="group">
                                <div className="relative rounded-[2rem] overflow-hidden mb-4 shadow-md group-hover:shadow-2xl transition-all duration-500">
                                    <img
                                        src={room.image}
                                        alt={room.title}
                                        className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    <div className="absolute bottom-5 left-5 bg-purple-900/80 backdrop-blur text-white px-3 py-1 rounded-xl text-sm font-bold">
                                        👁 {room.viewCount || 0} lượt xem
                                    </div>
                                </div>

                                <div className="px-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                                            {room.title}
                                        </h3>
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-bold">
              {room.category}
            </span>
                                    </div>

                                    <p className="text-gray-500 flex items-center gap-1 text-sm mb-3">
                                        📍 {room.location}
                                    </p>

                                    {room.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {room.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-bold"
                                                >
                  #{tag.name}
                </span>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-gray-900 font-black text-xl">
                                        {room.price?.toLocaleString()} VNĐ
                                        <span className="text-sm text-gray-400 font-normal"> / đêm</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {viewedTotalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                disabled={viewPage === 1}
                                onClick={() => setViewPage(viewPage - 1)}
                                className="px-4 py-2 rounded-xl border disabled:opacity-50"
                            >
                                ←
                            </button>

                            {[...Array(viewedTotalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setViewPage(index + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold transition ${
                                        viewPage === index + 1
                                            ? "bg-blue-900 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                disabled={viewPage === viewedTotalPages}
                                onClick={() => setViewPage(viewPage + 1)}
                                className="px-4 py-2 rounded-xl border disabled:opacity-50"
                            >
                                →
                            </button>
                        </div>
                    )}
                </section>

                {/* HOMESTAY MỚI NHẤT */}
                <section className="mb-20">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                        Homestay mới nhất
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Những homestay vừa được chủ nhà đăng gần đây
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {newestPageItems.map((room) => (
                            <Link to={`/homestay/${room.id}`} key={room.id} className="group">
                                <div className="relative rounded-[2rem] overflow-hidden mb-4 shadow-md group-hover:shadow-2xl transition-all duration-500">
                                    <img
                                        src={room.image}
                                        alt={room.title}
                                        className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    <div className="absolute bottom-5 left-5 bg-emerald-700/80 backdrop-blur text-white px-3 py-1 rounded-xl text-sm font-bold">
                                        ✨ Mới đăng
                                    </div>
                                </div>

                                <div className="px-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                                            {room.title}
                                        </h3>
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-bold">
              {room.category}
            </span>
                                    </div>

                                    <p className="text-gray-500 flex items-center gap-1 text-sm mb-3">
                                        📍 {room.location}
                                    </p>

                                    <p className="text-gray-900 font-black text-xl">
                                        {room.price?.toLocaleString()} VNĐ
                                        <span className="text-sm text-gray-400 font-normal"> / đêm</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {newestTotalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                disabled={newestPage === 1}
                                onClick={() => setNewestPage(newestPage - 1)}
                                className="px-4 py-2 rounded-xl border disabled:opacity-50"
                            >
                                ←
                            </button>

                            {[...Array(newestTotalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setNewestPage(index + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold transition ${
                                        newestPage === index + 1
                                            ? "bg-blue-900 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                disabled={newestPage === newestTotalPages}
                                onClick={() => setNewestPage(newestPage + 1)}
                                className="px-4 py-2 rounded-xl border disabled:opacity-50"
                            >
                                →
                            </button>
                        </div>
                    )}
                </section>


                {/* 6. Why Choose Luxestay */}
                <section className="mt-32 py-16 bg-blue-950 rounded-[3rem] text-white px-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4">Vì sao chọn Luxestay?</h2>
                        <p className="text-blue-200">Chúng tôi mang lại trải nghiệm tốt nhất cho kỳ nghỉ của bạn</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div
                                className="w-20 h-20 bg-blue-900 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-xl">🏠
                            </div>
                            <h3 className="text-xl font-bold mb-3">Homestay chất lượng</h3>
                            <p className="text-blue-200 font-light">Mọi căn hộ đều được kiểm duyệt kỹ lưỡng về chất
                                lượng và tiện nghi.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="w-20 h-20 bg-blue-900 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-xl">💳
                            </div>
                            <h3 className="text-xl font-bold mb-3">Thanh toán an toàn</h3>
                            <p className="text-blue-200 font-light">Hệ thống thanh toán bảo mật, hỗ trợ nhiều phương
                                thức hiện đại.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="w-20 h-20 bg-blue-900 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-xl">⭐
                            </div>
                            <h3 className="text-xl font-bold mb-3">Đánh giá minh bạch</h3>
                            <p className="text-blue-200 font-light">Đánh giá từ người dùng thực giúp bạn có cái nhìn
                                khách quan nhất.</p>
                        </div>
                    </div>
                </section>

            </main>

            <Navbar/>
        </div>
    );
}

export default Home;
