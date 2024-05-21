import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';

const DetallePedido = () => {
    const { pedidoId } = useParams();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = import.meta.env.VITE_API_SERVER;
                const response = await axios.get(`${apiUrl}/pedidos/${pedidoId}/resumen`, {
                    headers: { 'x-auth-token': token }
                });
                setProductos(response.data.pedidos);
            } catch (error) {
                console.error('Error al obtener los detalles del pedido:', error);
            }
        };

        fetchData();
    }, [pedidoId]);

    return (
        <Layout>
            <div className="mt-5">
                <h2 className="text-2xl font-semibold mb-4">Detalle del Pedido</h2>
                <button onClick={() => navigate(-1)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto">
                  Volver
                </button>
                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full bg-white border border-gray-300 divide-y divide-gray-300">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Cantidad
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                            {productos.map((producto) => (
                                <tr key={producto._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {producto.producto}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {producto.cantidad}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default DetallePedido;