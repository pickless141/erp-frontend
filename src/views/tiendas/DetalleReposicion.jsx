import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';

const DetalleReposicion = () => {
    const { reposicionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [productos, setProductos] = useState([]);
    const tiendaId = location.state?.tiendaId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const response = await axios.get(
          `${apiUrl}/reposiciones/${reposicionId}/detalles-productos`,
          { headers: { 'x-auth-token': token } }
        );
        setProductos(response.data.productos);
      } catch (error) {
        console.error('Error al obtener los detalles de productos:', error);
      }
    };

    fetchData();
  }, [reposicionId]);

  return (
    <Layout>
      <div className="mt-5">
        <h2 className="text-2xl font-semibold mb-4">Detalles de Productos de la Reposición</h2>
        <button onClick={() => navigate(`/reposiciones/tienda/${tiendaId}`)} className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
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
                  Cantidad Exhibida
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Depósito
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Sugerido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Vencidos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {productos.map((producto) => (
                <tr key={producto._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {producto.producto?.nombreProducto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {producto.cantidadExhibida}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {producto.deposito}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {producto.sugerido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {producto.vencidos}
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

export default DetalleReposicion;