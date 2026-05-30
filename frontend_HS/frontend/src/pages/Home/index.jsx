import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../../components/Navbar";
import HomestayCard from "../../components/HomestayCard";

function Home() {

  const [homestays, setHomestays] = useState([]);

  useEffect(() => {

    fetchHomestays();

  }, []);

  const fetchHomestays = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8080/api/homestays"
      );

      setHomestays(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      {/* HERO */}

      <section className="h-screen relative">

        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt=""
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">

          <h1 className="text-6xl font-bold mb-6">
            Tinh hoa kỳ nghỉ Việt
          </h1>

          <p className="text-xl">
            Luxury Homestay Booking
          </p>

        </div>

      </section>

      {/* HOMESTAY LIST */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-4xl font-bold mb-10">
          Homestay nổi bật
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {
            homestays.map((item) => (

              <HomestayCard
                key={item.id}
                item={item}
              />

            ))
          }

        </div>

      </section>

    </div>
  );
}

export default Home;