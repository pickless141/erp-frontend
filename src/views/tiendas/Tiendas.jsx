import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import EditarTienda from './EditarTienda';
import { FaEdit } from "react-icons/fa";

const Tiendas = () => {
  const navigate = useNavigate();
  const [tiendas, setTiendas] = useState({ docs: [], totalDocs: 0, limit: 5 });
  const [tiendaEditarId, setTiendaEditarId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTiendas = useCallback(async (token, page, search) => {
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const response = await fetch(`${apiUrl}/tiendas/?page=${page}&search=${search}`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }

      const data = await response.json();

      if (data.docs && data.docs.length > 0 && data.docs[0]._id) {
        setTiendas({ docs: data.docs, totalDocs: data.totalDocs, limit: data.limit });
      } else {
        console.error('La estructura de la respuesta no es la esperada:', data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTiendas(token, currentPage, searchTerm);
    } else {
      console.error('Token no disponible');
    }
  }, [currentPage, searchTerm, fetchTiendas]);

  const handleEditarTiendaClick = (tiendaId) => {
    if (tiendaId) {
      setTiendaEditarId(tiendaId);
      navigate(`/editartienda/${tiendaId}`);
    } else {
      console.error('tiendaId es undefined');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const pageCount = Math.ceil(tiendas.totalDocs / tiendas.limit);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Tiendas</h1>
      <Link
        to="/nuevatienda"
        className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
      >
        Nueva Tienda
      </Link>

      <input
        type="text"
        placeholder="Buscar por nombre de tienda"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="block w-full py-2 px-3 border rounded shadow-sm mb-4"
      />

      <div className="overflow-x-scroll">
        <table className="table-auto shadow-md mt-10 w-full lg:w-auto">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Cliente</th>
              <th className="w-1/5 py-2">Tienda</th>
              <th className="w-1/5 py-2">Direccion</th>
              <th className="w-1/5 py-2">Descripción</th>
              <th className="w-1/5 py-2">Editar</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {tiendas.docs.map((tienda, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{tienda.nombreCliente}</td>
                <td className="border px-4 py-2">{tienda.nombreTienda}</td>
                <td className="border px-4 py-2">{tienda.direccion}</td>
                <td className="border px-4 py-2">{tienda.descripcion}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      handleEditarTiendaClick(tienda._id);
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  >
                    <FaEdit color="white" 
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center mt-4">
          {[...Array(pageCount)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {tiendaEditarId && <EditarTienda tiendaId={tiendaEditarId} />}
    </Layout>
  );
};

export default Tiendas;