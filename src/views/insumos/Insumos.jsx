import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Add } from "@mui/icons-material";
import { useInsumosStore, useGeneralStore } from '../../store/index';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';
import EditarInsumo from './EditarInsumo';
import Tooltip from '@mui/material/Tooltip'; 

const Insumos = () => {
  const navigate = useNavigate();

  const { insumos, fetchInsumos } = useInsumosStore((state) => ({
    insumos: state.insumos,
    fetchInsumos: state.fetchInsumos,
  }));

  const {
    eliminarItem,
    searchTerm,
    currentPage,
    setSearchTerm,
    setCurrentPage,
    resetCurrentPage,
    resetSearchTerm,
  } = useGeneralStore((state) => ({
    eliminarItem: state.eliminarItem,
    searchTerm: state.searchTerm,
    currentPage: state.currentPage,
    setSearchTerm: state.setSearchTerm,
    setCurrentPage: state.setCurrentPage,
    resetCurrentPage: state.resetCurrentPage,
    resetSearchTerm: state.resetSearchTerm,
  }));

  const [insumoEditarId, setInsumoEditarId] = useState(null);

  useEffect(() => {
    resetCurrentPage();
    resetSearchTerm();
    fetchInsumos(1, "");
  }, [fetchInsumos, resetCurrentPage, resetSearchTerm]);

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
          },
        });
      }
    });
  };

  const handleEditarInsumoClick = (insumoId) => {
    setInsumoEditarId(insumoId);
    navigate(`/editarinsumo/${insumoId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchInsumos(page, searchTerm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    fetchInsumos(1, e.target.value);
  };

  const pageCount = Math.ceil(insumos?.totalDocs / insumos?.limit || 1);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-6">Insumos</h1>

      {/* Botón de agregar y barra de búsqueda */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full">
          <Tooltip title="Agregar insumo" arrow>
            <button
              onClick={() => navigate("/nuevoinsumo")}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md w-12 h-12 shadow-md focus:outline-none"
            >
              <Add fontSize="large" />
            </button>
          </Tooltip>
          <input
            type="text"
            placeholder="Buscar insumo por nombre"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full md:w-3/4 lg:w-2/3 py-2 px-4 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
          />
        </div>
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
                    <Tooltip title="Editar insumo" arrow>
                      <button
                        onClick={() => handleEditarInsumoClick(insumo._id)}
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      >
                        <FaEdit size={20} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Eliminar insumo" arrow>
                      <button
                        onClick={() => confirmarEliminarInsumo(insumo._id)}
                        className="text-gray-700 hover:text-red-700 transition duration-300"
                      >
                        <FaTrash size={20} />
                      </button>
                    </Tooltip>
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