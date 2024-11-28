import { create } from "zustand";
import axios from "axios";

const useTiendasStore = create((set) => ({
  tiendas: { docs: [], totalDocs: 0, limit: 5 },

  fetchTiendas: async (page = 1, search = "") => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/tiendas/?page=${page}&search=${search}`, {
        headers: { "x-auth-token": token },
      });
      set({ tiendas: response.data });
    } catch (error) {
      console.error("Error al obtener las tiendas:", error);
    }
  },

  tiendaSelect: [],
  
  fetchTiendaSelect: async () => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/tiendas/tiendaSelect`, {
        headers: { "x-auth-token": token },
      });
      const tiendaSelect = response.data.map((tienda) => ({
        value: tienda._id,
        label: tienda.nombreTienda, 
        cliente: tienda.cliente, 
        productos: tienda.productos 
      }));
      set({ tiendaSelect });
    } catch (error) {
      console.error("Error al obtener las tiendas:", error);
    }
  },
}));

export default useTiendasStore;