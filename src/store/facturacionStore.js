import { create } from "zustand";
import axios from "axios";

const useFacturasStore = create((set) => ({
    facturas: [],

    fetchFacturas: async () => {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(`${apiUrl}/facturacion/facturas`, {
                headers:{"x-auth-token": token},
            });
            set({facturas: response.data});
        } catch (error) {
            console.error("Error al obtener las factuas", error)
        }
    }
}))


export default useFacturasStore;