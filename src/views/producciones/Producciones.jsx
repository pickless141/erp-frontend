import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import { Add } from '@mui/icons-material';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';
import Tooltip from '@mui/material/Tooltip';
import NuevaProduccion from './NuevaProduccion'; 
import { useProduccionesStore, useGeneralStore } from '../../store/index';

function Producciones() {
  const { producciones, totalDocs, limit, fetchProducciones } = useProduccionesStore((state) => ({
    producciones: state.producciones.docs,
    totalDocs: state.producciones.totalDocs,
    limit: state.producciones.limit,
    fetchProducciones: state.fetchProducciones,
  }));

  const { eliminarItem, currentPage, setCurrentPage, resetCurrentPage } = useGeneralStore((state) => ({
    eliminarItem: state.eliminarItem,
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
    resetCurrentPage: state.resetCurrentPage,
  }));

  const [currentLimit, setCurrentLimit] = useState(limit || 5);
  const [openDialog, setOpenDialog] = useState(false); 

  const totalPages = Math.ceil(totalDocs / currentLimit) || 1;

  useEffect(() => {
    resetCurrentPage();
    fetchProducciones(1, currentLimit);
  }, [fetchProducciones, resetCurrentPage, currentLimit]);

  useEffect(() => {
    console.log(producciones); 
  }, [producciones]);

  const confirmarEliminarProduccion = (produccionId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir. ¿Deseas eliminar la producción?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem('producciones', produccionId, {
          onSuccess: () => {
            fetchProducciones(currentPage, currentLimit);
            Swal.fire('Eliminado!', 'La producción ha sido eliminada.', 'success');
          },
          onError: () => {
            Swal.fire('Error!', 'No se pudo eliminar la producción.', 'error');
          },
        });
      }
    });
  };

  // const handleLimitChange = (e) => {
  //   const newLimit = parseInt(e.target.value, 10);
  //   setCurrentLimit(newLimit);
  // };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-6">Producciones</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full">
          <Tooltip title="Agregar Producción" arrow>
            <button
              onClick={() => setOpenDialog(true)}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md w-12 h-12 shadow-md focus:outline-none"
            >
              <Add fontSize="large" />
            </button>
          </Tooltip>
        </div>
        {/* <div className="flex items-center gap-2">
          <label className="text-xs">Registros por página:</label>
          <select
            value={currentLimit}
            onChange={handleLimitChange}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div> */}
      </div>

      <NuevaProduccion
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onProduccionCreated={fetchProducciones}
        currentPage={currentPage}
        currentLimit={currentLimit}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Cantidad Producida</th>
              <th className="px-4 py-3">Fecha de Producción</th>
              <th className="px-4 py-3">Número de Lote</th>
              <th className="px-4 py-3">Fecha de Vencimiento</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {producciones.map((produccion, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700 text-center">
                  {produccion.producto ? produccion.producto.nombreProducto : 'Producto no disponible'}
                </td>
                <td className="border px-4 py-2 text-center">{produccion.cantidadProducida}</td>
                <td className="border px-4 py-2 text-center">{new Date(produccion.fechaProduccion).toLocaleString()}</td>
                <td className="border px-4 py-2 text-center">{produccion.numeroLote}</td>
                <td className="border px-4 py-2 text-center">{new Date(produccion.fechaVencimiento).toLocaleDateString()}</td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => confirmarEliminarProduccion(produccion._id)}
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
        pageCount={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          fetchProducciones(page, currentLimit);
        }}
        totalDocs={totalDocs}
        limit={currentLimit}
      />
    </Layout>
  );
}

export default Producciones;