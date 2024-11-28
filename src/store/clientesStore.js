import { create } from "zustand";
import axios from "axios";

const useClientesStore = create((set) => ({
  clientes: { docs: [], totalDocs: 0, limit: 5 },
  
  fetchClientes: async (page = 1, search = "") => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/clientes/?page=${page}&search=${search}`, {
        headers: { "x-auth-token": token },
      });
      set({ clientes: response.data });
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  },
}));

export default useClientesStore;