import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';

const EditarCliente = () => {
  const navigate = useNavigate();
  const { clienteId } = useParams();
  const [cliente, setCliente] = useState({
    nombre: '',
    email: '',
    ruc: '',
    telefono: '',
  });
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/clientes/${clienteId}`, {
          method: 'GET',
          headers: {
            'x-auth-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCliente(data);
        } else {
          throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error al obtener el cliente:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerCliente();
  }, [clienteId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/clientes/${clienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        setExito('Cliente actualizado exitosamente');
        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      } else {
        setError('Error al actualizar el cliente');
      }
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      setError('Error al actualizar el cliente');
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75">
        <div className="max-w-md bg-white p-8 rounded shadow-md text-center">
          <p className="text-black font-bold uppercase text-2xl mb-4">Cargando datos del cliente...</p>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error al obtener los datos del cliente: {error}</p>;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-gray-800 font-light mb-4">Editar Cliente</h1>
        
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
              Razon Social:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={cliente.nombre}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={cliente.email}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ruc">
              RUC:
            </label>
            <input
              type="text"
              id="ruc"
              name="ruc"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={cliente.ruc}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
              Teléfono:
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={cliente.telefono}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualizar Cliente
            </button>
          </div>
        </form>
        <button
            onClick={() => {
              navigate('/home');
            }}
            className="bg-gray-300 flex items-end hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto"
          >
            Volver
          </button>
      </div>
    </Layout>
  );
};
export default EditarCliente;