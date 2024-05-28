import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import useStore from '../../store';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';
import EditarInsumo from './EditarInsumo';

const Insumos = () => {
  const navigate = useNavigate();
  const { insumos, fetchInsumos, eliminarItem, searchTerm, currentPage, setSearchTerm, setCurrentPage } = useStore((state) => ({
    insumos: state.insumos,
    fetchInsumos: state.fetchInsumos,
    eliminarItem: state.eliminarItem,
    searchTerm: state.searchTerm,
    currentPage: state.currentPage,
    setSearchTerm: state.setSearchTerm,
    setCurrentPage: state.setCurrentPage,
  }));

  const [insumoEditarId, setInsumoEditarId] = useState(null);

  useEffect(() => {
    fetchInsumos(currentPage, searchTerm)
  }, [currentPage, searchTerm, fetchInsumos]);

  const confirmarEliminarInsumo = (insumoId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir. ¿Deseas eliminar el insumo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem('insumos', insumoId, {
          onSuccess: () => fetchInsumos(currentPage, searchTerm),
          onError: (error) => {
            console.error('Error al eliminar el insumo:', error);
            Swal.fire('Error!', 'No se pudo eliminar el insumo.', 'error');
          }
        });
      }
    });
  };

  const handleEditarInsumoClick = (insumoId) => {
    if (insumoId) {
      setInsumoEditarId(insumoId);
      navigate(`/editarinsumo/${insumoId}`);
    } else {
      console.error('insumoId es undefined');
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };
  const pageCount = Math.ceil(insumos?.totalDocs / insumos?.limit || 1);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-6">Insumos</h1>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <Link
          to="/nuevoinsumo"
          className="bg-blue-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 md:mb-0 uppercase font-bold w-full md:w-auto text-center md:mr-3 transition-colors duration-300"
        >
          Nuevo Insumo
        </Link>
        <input
          type="text"
          placeholder="Buscar por nombre de insumo"
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full py-2 px-3 border rounded shadow-sm mb-3 md:mb-0"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Peso</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {insumos.docs.map((insumo, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700 text-center">{insumo.producto}</td>
                <td className="border px-4 py-2 text-center">{insumo.peso.valor} {insumo.peso.unidad}</td>
                <td className="border px-4 py-2 text-center">{insumo.descripcion}</td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleEditarInsumoClick(insumo._id)}
                      className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => confirmarEliminarInsumo(insumo._id)}
                      className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      <FaTrash size={20} />
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
          pageCount={pageCount}
          onPageChange={handlePageChange}
          totalDocs={insumos?.totalDocs || 0}
          limit={insumos?.limit || 1}
      />

      {insumoEditarId && <EditarInsumo insumoId={insumoEditarId} />}
    </Layout>
  );
};

export default Insumos;