import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';

const ClienteTiendaDetail = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [tiendas, setTiendas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [limit, setLimit] = useState(10);

  
  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_SERVER;

        if (clienteId) {
          const response = await axios.get(`${apiUrl}/tiendas/${clienteId}/tiendas?page=${currentPage}&limit=${limit}`, {
            headers: { 'x-auth-token': token },
          });

          setTiendas(response.data.docs);
          setTotalDocs(response.data.totalDocs);
          setLimit(response.data.limit);
        } else {
          console.error('clienteId is undefined');
        }
      } catch (error) {
        console.error('Error al obtener las tiendas del cliente:', error);
      }
    };

    fetchTiendas();
  }, [clienteId, currentPage, limit]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        {tiendas.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="flex justify-end mb-4"> 
              <button
                onClick={() => navigate('/home')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Volver
              </button>
            </div>
            <table className="min-w-full table-auto shadow-md">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Nombre de la Tienda
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {tiendas.map((tienda) => (
                  <tr key={tienda._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{tienda.nombreTienda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              pageCount={Math.ceil(totalDocs / limit)}
              onPageChange={handlePageChange}
              totalDocs={totalDocs}
              limit={limit}
            />
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-700">No hay tiendas registradas para este cliente.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClienteTiendaDetail;