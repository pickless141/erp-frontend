import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';
import Swal from 'sweetalert2';

const PedidosTienda = () => {
    const { tiendaId } = useParams();
    const [pedidos, setPedidos] = useState({ docs: [], totalDocs: 0, limit: 10 });
    const [currentPage, setCurrentPage] = useState(1);
    const [nombreTienda, setNombreTienda] = useState('');

    useEffect(() => {
        const fetchPedidosPorTienda = async () => {
            const apiUrl = import.meta.env.VITE_API_SERVER;
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${apiUrl}/pedidos/tienda/${tiendaId}?page=${currentPage}&limit=${pedidos.limit}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los pedidos');
                }

                const data = await response.json();
                setPedidos(data);
                if (data.docs.length > 0) {
                    setNombreTienda(data.docs[0].tienda.nombreTienda); 
                }
            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
                Swal.fire('Error!', 'La tienda no tiene pedidos.');
            }
        };

        fetchPedidosPorTienda();
    }, [tiendaId, currentPage, pedidos.limit]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8">
                <h2 className="text-2xl text-gray-800 font-semibold mb-6">
                    Pedidos de la Tienda: {nombreTienda || 'Cargando...'}
                </h2>
                
                {pedidos.docs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto shadow-md w-full">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-3">Fecha del Pedido</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Resumen del Pedido</th>
                                    <th className="px-4 py-3">Monto Total</th>
                                    <th className="px-4 py-3">Registrado por</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {pedidos.docs.map((pedido) => (
                                    <tr key={pedido._id} className="hover:bg-gray-100">
                                        <td className="border px-4 py-2">{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">{pedido.estado}</td>
                                        <td className="border px-4 py-2">
                                            <Link to={`/pedidos/${pedido._id}/resumenPedido`} className="text-blue-500 hover:text-blue-800">Ver Resumen</Link>
                                        </td>
                                        <td className="border px-4 py-2">{pedido.total} Gs.</td>
                                        <td className="border px-4 py-2">{pedido.usuario ? `${pedido.usuario.nombre} ${pedido.usuario.apellido}` : 'Desconocido'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center mt-8">
                        <p className="text-gray-700">No hay pedidos registrados para esta tienda.</p>
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    pageCount={Math.ceil(pedidos.totalDocs / pedidos.limit)}
                    onPageChange={handlePageChange}
                    totalDocs={pedidos.totalDocs}
                    limit={pedidos.limit}
                />

                <div className="mt-2 flex justify-center">
                    <Link
                        to="/tiendas"
                        className="bg-gray-300 flex items-end hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto"
                    >
                        Volver
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default PedidosTienda;