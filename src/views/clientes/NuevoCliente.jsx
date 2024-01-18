import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useNavigate, Link } from 'react-router-dom';

const NuevoCliente = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombre: '',
    email: '',
    ruc: '',
    telefono: '',
  });

  const [alerta, setAlerta] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        setAlerta('Cliente creado exitosamente');
        setTimeout(() => {
          navigate('/home');;
        }, 2000);
      } else {
        setAlerta('Error al crear un nuevo cliente');
      }
    } catch (error) {
      console.error(error);
      setAlerta('Error al crear un nuevo cliente');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-gray-800 font-light mb-4">Nuevo Cliente</h1>
        {alerta && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            {alerta}
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
              Crear Cliente
            </button>
            <Link to="/home" className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Volver
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NuevoCliente;