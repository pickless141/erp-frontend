import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';
import Swal from 'sweetalert2';

const ReposicionesTienda = () => {
    const { tiendaId } = useParams();
    const [reposiciones, setReposiciones] = useState({ docs: [], totalDocs: 0, limit: 10 });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchReposicionesPorTienda = async () => {
            const apiUrl = import.meta.env.VITE_API_SERVER;
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${apiUrl}/reposiciones/tienda/${tiendaId}?page=${currentPage}&limit=${reposiciones.limit}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener las reposiciones');
                }

                const data = await response.json();
                setReposiciones(data);
            } catch (error) {
                console.error('Error al obtener las reposiciones:', error);
                Swal.fire('Error!', 'No se pudo obtener las reposiciones.', 'error');
            }
        };

        fetchReposicionesPorTienda();
    }, [tiendaId, currentPage, reposiciones.limit]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8">
                <h2 className="text-2xl text-gray-800 font-semibold mb-6">Reposiciones de la Tienda</h2>
                
                {reposiciones.docs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto shadow-md w-full">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-3">Fecha de Reposición</th>
                                    <th className="px-4 py-3">Ver Detalle</th>
                                    <th className="px-4 py-3">Registrado por</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {reposiciones.docs.map((reposicion) => (
                                    <tr key={reposicion._id} className="hover:bg-gray-100">
                                        <td className="border px-4 py-2">{new Date(reposicion.fechaReposicion).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">
                                            <Link to={`/reposiciones/${reposicion._id}/detalles-productos`} state={{ tiendaId: tiendaId }} className="text-blue-500 hover:text-blue-800">Ver Detalle</Link>
                                        </td>
                                        <td className="border px-4 py-2">{reposicion.usuario ? `${reposicion.usuario.nombre} ${reposicion.usuario.apellido}` : 'Desconocido'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            pageCount={Math.ceil(reposiciones.totalDocs / reposiciones.limit)}
                            onPageChange={handlePageChange}
                            totalDocs={reposiciones.totalDocs}
                            limit={reposiciones.limit}
                        />
                    </div>
                ) : (
                    <div className="text-center mt-8">
                        <p className="text-gray-700">No hay reposiciones registradas para esta tienda.</p>
                    </div>
                )}

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

export default ReposicionesTienda;