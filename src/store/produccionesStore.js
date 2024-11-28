import { create } from "zustand";

const useProduccionesStore = create((set) => ({
  producciones: { docs: [], totalDocs: 0, limit: 10 },
  fetchProducciones: async (page = 1) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/producciones/?page=${page}&perPage=10`, {
        method: "GET",
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Error en la solicitud");

      const data = await response.json();
      set({
        producciones: {
          docs: data.producciones,
          totalDocs: data.totalProducciones,
          limit: 10,
        },
      });
    } catch (error) {
      console.error("Error al obtener las producciones:", error);
    }
  },
}));


export default useProduccionesStore;