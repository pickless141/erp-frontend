import { create } from "zustand";
import axios from "axios";

const useProductosStore = create((set) => ({
  productos: [],
  fetchProductos: async () => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/productos/`, {
        headers: { "x-auth-token": token },
      });
      set({ productos: response.data });
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  },
}));

export default useProductosStore;