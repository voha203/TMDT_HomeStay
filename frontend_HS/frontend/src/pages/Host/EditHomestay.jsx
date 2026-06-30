import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Notify from "../../components/Notification";

const EditHomestay = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [homestay, setHomestay] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        category: "",
        amenities: "",
    });

    const [oldImages, setOldImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomestay();
    }, [id]);

    const fetchHomestay = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/homestays/${id}`);
            const data = res.data;

            setHomestay({
                title: data.title || "",
                description: data.description || "",
                price: data.price || "",
                location: data.location || "",
                category: data.category || "",
                amenities: data.amenities || "",
            });

            if (data.images && data.images.length > 0) {
                setOldImages(data.images);
            } else if (data.image) {
                setOldImages([{ id: "main-image", imageUrl: data.image }]);
            } else {
                setOldImages([]);
            }
        } catch (error) {
            console.error(error);
            Notify.error("Không tải được dữ liệu homestay");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setHomestay({
            ...homestay,
            [e.target.name]: e.target.value,
        });
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        setNewImages(files);
        setPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("title", homestay.title);
            formData.append("description", homestay.description);
            formData.append("price", homestay.price);
            formData.append("location", homestay.location);
            formData.append("category", homestay.category);
            formData.append("amenities", homestay.amenities);

            newImages.forEach((img) => {
                formData.append("images", img);
            });

            await axios.put(
                `http://localhost:8080/api/homestays/${id}/with-images`,
                formData
            );

            Notify.success("Cập nhật homestay thành công");
            navigate("/host", { state: { refresh: Date.now() } });
        } catch (error) {
            console.error(error);
            Notify.error(error.response?.data || "Cập nhật homestay thất bại");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="bg-white px-8 py-6 rounded-2xl shadow">
                    Đang tải dữ liệu homestay...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/host")}
                        className="text-slate-600 hover:text-slate-900 mb-3"
                    >
                        ← Quay lại trang quản lý
                    </button>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Chỉnh sửa Homestay
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Cập nhật thông tin, tiện ích và hình ảnh bài đăng của bạn.
                    </p>
                </div>

                <form
                    onSubmit={handleUpdate}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Tên homestay
                            </label>
                            <input
                                name="title"
                                value={homestay.title}
                                onChange={handleChange}
                                placeholder="Nhập tên homestay"
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                value={homestay.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Mô tả chi tiết về homestay"
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Giá mỗi đêm
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    value={homestay.price}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: 1200000"
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Loại hình
                                </label>
                                <input
                                    name="category"
                                    value={homestay.category}
                                    onChange={handleChange}
                                    placeholder="Villa, Apartment, Homestay..."
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Địa điểm
                            </label>
                            <input
                                name="location"
                                value={homestay.location}
                                onChange={handleChange}
                                placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Tiện ích
                            </label>
                            <textarea
                                name="amenities"
                                value={homestay.amenities}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Wifi, Hồ bơi, BBQ, Bãi đỗ xe..."
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                            >
                                Lưu thay đổi
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/host")}
                                className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-300 transition"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 h-fit">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">
                            Hình ảnh Homestay
                        </h2>

                        <p className="text-sm text-slate-500 mb-3">Ảnh hiện tại</p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {oldImages.length > 0 ? (
                                oldImages.map((img) => (
                                    <img
                                        key={img.id}
                                        src={img.imageUrl}
                                        alt="homestay"
                                        className="h-28 w-full object-cover rounded-xl border"
                                    />
                                ))
                            ) : (
                                <div className="col-span-2 text-sm text-slate-400 border rounded-xl p-4 text-center">
                                    Chưa có ảnh
                                </div>
                            )}
                        </div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Chọn ảnh mới
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className="w-full text-sm border border-dashed border-slate-300 rounded-xl p-4 cursor-pointer"
                        />

                        {previews.length > 0 && (
                            <>
                                <p className="text-sm text-slate-500 mt-5 mb-3">
                                    Ảnh mới sẽ thay thế ảnh hiện tại
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    {previews.map((src, index) => (
                                        <img
                                            key={index}
                                            src={src}
                                            alt="preview"
                                            className="h-28 w-full object-cover rounded-xl border"
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditHomestay;