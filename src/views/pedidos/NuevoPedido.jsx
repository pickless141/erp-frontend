import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Select from 'react-select';
import Layout from '../../components/Layout';
import useStore from '../../store';
import axios from 'axios';

const NuevoPedido = () => {
    const navigate = useNavigate();
    const { tiendaSelect, fetchTiendaSelect } = useStore((state) => ({
        tiendaSelect: state.tiendaSelect,
        fetchTiendaSelect: state.fetchTiendaSelect
    }));
    const [tienda, setTienda] = useState(null);
    const [productos, setProductos] = useState([]);
    const [cantidades, setCantidades] = useState({});

    useEffect(() => {
        fetchTiendaSelect();  
    }, [fetchTiendaSelect]);

    const handleTiendaChange = async (selectedOption) => {
        setTienda(selectedOption);
        if (selectedOption) {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = import.meta.env.VITE_API_SERVER;
                const response = await axios.get(`${apiUrl}/tiendas/${selectedOption.value}/detalle`, {
                    headers: { 'x-auth-token': token },
                });
                setProductos(response.data.productos || []);
                const initialCantidades = {};
                response.data.productos.forEach(producto => {
                    initialCantidades[producto._id] = '';
                });
                setCantidades(initialCantidades);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                Swal.fire('Error', 'No se pudo cargar los productos de la tienda seleccionada', 'error');
            }
        } else {
            setProductos([]);
            setCantidades({});
        }
    };

    const handleCantidadChange = (productoId, value) => {
        setCantidades(prev => ({ ...prev, [productoId]: Number(value) }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const pedidoProductos = productos.map(producto => ({
            productoId: producto._id, 
            cantidad: cantidades[producto._id] || 0
        })).filter(p => p.cantidad > 0);
    
        if (pedidoProductos.length === 0) {
            Swal.fire('Advertencia', 'Debe agregar al menos un producto con cantidad mayor a cero.', 'warning');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_SERVER;
            const response = await axios.post(`${apiUrl}/pedidos/vendedor`, {
                tiendaId: tienda.value,
                productos: pedidoProductos
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                }
            });
    
            Swal.fire('Éxito', 'El pedido ha sido registrado exitosamente', 'success');
            navigate('/pedidos');
        } catch (error) {
            console.error('Error al registrar el pedido:', error);
            Swal.fire('Error', error.response.data.error, 'error');
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Nuevo Pedido</h1>
                <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Tienda:</label>
                        <Select
                            options={tiendaSelect}
                            onChange={handleTiendaChange}
                            value={tienda}
                            getOptionValue={(option) => option.value}
                            getOptionLabel={(option) => option.label}
                            className="mt-1"
                        />
                    </div>
                    {productos.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Productos</h2>
                        {productos.map((producto, index) => (
                            <div key={producto._id || index} className="flex justify-between items-center mt-4">
                                <span className="text-gray-700">{producto.nombre}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={cantidades[producto._id] || ''}
                                    onChange={e => handleCantidadChange(producto._id, e.target.value)}
                                    className="w-24 p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>
                )}
                    <div className="flex justify-between mt-4">
                        <Link
                            to="/pedidos" 
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Volver
                        </Link>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                            Registrar Pedido
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default NuevoPedido;