import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import EditarTienda from './EditarTienda';
import useStore from '../../store';
import { FaEdit, FaShoppingCart, FaTrash } from "react-icons/fa";

const Tiendas = () => {
  const navigate = useNavigate();
  const { eliminarItem, fetchTiendas, tiendas, searchTerm, currentPage, setSearchTerm, setCurrentPage } = useStore((state) => ({
    eliminarItem: state.eliminarItem,
    fetchTiendas: state.fetchTiendas,
    tiendas: state.tiendas,
    searchTerm: state.searchTerm,
    currentPage: state.currentPage,
    setSearchTerm: state.setSearchTerm,
    setCurrentPage: state.setCurrentPage,
  }));
  
  const [tiendaEditarId, setTiendaEditarId] = useState(null);

  useEffect(() => {
    fetchTiendas(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchTiendas])
  
  const confirmarEliminarTienda = useCallback((tiendaId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir. ¿Deseas eliminar la tienda?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem('tiendas', tiendaId, {
          onSuccess: () => {
            fetchTiendas(currentPage, searchTerm);
            Swal.fire('Eliminado!', 'La tienda ha sido eliminada con éxito.', 'success');
          },
          onError: () => {
            Swal.fire('Error!', 'No se pudo eliminar la tienda.', 'error');
          }
        });
      }
    });
  }, [eliminarItem, fetchTiendas, currentPage, searchTerm]);

  const handleEditarTiendaClick = (tiendaId) => {
    if (tiendaId) {
      setTiendaEditarId(tiendaId);
      navigate(`/editartienda/${tiendaId}`);
    } else {
      console.error('tiendaId es undefined');
    }
  };
  const handlePedidoClick = (tiendaId) => {
    navigate(`/hacerpedido/${tiendaId}`);
  };

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, [setSearchTerm, setCurrentPage]);

  const pageCount = Math.ceil(tiendas.totalDocs / tiendas.limit);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-6">Administrar Tiendas</h1>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <Link
          to="/nuevatienda"
          className="bg-blue-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full md:w-auto text-center md:mr-3"
        >
          Nueva Tienda
        </Link>
        <input
          type="text"
          placeholder="Buscar por nombre de tienda"
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full py-2 px-3 border rounded shadow-sm mb-3 md:mb-0"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">Tienda</th>
              <th className="px-4 py-3">Reposiciones</th>
              <th className="px-4 py-3">Detalle</th>
              <th className="px-4 py-3">Editar</th>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Eliminar</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {tiendas.docs.map((tienda, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{tienda.nombreTienda}</td>
                <td className="border px-4 py-2">
                  <Link to={`/reposiciones/tienda/${tienda._id}`} className="text-blue-500 hover:underline">
                    Reposiciones
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  <Link to={`/tiendas/${tienda._id}/detalle`} className="text-blue-500 hover:underline">
                    Ver Tienda
                  </Link>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditarTiendaClick(tienda._id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded flex items-center justify-center mx-auto"
                  >
                    <FaEdit className="mr-2" />
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handlePedidoClick(tienda._id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded flex items-center justify-center mx-auto"
                  >
                    <FaShoppingCart className="mr-2" />
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => confirmarEliminarTienda(tienda._id)}
                    className="text-red-500 hover:text-red-700 transition duration-300 inline-flex items-center justify-center mx-auto"
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