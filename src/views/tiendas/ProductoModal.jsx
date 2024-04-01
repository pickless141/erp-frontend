import React, { useState, useEffect } from 'react';

const ProductoModal = ({ onClose, tiendaId }) => {
    console.log(tiendaId)
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([{ productoId: '', precio: '' }]);
  const apiUrl = import.meta.env.VITE_API_SERVER;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProductos = async () => {
      const response = await fetch(`${apiUrl}/productos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setProductos(data);
    };
    fetchProductos();
  }, []);

  const handleProductoChange = (index, value) => {
    const updatedProductos = [...productosSeleccionados];
    updatedProductos[index].productoId = value;
    setProductosSeleccionados(updatedProductos);
  };

  const handlePrecioChange = (index, value) => {
    const updatedProductos = [...productosSeleccionados];
    updatedProductos[index].precio = value;
    setProductosSeleccionados(updatedProductos);
  };

  const añadirProducto = () => {
    setProductosSeleccionados([...productosSeleccionados, { productoId: '', precio: '' }]);
  };

  const quitarProducto = (index) => {
    const updatedProductos = [...productosSeleccionados];
    updatedProductos.splice(index, 1);
    setProductosSeleccionados(updatedProductos);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/tiendas/${tiendaId}/nuevoproducto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({ tiendaId, productos: productosSeleccionados }),
    });

    if (response.ok) {
      onClose(); 
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 w-1/2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Añadir Nuevo Producto</h3>
        <form onSubmit={guardarProducto} className="space-y-4">
          {productosSeleccionados.map((producto, index) => (
            <div key={index} className="flex gap-3 items-center">
              <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={producto.productoId}
                onChange={(e) => handleProductoChange(index, e.target.value)}
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nombreProducto}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                value={producto.precio}
                onChange={(e) => handlePrecioChange(index, e.target.value)}
                required
              />
              {productosSeleccionados.length > 1 && (
                <button
                  type="button"
                  onClick={() => quitarProducto(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={añadirProducto}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Añadir otro producto
            </button>
            <div>
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;