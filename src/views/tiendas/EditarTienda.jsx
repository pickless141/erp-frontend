import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';

const EditarTienda = () => {
  const navigate = useNavigate();
  const { tiendaId } = useParams();
  const [tienda, setTienda] = useState({
    nombreCliente: '',
    nombreTienda: '',
    direccion: '',
    descripcion: '',
  });
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTienda = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_SERVER;
          const token = localStorage.getItem('token');
          const response = await fetch(`${apiUrl}/tiendas/tienda/${tiendaId}`, {
            method: 'GET',
            headers: {
              'x-auth-token': token,
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            setTienda(data);
          } else {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error al obtener la tienda:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
    obtenerTienda();
  }, [tiendaId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTienda({ ...tienda, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/tiendas/${tiendaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          nombreTienda: tienda.nombreTienda,
          direccion: tienda.direccion,
          descripcion: tienda.descripcion,
        }),
      });
  
      if (response.ok) {
        setExito('Tienda actualizado exitosamente');
        setTimeout(() => {
          window.location.href = '/tiendas';
        }, 1000);
      } else {
        throw new Error(`Error al actualizar la tienda: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al actualizar la tienda:', error);
      setError('Error al actualizar la tienda');
    }
  };

  if (loading) {
    return <p>Cargando datos de la tienda...</p>;
  }

  if (error) {
    return <p>Error al obtener los datos de la tienda: {error}</p>;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-gray-800 font-light mb-4">Editar Tienda</h1>
        
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreTienda">
              Nombre de la Tienda:
            </label>
            <input
              type="text"
              id="nombreTienda"
              name="nombreTienda"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={tienda.nombreTienda}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
              Direccion:
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={tienda.direccion}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
              Descripcion:
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={tienda.descripcion}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualizar Tienda
            </button>
          </div>
        </form>
        <button
            onClick={() => {
              navigate('/tiendas');
            }}
            className="bg-gray-300 flex items-end hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto"
          >
            Volver
          </button>
      </div>
    </Layout>
  );
};

export default EditarTienda;