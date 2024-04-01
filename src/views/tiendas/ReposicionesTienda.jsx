import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Swal from 'sweetalert2';

const ReposicionesTienda = () => {
    const { tiendaId } = useParams();
    const [reposiciones, setReposiciones] = useState([]);

    useEffect(() => {
        const fetchReposicionesPorTienda = async () => {
            const apiUrl = import.meta.env.VITE_API_SERVER;
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${apiUrl}/reposiciones/tienda/${tiendaId}`, {
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
    }, [tiendaId]);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8">
                <h2 className="text-2xl text-gray-800 font-semibold mb-6">Reposiciones de la Tienda</h2>
                {reposiciones.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden rounded-lg">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Fecha de Reposición
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Ver Detalle
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Registrado por
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reposiciones.map((reposicion, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(reposicion.fechaReposicion).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/reposiciones/${reposicion._id}/detalles-productos`} state={{ tiendaId: tiendaId }} className="text-blue-500 hover:text-blue-800">Ver Detalle</Link>
                                        </td>
                                        <td >{reposicion.usuario ? `${reposicion.usuario.nombre} ${reposicion.usuario.apellido}` : 'Desconocido'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center mt-8">
                        <p className="text-gray-700">No hay reposiciones registradas para esta tienda.</p>
                    </div>
                )}
                <div className="mt-8 text-center">
                    <Link
                        to="/tiendas"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-lg"
                    >
                        Volver a Tiendas
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default ReposicionesTienda;