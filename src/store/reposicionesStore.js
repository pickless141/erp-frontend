import { create } from "zustand";
import axios from "axios";

const useReposicionesStore = create((set) => ({
  reposiciones: { docs: [], totalDocs: 0, limit: 5 },
  ultimasReposiciones: [],
  errorUltimasReposiciones: null,
  loadingUltimasReposiciones: false,
  categorias: [],

  fetchReposiciones: async (page = 1, limit = 5, search = "") => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${apiUrl}/reposiciones?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        { headers: { "x-auth-token": token } }
      );
      set({ reposiciones: response.data });
    } catch (error) {
      console.error("Error al obtener las reposiciones:", error);
    }
  },

  fetchUltimasReposiciones: async (tiendaId, categoria) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    set({ loadingUltimasReposiciones: true, errorUltimasReposiciones: null });
    try {
      const response = await axios.get(
        `${apiUrl}/reposiciones/ultimas/${tiendaId}?categoria=${categoria}`,
        { headers: { "x-auth-token": token } }
      );
      set({
        ultimasReposiciones: response.data.reposiciones,
        loadingUltimasReposiciones: false,
      });
    } catch (error) {
      console.error("Error al obtener las últimas reposiciones:", error);
      set({
        ultimasReposiciones: [],
        errorUltimasReposiciones: "No se encontraron reposiciones.",
        loadingUltimasReposiciones: false,
      });
    }
  },

  fetchCategorias: () => {
    const userEmpresa = localStorage.getItem("empresa")?.trim();

    const todasLasCategorias = [
      { value: "Lievito", label: "Lievito" },
      { value: "EatWell", label: "EatWell" },
    ];

    if(userEmpresa === 'EatWell') {
      set({categorias: todasLasCategorias.filter((cat) => cat.value === 'EatWell') });
    } else if (userEmpresa === 'Lievito') {
      set({categorias: todasLasCategorias});
    } else {
      set({ categorias: [] });
    }
  },


  resetUltimasReposiciones: () => {
    set({
      ultimasReposiciones: [],
      errorUltimasReposiciones: null,
      loadingUltimasReposiciones: false,
    });
  },
}));

export default useReposicionesStore;