import { create } from "zustand";
import axios from "axios";

const useInsumosStore = create((set) => ({
  insumos: { docs: [], totalDocs: 0, limit: 10 },
  fetchInsumos: async (page = 1, search = "") => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/insumos/?page=${page}&search=${search}`, {
        headers: { "x-auth-token": token },
      });
      set({ insumos: response.data });
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
    }
  },
}));

export default useInsumosStore;