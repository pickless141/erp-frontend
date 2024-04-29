import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ClienteTiendaDetail from './clientes/ClienteTiendaDetail';
import EditarCliente from './clientes/EditarCliente';
import useStore from '../store';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const {clientes, fetchClientes, eliminarItem} = useStore(state => ({
    clientes: state.clientes,
    fetchClientes: state.fetchClientes,
    eliminarItem: state.eliminarItem,
  }));
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteEditarId, setClienteEditarId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchClientes(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchClientes]);

  const confirmarEliminarCliente = (clienteId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir. ¿Deseas eliminar el cliente?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem('clientes', clienteId, {
          onSuccess: () => {
            Swal.fire(
              'Eliminado!',
              'El cliente ha sido eliminado.',
              'success'
            );
            fetchClientes(currentPage, searchTerm);
          },
          onError: () => {
            Swal.fire(
              'Error!',
              'No se pudo eliminar el cliente.',
              'error'
            );
          }
        });
      }
    });
  };


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
      <h1 className="text-2xl text-gray-800 font-semibold mb-6">Clientes</h1>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <Link
          to="/nuevocliente"
          className="bg-blue-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full md:w-auto text-center md:mr-3 transition-colors duration-300"
        >
          Nuevo Cliente
        </Link>
        <input
          type="text"
          placeholder="Buscar por nombre de cliente"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full py-2 px-3 border rounded shadow-sm mb-3 md:mb-0"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Ruc</th>
              <th className="px-4 py-3">Tiendas</th>
              <th className="px-4 py-3">Editar</th>
              <th className="px-4 py-3">Eliminar</th>

            </tr>
          </thead>

          <tbody className="bg-white">
            {clientes.docs.map((cliente, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{cliente.nombre}</td>
                <td className="border px-4 py-2">{cliente.ruc}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/home/${cliente._id}`}
                    onClick={() => handleVerTiendasClick(cliente._id)}
                    className="text-blue-500 hover:underline transition-colors duration-300"
                  >
                    Ver Tiendas
                  </Link>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditarClienteClick(cliente._id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded inline-flex items-center justify-center transition-colors duration-300 mr-2"
                  >
                    <FaEdit />
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                    <button
                    onClick={() => confirmarEliminarCliente(cliente._id)}
                    className="text-red-500 hover:text-red-700 transition duration-300 inline-flex items-center justify-center"
                  >
                    <FaTrash />
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
              } transition-colors duration-300`}
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