import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useProductosStore, useGeneralStore } from '../../store/index';

function Productos() {
  const navigate = useNavigate();

  const { productos, fetchProductos } = useProductosStore((state) => ({
    productos: state.productos,
    fetchProductos: state.fetchProductos,
  }));

  const { eliminarItem } = useGeneralStore((state) => ({
    eliminarItem: state.eliminarItem,
  }));
  

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const confirmarEliminarProducto = (productoId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir. ¿Deseas eliminar el producto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem('productos', productoId, {
          onSuccess: () => {
            fetchProductos();
          },
          onError: () => {
            Swal.fire('Error!', 'No se pudo eliminar el producto.', 'error');
          },
        });
      }
    });
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-6">Productos</h1>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <Link
          to="/nuevoproducto"
          className="bg-blue-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 md:mb-0 uppercase font-bold w-full md:w-auto text-center md:mr-3 transition-colors duration-300"
        >
          Agregar
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Existencia</th>
              <th className="px-4 py-3">Lote</th>
              <th className="px-4 py-3">Cod. de Barra</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {productos.map((producto, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700 text-center">{producto.nombreProducto}</td>
                <td className="border px-4 py-2 text-center">{producto.existencia}</td>
                <td className="border px-4 py-2 text-blue-600 text-center">{producto.lote}</td>
                <td className="border px-4 py-2 text-blue-600 text-center">{producto.codBarra}</td>
                <td className="border px-4 py-2 text-center">{producto.categoria}</td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => navigate(`/editarproducto/${producto._id}`)}
                      className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => confirmarEliminarProducto(producto._id)}
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
    </Layout>
  );
}

export default Productos;