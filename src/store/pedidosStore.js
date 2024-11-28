import { create } from "zustand";
import axios from "axios";

const usePedidosStore = create((set) => ({
  pedidos: { docs: [], totalDocs: 0, limit: 3 },
  
  fetchPedidos: async (page = 1) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/pedidos/?page=${page}&perPage=3`, {
        headers: { "x-auth-token": token },
      });
      set({ pedidos: response.data });
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  },
  
  
  updatePedidoEstado: async (pedidoId, nuevoEstado) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${apiUrl}/pedidos/${pedidoId}/cambiarEstado`,
        { nuevoEstado },
        { headers: { "Content-Type": "application/json", "x-auth-token": token } }
      );
      if (response.status === 200) {
        set((state) => {
          const updatedPedidos = state.pedidos.docs.map((pedido) => {
            if (pedido._id === pedidoId) return { ...pedido, estado: nuevoEstado };
            return pedido;
          });
          return { pedidos: { ...state.pedidos, docs: updatedPedidos } };
        });
        return { success: true };
      }
    } catch (error) {
      console.error("Error al cambiar el estado del pedido:", error);
      return { success: false, error };
    }
  },
}));

export default usePedidosStore;