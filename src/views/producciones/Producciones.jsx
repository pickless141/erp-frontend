import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router-dom';
import { useProduccionesStore, useGeneralStore } from '../../store/index';

function Producciones() {
  const { producciones, fetchProducciones } = useProduccionesStore((state) => ({
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

  
  const totalPages = Math.ceil(producciones.totalDocs / producciones.limit);

  useEffect(() => {
    resetCurrentPage(); 
    fetchProducciones(1); 
  }, [fetchProducciones, resetCurrentPage]);

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
            fetchProducciones(currentPage);
            Swal.fire('Eliminado!', 'La producción ha sido eliminada.', 'success');
          },
          onError: () => {
            Swal.fire('Error!', 'No se pudo eliminar la producción.', 'error');
          },
        });
      }
    });
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-6">Producciones</h1>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <Link
          to="/nuevaproduccion"
          className="bg-blue-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 md:mb-0 uppercase font-bold w-full md:w-auto text-center md:mr-3 transition-colors duration-300"
        >
          Agregar
        </Link>
      </div>

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
          fetchProducciones(page);
        }}
        totalDocs={producciones.totalDocs}
        limit={producciones.limit}
      />
    </Layout>
  );
}

export default Producciones;