// Reposiciones.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from 'axios';

const Reposiciones = () => {
  const [reposiciones, setReposiciones] = useState({
    docs: [],
    totalDocs: 0,
    limit: 5,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReposiciones = useCallback(async (page) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `${apiUrl}/reposiciones/?page=${page}`,
        { headers: { 'x-auth-token': token } }
      );

      const data = response.data;

      if (data.docs && data.docs.length > 0 && data.docs[0]._id) {
        setReposiciones({ docs: data.docs, totalDocs: data.totalDocs, limit: data.limit });
      } else {
        console.warn('No se encontraron reposiciones.');
        setReposiciones({ docs: [], totalDocs: 0, limit: 5 });
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }, []);

  useEffect(() => {
    fetchReposiciones(currentPage);
  }, [currentPage, fetchReposiciones]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageCount = Math.ceil(reposiciones.totalDocs / reposiciones.limit);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Reposiciones</h1>
      <Link
        to="/nuevoregistro"
        className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
      >
        Nuevo Registro
      </Link>


      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 divide-y divide-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3">Tienda</th>
              <th className="px-6 py-3">Fecha de Reposición</th>
              <th className="px-6 py-3">Existencia Anterior</th>
              <th className="px-6 py-3">Existencia Actual</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {reposiciones.docs.map((reposicion) => (
              <tr key={reposicion._id}>
                <td className="border px-6 py-4">{reposicion.tienda?.nombreTienda}</td>
                <td className="border px-6 py-4">{new Date(reposicion.fechaReposicion).toLocaleDateString()}</td>
                <td className="border px-6 py-4">
                  {/* Renderiza la información de existencia anterior */}
                  {reposicion.existenciaAnterior.map((item) => (
                    <div key={item.producto._id}>
                      {item.producto.nombreProducto}: {item.cantidad}
                    </div>
                  ))}
                </td>
                <td className="border px-6 py-4">
                  {/* Renderiza la información de existencia actual */}
                  {reposicion.existenciaActual.map((item) => (
                    <div key={item.producto._id}>
                      {item.producto.nombreProducto}: {item.cantidad}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount && currentPage && (
  <div className="flex justify-center mt-4">
    {Array.from({ length: pageCount }, (_, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(index + 1)}
        className={`mx-1 px-3 py-1 rounded ${
          currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
)}
    </Layout>
  );
};

export default Reposiciones;