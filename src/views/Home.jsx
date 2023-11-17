import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ClienteTiendaDetail from './clientes/ClienteTiendaDetail';
import EditarCliente from './clientes/EditarCliente';

const Home = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState({ docs: [], totalDocs: 0, limit: 5 });
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteEditarId, setClienteEditarId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchClientes = useCallback(async (token, page, search) => {
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const response = await fetch(`${apiUrl}/clientes/?page=${page}&search=${search}`, {
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
        setClientes({ docs: data.docs, totalDocs: data.totalDocs, limit: data.limit });
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
      fetchClientes(token, currentPage, searchTerm);
    } else {
      console.error('Token no disponible');
    }
  }, [currentPage, searchTerm, fetchClientes]);

  const handleVerTiendasClick = (clienteId) => {
    if (clienteId) {
      setClienteSeleccionado(clienteId);
    } else {
      console.error('clienteId es undefined');
    }
  };

  const handleEditarClienteClick = (clienteId) => {
    if (clienteId) {
      setClienteEditarId(clienteId);
      setClienteSeleccionado(clienteId);
      navigate(`/editarcliente/${clienteId}`);
    } else {
      console.error('clienteId es undefined');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const pageCount = Math.ceil(clientes.totalDocs / clientes.limit);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
      <Link
        to="/nuevocliente"
        className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
      >
        Nuevo Cliente
      </Link>

      <input
        type="text"
        placeholder="Buscar por nombre de cliente"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="block w-full py-2 px-3 border rounded shadow-sm mb-4"
      />

      <div className="overflow-x-scroll">
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Ruc</th>
              <th className="w-1/5 py-2">Email</th>
              <th className="w-1/5 py-2">Tiendas</th>
              <th className="w-1/5 py-2">Editar</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {clientes.docs.map((cliente, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{cliente.nombre}</td>
                <td className="border px-4 py-2">{cliente.ruc}</td>
                <td className="border px-4 py-2">{cliente.email}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/home/${cliente._id}`}
                    onClick={() => handleVerTiendasClick(cliente._id)}
                    className="hover:text-blue-600 hover:underline"
                  >
                    Ver Tiendas
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/editarcliente/${cliente._id}`}
                    onClick={() => {
                      handleEditarClienteClick(cliente._id);
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Editar
                  </Link>
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

      {clienteSeleccionado && <ClienteTiendaDetail clienteId={clienteSeleccionado} />}
      {clienteEditarId && <EditarCliente clienteId={clienteEditarId} />}
    </Layout>
  );
};

export default Home;