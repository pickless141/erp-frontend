import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';
import useStore from '../../store';
import Swal from 'sweetalert2';
import { FaTrash, FaDownload } from 'react-icons/fa';
import axios from 'axios';

const Reposiciones = () => {
  const { reposiciones, fetchReposiciones, eliminarItem } = useStore((state) => ({
    reposiciones: state.reposiciones,
    fetchReposiciones: state.fetchReposiciones,
    eliminarItem: state.eliminarItem, 
  }));
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReposiciones(currentPage);
  }, [currentPage, fetchReposiciones]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const confirmarEliminarReposicion = (reposicionId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir. ¿Deseas eliminar la reposición?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem('reposiciones', reposicionId, {
          onSuccess: () => {
            Swal.fire(
              'Eliminado!',
              'La reposición ha sido eliminada.',
              'success'
            );
            fetchReposiciones(currentPage); 
          },
          onError: () => {
            Swal.fire(
              'Error!',
              'No se pudo eliminar la reposición.',
              'error'
            );
          }
        });
      }
    });
  };

  const descargarReposiciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const response = await axios.get(`${apiUrl}/reposiciones/descargar`, {
        headers: {
          'x-auth-token': token,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reposiciones.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      Swal.fire('Error', 'No se pudo descargar el archivo', 'error');
      console.error('Error al descargar el archivo:', error);
    }
  };

  const pageCount = Math.ceil(reposiciones.totalDocs / reposiciones.limit);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Reposiciones</h1>
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/nuevoregistro"
          className="bg-blue-800 py-2 px-5 mt-3 text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
        >
          Agregar
        </Link>
        {/* <button
          onClick={descargarReposiciones}
          className="bg-green-500 py-2 px-5 mt-3 text-white rounded text-sm hover:bg-green-700 mb-3 uppercase font-bold w-full lg:w-auto text-center flex items-center justify-center"
        >
          <FaDownload className="mr-2" /> Descargar
        </button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Tienda</th>
              <th className="px-4 py-2">Productos</th>
              <th className="px-4 py-2">Fecha de Reposición</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Registrado por</th>
              <th className="px-4 py-2 text-center">Eliminar</th> 
            </tr>
          </thead>
          <tbody className="bg-white">
            {reposiciones.docs.map((reposicion) => (
              <tr key={reposicion._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{reposicion.tienda?.nombreTienda}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/detail/${reposicion._id}`}  
                    className="text-blue-500 hover:underline"
                  >
                    Ver Productos
                  </Link>
                </td>
                <td className="border px-4 py-2">{new Date(reposicion.fechaReposicion).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  {reposicion.productos.length > 0 && reposicion.productos[0].producto.categoria}
                </td>
                <td className="border px-4 py-2">{reposicion.usuario ? `${reposicion.usuario.nombre} ${reposicion.usuario.apellido}` : 'Desconocido'}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => confirmarEliminarReposicion(reposicion._id)}
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

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        totalDocs={reposiciones.totalDocs}
        limit={reposiciones.limit}
      />
    </Layout>
  );
};

export default Reposiciones;