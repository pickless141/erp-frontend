import axios from "axios";
import Swal from "sweetalert2";
import { create } from "zustand";

const useStore = create((set) => ({

    searchTerm: '',
    currentPage: 1,
    // Funciones para actualizar el término de búsqueda y la página actual
    setSearchTerm: (term) => set(() => ({ searchTerm: term })),
    setCurrentPage: (page) => set(() => ({ currentPage: page })),

    //Estado para traer todos los productos
    productos: [],
    fetchProductos: async () => {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${apiUrl}/productos/`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                },
            });
            if (!response.ok){
                throw new Error('Error en la solicitud');
            }
            const productos = await response.json();
            set({ productos})
        } catch (error) {
            console.error('Error al obtener los productos:', error)
        }
    },

    // Estado y funciones para clientes
    clientes: { docs: [], totalDocs: 0, limit: 5 },
    fetchClientes: async (page = 1, search = '') => {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(`${apiUrl}/clientes/?page=${page}&search=${search}`, {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (response.status !== 200) {
                throw new Error('Error al obtener los clientes');
            }

            const { docs, totalDocs, limit } = response.data;
            set({ clientes: { docs, totalDocs, limit } });
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    },
    
    
    //estado para el select de tiendas
    tiendaSelect: [],
    fetchTiendaSelect: async () => {
        try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const response = await axios.get(`${apiUrl}/tiendas/tiendaSelect`, {
            headers: {
            'x-auth-token': token,
            },
        });

        const tiendaSelect = response.data.map(tienda => ({
            value: tienda._id,
            label: tienda.nombreTienda,
        }));
        
        set({ tiendaSelect });
        } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        }
    },
    
    //Estado para traer todas las tiendas 
    tiendas: { docs: [], totalDocs: 0, limit: 5 },
    fetchTiendas: async (page = 1, search = '') => {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem("token");

        try {
        const response = await axios.get(`${apiUrl}/tiendas/?page=${page}&search=${search}`, {
            headers: {
            'x-auth-token': token,
            },
        });

        if (response.status !== 200) {
            throw new Error('Error al obtener las tiendas');
        }

        const { docs, totalDocs, limit } = response.data;
        set({ tiendas: { docs, totalDocs, limit } });
        } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        }
    },
     
    //Estado para los pedidos
    pedidos: { docs: [], totalDocs: 0, limit: 3 },
    fetchPedidos: async (page = 1) => {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem('token');

        try {
        const response = await axios.get(`${apiUrl}/pedidos/?page=${page}&perPage=3`, {
            headers: {
            'x-auth-token': token,
            },
        });

        if (response.status !== 200) {
            throw new Error('Error al obtener los pedidos');
        }
        const { docs, totalDocs, limit } = response.data;

        set({ pedidos: { docs, totalDocs, limit } });
        console.log("Pedidos cargados:", docs);
        } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        }
    },
    updatePedidoEstado: (pedidoId, nuevoEstado) => set((state) => {
        const updatedPedidos = state.pedidos.docs.map((pedido) => {
        if (pedido._id === pedidoId) {
            return { ...pedido, estado: nuevoEstado };
        }
        return pedido;
        });
        return { pedidos: { ...state.pedidos, docs: updatedPedidos } };
    }),

    // Estado para traer todas las producciones
    producciones: { docs: [], totalDocs: 0, limit: 10 },
    fetchProducciones: async (page = 1) => {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${apiUrl}/producciones/?page=${page}&perPage=10`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                },
            });
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const data = await response.json();
            set({ producciones: { docs: data.producciones, totalDocs: data.totalProducciones, limit: 10 } });
        } catch (error) {
            console.error('Error al obtener las producciones:', error);
        }
    },
    
    //Estado para traer todos los estados 
    insumos: { docs: [], totalDocs: 0, limit: 10 },
    fetchInsumos: async (page = 1, search = '') => {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(`${apiUrl}/insumos/?page=${page}&search=${search}`, {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (response.status !== 200) {
                throw new Error('Error al obtener los insumos');
            }

            const { docs, totalDocs, limit } = response.data;
            set({ insumos: { docs, totalDocs, limit } });
        } catch (error) {
            console.error('Error al obtener los insumos:', error);
        }
    },

    //Estado para las reposiciones
    reposiciones: {docs: [], totalDocs: 0, limit: 5},
    fetchReposiciones: async (page = 1) => {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem('token');
    
        try {
          const response = await axios.get(`${apiUrl}/reposiciones/?page=${page}`, {
            headers: { 'x-auth-token': token },
          });
    
          const data = response.data;
    
          if (data.docs && data.docs.length > 0 && data.docs[0]._id) {
            set({ reposiciones: { docs: data.docs, totalDocs: data.totalDocs, limit: data.limit } });
          } else {
            console.warn('No se encontraron reposiciones.');
            set({ reposiciones: { docs: [], totalDocs: 0, limit: 5 } });
          }
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
    },

   //Estado para eliminar datos 
    eliminarItem: async (ruta, id, callbacks) => {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem('token');
    
        fetch(`${apiUrl}/${ruta}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
        },
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el elemento');
        }
        return response.json();
        })
        .then(() => {
        Swal.fire('Eliminado!', 'El elemento ha sido eliminado.', 'success');
        if (callbacks && callbacks.onSuccess) {
            callbacks.onSuccess();
        }
        })
        .catch(error => {
        console.error('Error al eliminar:', error);
        Swal.fire('Error!', 'No se pudo eliminar el elemento.', 'error');
        if (callbacks && callbacks.onError) {
            callbacks.onError();
        }
        });
    },
}))

export default useStore;