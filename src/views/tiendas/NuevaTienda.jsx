import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import useStore from '../../store';

const NuevaTienda = () => {
  const [tienda, setTienda] = useState({
    cliente: null,
    nombreCliente: '',
    nombreTienda: '',
    direccion: '',
    descripcion: '',
    productos: [],
  });
  
  const [clientesOptions, setClientesOptions] = useState([]);
  
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);
  
  const { productos, fetchProductos } = useStore(state => ({
    productos: state.productos,
    fetchProductos: state.fetchProductos,
  }));
  
  const productosOptions = productos.map(producto => ({
    value: producto._id,
    label: producto.nombreProducto,
  }));

  const handleInputChange = (name, value) => {
    setTienda(prevTienda => ({
      ...prevTienda,
      [name]: value,
    }));
  };

  const handleClienteChange = selectedOption => {
    handleInputChange('cliente', selectedOption);
    handleInputChange('nombreCliente', selectedOption.label);
  };

  const handleProductoChange = selectedOptions => {
    handleInputChange('productos', selectedOptions.map(producto => ({ _id: producto.value, nombre: producto.label, precio: '' })));
  };

  const handlePrecioChange = (index, precio) => {
    const nuevosProductos = [...tienda.productos];
    nuevosProductos[index].precio = precio;
    setTienda(prevTienda => ({
      ...prevTienda,
      productos: nuevosProductos,
    }));
  };

  const obtenerClientes = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/clientes/clienteSelect`, {
        headers: {
          'x-auth-token': token,
        },
      });
      const clientes = response.data.map(cliente => ({
        value: cliente._id,
        label: cliente.nombre,
      }));
      setClientesOptions(clientes);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  useEffect(() => {
    obtenerClientes();
    fetchProductos();
  }, [fetchProductos]);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/tiendas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          ...tienda,
          productos: tienda.productos.map(producto => ({ producto: producto._id, precio: producto.precio })),
        })
      });

      if (response.ok) {
        setExito('Tienda creada exitosamente');
        setTimeout(() => {
          window.location.href = '/tiendas';
        }, 2000);
      } else {
        setError('Error al crear una nueva tienda');
      }
    } catch (error) {
      console.error(error);
      setError('Error al crear una nueva tienda');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lado Izquierdo: Cliente, Tienda, Dirección, Descripción */}
          <div>
            <h1 className="text-2xl text-gray-800 font-light mb-4">Nueva Tienda</h1>
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
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreCliente">
                  Nombre del Cliente:
                </label>
                <Select
                  options={clientesOptions}
                  onChange={handleClienteChange}
                  value={tienda.cliente}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreTienda">
                  Nombre de la Tienda:
                </label>
                <input
                  type="text"
                  id="nombreTienda"
                  name="nombreTienda"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={e => handleInputChange('nombreTienda', e.target.value)}
                  value={tienda.nombreTienda}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                  Dirección:
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={e => handleInputChange('direccion', e.target.value)}
                  value={tienda.direccion}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                  Descripción:
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={e => handleInputChange('descripcion', e.target.value)}
                  value={tienda.descripcion}
                />
              </div>
            </form>
          </div>

          {/* Lado Derecho: Selección de Productos y Precios */}
          <div>
            <h2 className="text-2xl text-gray-800 font-light mb-4">Productos</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productos">
                  Seleccionar Productos:
                </label>
                <Select
                  options={productosOptions}
                  isMulti
                  onChange={handleProductoChange}
                  value={tienda.productos.map(producto => ({ value: producto._id, label: producto.nombre }))}
                />
              </div>
              {tienda.productos.map((producto, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`precio-${index}`}>
                    Precio de {producto.nombre}:
                  </label>
                  <input
                    type="number"
                    id={`precio-${index}`}
                    name={`precio-${index}`}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={producto.precio}
                    onChange={e => handlePrecioChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
              {/* Botones de acción */}
              <div className="flex items-center justify-between mt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Crear Tienda
                </button>
                <Link
                  to="/tiendas"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Volver
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NuevaTienda;