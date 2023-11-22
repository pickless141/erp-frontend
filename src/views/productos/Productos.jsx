import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

function Productos() {
  const [productos, setProductos] = useState([]);

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

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-4">Productos</h1>
      <div className="overflow-x-scroll">
        <table className="table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-2 px-4">Nombre</th>
              <th className="w-1/4 py-2 px-4">Precio</th>
              <th className="w-1/4 py-2 px-4">Existencia</th>
              <th className="w-1/4 py-2 px-4">Numero de Lote</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {productos.map((producto, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{producto.nombreProducto}</td>
                <td className="border px-4 py-2">{producto.precio}</td>
                <td className="border px-4 py-2">{producto.existencia}</td>
                <td className="border px-4 text-blue-700 py-2">{producto.lote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Productos;