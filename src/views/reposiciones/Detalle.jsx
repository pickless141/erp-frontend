import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';

const Detalle = () => {
  const { reposicionId } = useParams();
  const [productos, setProductos] = useState([]);

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
      <div>
        <h2 className="text-2xl font-semibold mb-4">Detalles de Productos</h2>
        <Link to="/reposiciones" className="bg-gray-300 py-2 px-5 mt-3 inline-block text-gray-700 focus:outline-none focus:shadow-outline rounded text-sm hover:bg-gray-400 mb-3 uppercase font-bold w-full lg:w-auto text-center">
          Volver 
        </Link>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 divide-y divide-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3">Productos</th>
                <th className="px-6 py-3">Cantidad Exhibida</th>
                <th className="px-6 py-3">Depósito</th>
                <th className="px-6 py-3">Sugerido</th>
                <th className="px-6 py-3">Vencidos</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {productos.map((producto) => (
                <tr key={producto._id}>
                  <td className="border px-6 py-4">
                    {producto.producto?.nombreProducto}
                  </td>
                  <td className="border px-6 py-4">{producto.cantidadExhibida}</td>
                  <td className="border px-6 py-4">{producto.deposito}</td>
                  <td className="border px-6 py-4">{producto.sugerido}</td>
                  <td className="border px-6 py-4">{producto.vencidos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Detalle;