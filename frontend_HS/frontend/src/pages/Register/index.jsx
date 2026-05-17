import { useState } from "react";
import axios from "axios";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users",
        user
      );

      console.log(response.data);

      alert("Register success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />

      <br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <br />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

export default Register;