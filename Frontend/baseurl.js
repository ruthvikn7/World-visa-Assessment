import axios from "axios";

const instance = axios.create({
   baseURL: "http://localhost:5000/api",
   headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export default instance;



