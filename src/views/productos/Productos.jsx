import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import EditarProducto from './EditarProducto';
import { FaEdit } from "react-icons/fa";

function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [editarProducto, setEditarProducto] = useState(null);


  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem('token');
    fetch(`${apiUrl}/productos/`, {
      method: 'GET',
      headers: {
        'x-auth-token': token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
      });
  }, []);
  
  const handleEditar = (productoId) => {
    if (productoId) {
      setEditarProducto(productoId);
      navigate(`/editarproducto/${productoId}`);
    } else {
      console.error('productoId es undefined');
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-4">Productos</h1>
      <Link
        to="/nuevoproducto"
        className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
      >
        Nuevo Producto
      </Link>
      <div className="overflow-x-scroll">
        <table className="table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-2 px-4">Nombre</th>
              <th className="w-1/4 py-2 px-4">Precio</th>
              <th className="w-1/4 py-2 px-4">Existencia</th>
              <th className="w-1/4 py-2 px-4">Numero de Lote</th>
              <th className="w-1/4 py-2 px-4">Editar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {productos.map((producto, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{producto.nombreProducto}</td>
                <td className="border px-4 py-2">{producto.precio}</td>
                <td className="border px-4 py-2">{producto.existencia}</td>
                <td className="border px-4 text-blue-700 py-2">{producto.lote}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      handleEditar(producto._id);
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  >
                    <FaEdit color="white" 
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editarProducto && <EditarProducto productoId={editarProducto}/>}
    </Layout>
  );
}

export default Productos;