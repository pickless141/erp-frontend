import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useNavigate, Link } from 'react-router-dom';

const NuevaProduccion = () => {
  const navigate = useNavigate();
  const [produccion, setProduccion] = useState({
    nombreProducto: '',
    cantidadProducida: '',
    numeroLote: '',
    fechaVencimiento: '',
  });

  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduccion({ ...produccion, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/producciones/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(produccion),
      });

      if (response.ok) {
        setExito('Producción registrada exitosamente');
        setTimeout(() => {
          navigate('/producciones');
        }, 1000);
      } else {
        setError('Error al registrar la producción');
      }
    } catch (error) {
      console.error(error);
      setError('Error al registrar la producción');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-gray-800 font-light mb-4">Nueva Producción</h1>
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreProducto">
              Nombre del Producto:
            </label>
            <input
              type="text"
              id="nombreProducto"
              name="nombreProducto"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={produccion.nombreProducto}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantidadProducida">
              Cantidad Producida:
            </label>
            <input
              type="number"
              id="cantidadProducida"
              name="cantidadProducida"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={produccion.cantidadProducida}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantidadProducida">
              Numero de Lote:
            </label>
            <input
              type="number"
              id="numeroLote"
              name="numeroLote"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={produccion.numeroLote}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaVencimiento">
              Fecha de Vencimiento:
            </label>
            <input
              type="date"
              id="fechaVencimiento"
              name="fechaVencimiento"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={produccion.fechaVencimiento}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-800 hover-bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Registrar Producción
            </button>
            <Link to="/producciones" className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Volver
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NuevaProduccion;