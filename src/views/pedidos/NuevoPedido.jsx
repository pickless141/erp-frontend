// NuevoPedido.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useTiendas } from '../../context/TiendasContext';

const NuevoPedido = () => {
  const { tiendas, obtenerTiendas } = useTiendas();
  const [productosOptions, setProductosOptions] = useState([]);
  const [tienda, setTienda] = useState(null);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const obtenerDatos = async () => {
      await obtenerTiendas();
    };
    obtenerDatos();
  }, [obtenerTiendas]); 

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/productos/`, {
          headers: {
            'x-auth-token': token,
          },
        });
        const productos = response.data.map(producto => ({
          value: producto._id,
          label: `${producto.nombreProducto}`,
          precio: producto.precio,
          cantidad: 0,
        }));
        setProductosOptions(productos);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    obtenerProductos();
  }, []);

  const handleTiendaChange = selectedOption => {
    setTienda(selectedOption);
  };

  const handleProductosChange = selectedOptions => {
    setProductos(selectedOptions);
  };

  const handleCantidadChange = (producto, cantidad) => {
    setProductos(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.value === producto.value ? { ...prevProduct, cantidad } : prevProduct
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const pedidoData = {
        tienda: tienda.value,
        pedido: productos.map(producto => ({ id: producto.value, cantidad: producto.cantidad })),
      };

      const response = await axios.post(
        `${apiUrl}/pedidos/`,
        pedidoData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      setExito('Pedido creado exitosamente');

      setTimeout(() => {
        navigate('/pedidos');
      }, 2000);
    } catch (error) {
      setError('Error al crear el pedido');
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-gray-800 font-light mb-4">Nuevo Pedido</h1>

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

        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Selecciona la tienda</label>
            <Select options={tiendas} onChange={handleTiendaChange} value={tienda} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Selecciona los productos</label>
            <Select options={productosOptions} onChange={handleProductosChange} isMulti value={productos} />
            {productos.map(producto => (
              <div key={producto.value} className="flex items-center mt-2">
                <label className="text-sm">{producto.label}</label>
                <input
                  type="number"
                  value={producto.cantidad}
                  onChange={e => handleCantidadChange(producto, parseInt(e.target.value, 10))}
                  className="w-20 ml-2 px-2 py-1 border rounded"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Registrar Pedido
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/pedidos');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Volver a Pedidos
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NuevoPedido;