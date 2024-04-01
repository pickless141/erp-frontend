import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import useStore from '../../store';

function Productos() {
  const navigate = useNavigate();
  const { productos, fetchProductos, eliminarItem } = useStore();

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
          }
        });
      }
    });
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-semibold mb-4">Productos</h1>
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <Link
          to="/nuevoproducto"
          className="bg-blue-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 md:mb-0 uppercase font-bold w-full md:w-auto text-center md:mr-3 transition-colors duration-300"
        >
          Nuevo Producto
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Existencia</th>
              <th className="px-4 py-2">Lote</th>
              <th className="px-4 py-2">Cod. de Barra</th>
              <th className="px-4 py-2 text-center">Editar</th>
              <th className="px-4 py-2 text-center">Eliminar</th> 
            </tr>
          </thead>
          <tbody className="bg-white">
            {productos.map((producto, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{producto.nombreProducto}</td>
                <td className="border px-4 py-2">{producto.existencia}</td>
                <td className="border px-4 py-2 text-blue-700">{producto.lote}</td>
                <td className="border px-4 py-2 text-blue-700">{producto.codBarra}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => navigate(`/editarproducto/${producto._id}`)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded inline-flex items-center justify-center transition-colors duration-300"
                  >
                    <FaEdit />
                  </button>
                </td>
                <td className="border px-4 py-2 text-center"> {/* Botón para eliminar */}
                  <button
                    onClick={() => confirmarEliminarProducto(producto._id)}
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
    </Layout>
  );
}

export default Productos;