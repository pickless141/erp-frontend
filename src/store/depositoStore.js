import { create } from "zustand";

const useDepositoStore = create((set) => ({
  deposito: { productos: [], total: 0 }, 
  fetchDeposito: async () => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/producciones/deposito`, {
        method: "GET",
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Error en la solicitud");

      const data = await response.json();

      set({
        deposito: {
          productos: data.productosDeposito,
          total: data.productosDeposito.length,
        },
      });
    } catch (error) {
      console.error("Error al obtener el depósito:", error);
    }
  },
  editCantidad: async (id, nuevaCantidad) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/producciones/deposito/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });

      if (!response.ok) throw new Error("Error al editar la cantidad");

      const updatedItem = await response.json();

      set((state) => ({
        deposito: {
          ...state.deposito,
          productos: state.deposito.productos.map((item) =>
            item._id === id ? { ...item, cantidad: updatedItem.cantidad } : item
          ),
        },
      }));
    } catch (error) {
      console.error("Error al editar la cantidad:", error);
    }
  },
}));

export default useDepositoStore;