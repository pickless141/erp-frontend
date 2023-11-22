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
      <div className="overflow-x-scroll">
        {tiendas.length > 0 ? (
          <div>
            <table className="table-auto shadow-md mt-10 w-full w-lg">
              <thead className="bg-gray-800">
                <tr className="text-white">
                  <th className="w-1/5 py-2">Nombre de la Tienda</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {tiendas.map((tienda) => (
                  <tr key={tienda._id}>
                    <td className="border px-4 py-2">{tienda.nombreTienda}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => navigate('/home')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2  px-4 rounded mt-4"
            >
              Volver a Clientes
            </button>
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-700">No hay tiendas registradas.</p>
            <button
              onClick={() => navigate('/home')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mr-4"
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