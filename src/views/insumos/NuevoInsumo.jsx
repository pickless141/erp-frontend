import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';


function NuevoInsumo() {
  const navigate = useNavigate();
  const [insumo, setInsumo] = useState({
    producto: '',
    peso: {
      valor: '',
      unidad: 'kg',
    },
    descripcion: '',
  });
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/insumos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(insumo),
      });

      if (response.ok) {
        setExito('Insumo creado exitosamente');
        setTimeout(() => {
          navigate('/insumos');
        }, 1500);
      } else {
        setError('Error al crear un nuevo insumo');
      }
    } catch (error) {
      console.error(error);
      setError('Error al crear un nuevo insumo');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInsumo({
      ...insumo,
      [name]: name === 'peso' ? { ...insumo.peso, valor: value } : value,
    });
  };

  const handleUnidadChange = (e) => {
    const { value } = e.target;
    setInsumo({
      ...insumo,
      peso: { ...insumo.peso, unidad: value },
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-gray-800 font-light mb-4">Nuevo Insumo</h1>
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="producto">
              Nombre del producto:
            </label>
            <input
              type="text"
              id="producto"
              name="producto"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={insumo.producto}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="peso">
              Peso:
            </label>
            <div className="flex">
              <input
                type="number"
                id="peso"
                name="peso"
                className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleInputChange}
                value={insumo.peso.valor}
                required
              />
              <select
                className="block appearance-none w-1/3 border border-gray-300 py-2 px-4 bg-white text-gray-700 rounded leading-tight focus:outline-none focus:border-blue-500"
                id="unidad"
                name="unidad"
                onChange={handleUnidadChange}
                value={insumo.peso.unidad}
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="uni">uni</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
              Descripción:
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
              value={insumo.descripcion}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Crear
            </button>
            <Link
              to="/insumos"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Volver
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default NuevoInsumo;