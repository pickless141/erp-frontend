import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import EditarInsumo from './EditarInsumo';
import { FaEdit } from 'react-icons/fa';

const Insumos = () => {
  const navigate = useNavigate();
  const [insumos, setInsumos] = useState({ docs: [], totalDocs: 0, limit: 10 });
  const [insumoEditarId, setInsumoEditarId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchInsumos = useCallback(async (token, page, search) => {
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const response = await fetch(`${apiUrl}/insumos/?page=${page}&search=${search}`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error al obtener los datos. Código de estado: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.docs && data.docs.length > 0 && data.docs[0]._id) {
        setInsumos({ docs: data.docs, totalDocs: data.totalDocs, limit: data.limit });
      } else {
        console.error('La estructura de la respuesta no es la esperada:', data);
      }
    } catch (error) {
      console.error('Error al procesar la respuesta del servidor:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchInsumos(token, currentPage, searchTerm);
    } else {
      console.error('Token no disponible');
    }
  }, [currentPage, searchTerm, fetchInsumos]);

  const handleEditarInsumoClick = (insumoId) => {
    if (insumoId) {
      setInsumoEditarId(insumoId);
      navigate(`/editarinsumo/${insumoId}`);
    } else {
      console.error('insumoId es undefined');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const pageCount = Math.ceil(insumos.totalDocs / insumos.limit);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-4">Insumos</h1>
      <Link
        to="/nuevoinsumo"
        className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
      >
        Nuevo Insumo
      </Link>

      <input
        type="text"
        placeholder="Buscar por nombre de insumo"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="block w-80 py-2 px-3 border rounded shadow-sm mb-4"
      />

      <div className="overflow-auto w-full lg:w-auto">
        <table className="table-auto shadow-md mt-10 w-full lg:w-auto">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/4 py-2">Producto</th>
              <th className="w-1/4 py-2">Peso</th>
              <th className="w-1/4 py-2">Descripción</th>
              <th className="w-1/4 py-2">Editar</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {insumos.docs.map((insumo, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{insumo.producto}</td>
                <td className="border px-4 py-2">{insumo.peso}</td>
                <td className="border px-4 py-2">{insumo.descripcion}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      handleEditarInsumoClick(insumo._id);
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  >
                    <FaEdit color="white" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
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

      {insumoEditarId && <EditarInsumo insumoId={insumoEditarId} />}
    </Layout>
  );
};

export default Insumos;