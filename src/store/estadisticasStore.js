import { create } from "zustand";
import axios from "axios";

const useEstadisticasStore = create((set) => ({
  estadisticasTiendas: [],
  estadisticasReposiciones: [],
  productosMasVendidos: [],
  productosMasVendidosPorTienda: [],
  
  fetchEstadisticasTiendas: async () => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/estadisticas/ventas`, {
        headers: { "x-auth-token": token },
      });
      set({ estadisticasTiendas: response.data });
    } catch (error) {
      console.error("Error al obtener estadísticas de tiendas:", error);
    }
  },
  
  fetchEstadisticasReposiciones: async () => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/estadisticas/usuarios-reposiciones`, {
        headers: { "x-auth-token": token },
      });
      set({ estadisticasReposiciones: response.data });
    } catch (error) {
      console.error("Error al obtener estadísticas de reposiciones:", error);
    }
  },

  fetchProductosMasVendidos: async () => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/estadisticas/productos-mas-vendidos`, {
        headers: { "x-auth-token": token },
      });
      set({ productosMasVendidos: response.data });
    } catch (error) {
      console.error("Error al obtener los productos más vendidos:", error);
    }
  },

  fetchProductosMasVendidosPorTienda: async (tiendaId) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.get(`${apiUrl}/estadisticas/productos-mas-vendidos/${tiendaId}`, {
        headers: { "x-auth-token": token },
      });
      set({ productosMasVendidosPorTienda: response.data });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(`No hay datos de productos vendidos para la tienda con ID: ${tiendaId}`);
        set({ productosMasVendidosPorTienda: [] });
      } else {
        console.error("Error al obtener los productos más vendidos por tienda:", error);
      }
    }
  },
  clearProductosMasVendidosPorTienda: () => set({ productosMasVendidosPorTienda: [] }),

  

}));

export default useEstadisticasStore;