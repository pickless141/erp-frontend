import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import useStore from '../../store';

function Producciones() {
  const { producciones, totalDocs, limit, fetchProducciones, eliminarItem } = useStore(state => ({
    producciones: state.producciones.docs,
    totalDocs: state.producciones.totalDocs,
    limit: state.producciones.limit,
    fetchProducciones: state.fetchProducciones,
    eliminarItem: state.eliminarItem
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalDocs / limit));

  useEffect(() => {
    fetchProducciones(currentPage);
    const totalPages = Math.ceil(totalDocs / limit);
    setTotalPages(totalPages);
  }, [currentPage, fetchProducciones, totalDocs, limit]);;

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
          }
        });
      }
    });
  };
  

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-semibold mb-4">Producciones</h1>
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <Link
          to="/nuevaproduccion"
          className="bg-blue-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 md:mb-0 uppercase font-bold w-full md:w-auto text-center md:mr-3 transition-colors duration-300"
        >
          Nueva Producción
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Cantidad Producida</th>
              <th className="px-4 py-2">Fecha de Producción</th>
              <th className="px-4 py-2">Número de Lote</th>
              <th className="px-4 py-2">Fecha de Vencimiento</th>
              <th className="px-4 py-2">Eliminar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {producciones.map((produccion, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{produccion.producto ? produccion.producto.nombreProducto : 'Producto no disponible'}</td>
                <td className="border px-4 py-2">{produccion.cantidadProducida}</td>
                <td className="border px-4 py-2">{new Date(produccion.fechaProduccion).toLocaleString()}</td> 
                <td className="border px-4 py-2">{produccion.numeroLote}</td> 
                <td className="border px-4 py-2">{new Date(produccion.fechaVencimiento).toLocaleDateString()}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => confirmarEliminarProduccion(produccion._id)}
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
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-4 py-2 rounded ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
            } hover:bg-blue-700 transition-colors duration-300`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </Layout>
  );
}

export default Producciones;