import { create } from "zustand";
import axios from "axios";

const useReposicionesStore = create((set) => ({
  reposiciones: { docs: [], totalDocs: 0, limit: 5 },
  fetchReposiciones: async (page = 1, limit = 5) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/reposiciones/?page=${page}&limit=${limit}`, {
        headers: { "x-auth-token": token },
      });
      set({ reposiciones: response.data });
    } catch (error) {
      console.error("Error al obtener las reposiciones:", error);
    }
  },
}));


export default useReposicionesStore;