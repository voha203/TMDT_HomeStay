import { Link } from "react-router-dom";
function HomestayCard({ item }) {

  return (
 <Link to={`/homestay/${item.id}`}>
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 duration-300">

      <img
        src={item.image}
        alt=""
        className="w-full h-64 object-cover"
      />

      <div className="p-5">

        <h2 className="text-xl font-bold mb-2">
          {item.title}
        </h2>

        <p className="text-gray-500 mb-2">
          {item.location}
        </p>

        <p className="text-blue-900 font-bold text-lg">
          {item.price} VNĐ
        </p>

      </div>

    </div>
</Link>
  );
}

export default HomestayCard;