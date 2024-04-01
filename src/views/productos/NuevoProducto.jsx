import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useNavigate, Link } from 'react-router-dom';

const NuevoProducto = () => {
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombreProducto: '',
    lote: '',
    codBarra: 0
  });

  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(producto),
      });

      if (response.ok) {
        setExito('Producto creado exitosamente');
        setTimeout(() => {
          navigate('/productos');;
        }, 2000);
      } else {
        setError('Error al crear un nuevo producto');
      }
    } catch (error) {
      console.error(error);
      setError('Error al crear un nuevo producto');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-gray-800 font-light mb-4">Nuevo Producto</h1>
        {exito && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            {exito}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
              Nombre del producto:
            </label>
            <input
              type="text"
              id="nombreProducto"
              name="nombreProducto"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={producto.nombreProducto}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ruc">
              Lote:
            </label>
            <input
              type="number"
              id="lote"
              name="lote"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={producto.lote}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ruc">
              Cod. de Barra:
            </label>
            <input
              type="number"
              id="codBarra"
              name="codBarra"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={producto.codBarra}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Crear Producto
            </button>
            <Link to="/productos" className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Volver
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NuevoProducto;