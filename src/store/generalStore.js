import { create } from "zustand";
import Swal from "sweetalert2";

const useGeneralStore = create((set) => ({
  // Estados y funciones para búsqueda
  searchTerm: "",
  currentPage: 1,
  setSearchTerm: (term) => set(() => ({ searchTerm: term })),
  setCurrentPage: (page) => set(() => ({ currentPage: page })),
  resetCurrentPage: () => set({ currentPage: 1 }),
  resetSearchTerm: () => set({ searchTerm: "" }),
  

  // Estado para eliminar un elemento
  eliminarItem: async (ruta, id, callbacks) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/${ruta}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!response.ok) throw new Error("Error al eliminar el elemento");

      Swal.fire("Eliminado!", "El elemento ha sido eliminado.", "success");
      if (callbacks?.onSuccess) callbacks.onSuccess();
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire("Error!", "No se pudo eliminar el elemento.", "error");
      if (callbacks?.onError) callbacks.onError();
    }
  },
}));

export default useGeneralStore;