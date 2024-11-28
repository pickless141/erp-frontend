import { create } from "zustand";
import axios from "axios";

const useMenuStore = create((set) => ({
  menuOpciones: [],
  fetchMenuOpciones: async () => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${apiUrl}/menus`, {
        headers: { "x-auth-token": token },
      });
      set({ menuOpciones: response.data });
    } catch (error) {
      console.error("Error al obtener las opciones del menú:", error);
    }
  },
}));


export default useMenuStore;