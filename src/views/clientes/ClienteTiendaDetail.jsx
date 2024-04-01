// ClienteTiendaDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';

const ClienteTiendaDetail = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [tiendas, setTiendas] = useState([]);

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_SERVER;

        if (clienteId !== undefined) {
          const response = await axios.get(
            `${apiUrl}/tiendas/${clienteId}/tiendas`,
            {
              headers: {
                'x-auth-token': token,
              },
            }
          );

          console.log('Tiendas del cliente:', response.data);

          setTiendas(response.data);
        } else {
          console.error('clienteId es undefined');
        }
      } catch (error) {
        console.error('Error al obtener las tiendas del cliente:', error);
      }
    };

    if (clienteId !== undefined) {
      fetchTiendas();
    }
  }, [clienteId]);

  if (clienteId === undefined) {
    console.log('clienteId: undefined');
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        {tiendas.length > 0 ? (
          <div>
            <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden rounded-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Nombre de la Tienda
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tiendas.map((tienda) => (
                  <tr key={tienda._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{tienda.nombreTienda}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => navigate('/home')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
            >
              Volver a Clientes
            </button>
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-700">No hay tiendas registradas.</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded shadow focus:outline-none focus:shadow-outline"
            >
              Volver a Clientes
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClienteTiendaDetail;