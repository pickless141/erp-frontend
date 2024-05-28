import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';
import useStore from '../../store';
import { FaEdit, FaTrash, FaShoppingCart } from "react-icons/fa";

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

  const { docs, totalDocs, limit } = tiendas;
  const [tiendaEditarId, setTiendaEditarId] = useState(null);

  useEffect(() => {
    fetchTiendas(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchTiendas]);

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
    setTiendaEditarId(tiendaId);
    navigate(`/editartienda/${tiendaId}`);
  };

  const handlePedidoClick = (tiendaId) => {
    navigate(`/hacerpedido/${tiendaId}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchTiendas(newPage, searchTerm); 
  };

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, [setSearchTerm, setCurrentPage]);

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
              <th className="px-4 py-3">Pedidos</th>
              <th className="px-4 py-3">Reposiciones</th>
              <th className="px-4 py-3">Detalle</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {docs.map((tienda, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700 text-center">{tienda.nombreTienda}</td>
                <td className="border px-4 py-2 text-center">
                  <Link to={`/pedidos/tienda/${tienda._id}`} className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200">
                    Ver Pedidos
                  </Link>
                </td>
                <td className="border px-4 py-2 text-center">
                  <Link to={`/reposiciones/tienda/${tienda._id}`} className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200">
                    Reposiciones
                  </Link>
                </td>
                <td className="border px-4 py-2 text-center">
                  <Link to={`/tiendas/${tienda._id}/detalle`} className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200">
                    Ver Tienda
                  </Link>
                </td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleEditarTiendaClick(tienda._id)}
                      className="text-gray-700  hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => confirmarEliminarTienda(tienda._id)}
                      className="text-gray-700  hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      <FaTrash size={20} />
                    </button>
                    <button
                      onClick={() => handlePedidoClick(tienda._id)}
                      className="text-gray-700  hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      <FaShoppingCart size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        pageCount={Math.ceil(totalDocs / limit)}
        onPageChange={handlePageChange}
        totalDocs={totalDocs}
        limit={limit}
      /> 

      {tiendaEditarId && <EditarTienda tiendaId={tiendaEditarId} />}
    </Layout>
  );
};

export default Tiendas;