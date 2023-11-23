import Layout from '../../components/Layout';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import EditarInsumo from './EditarInsumo';

//componente que muestra todos los insumos 
const Insumos = () => {
  const navigate = useNavigate();
  const [insumos, setInsumos] = useState([]);
  const [editarInsumo, setEditarInsumo] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem('token');
    fetch(`${apiUrl}/insumos/`, {
      method: 'GET',
      headers: {
        'x-auth-token': token,
      },
    })
    .then((response) => {
      if (response.ok){
        return response.json();
      } else {
        throw new Error('Error al buscar insumos');
      }
    })
    .then((data) => {
      setInsumos(data);
    })
    .catch((error) => {
      console.log('Error al obtener productos:', error);
    });
  }, []);

  const handleEditar = (insumoId) => {
    if (insumoId) {
      setEditarInsumo(insumoId);
      navigate(`/editarinsumo/${insumoId}`);
    } else {
      console.error('insumoId es undefined');
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-4">Insumos</h1>
      <Link
        to="/nuevoinsumo"
        className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
      >
        Nuevo Insumo
      </Link>
      <div className="overflow-x-scroll">
        <table className="table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-2 px-4">Producto</th>
              <th className="w-1/4 py-2 px-4">Peso</th>
              <th className="w-1/4 py-2 px-4">Descripcion</th>
              <th className="w-1/4 py-2 px-4">Editar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {insumos.map((insumo, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{insumo.producto}</td>
                <td className="border px-4 py-2">{insumo.peso}</td>
                <td className="border px-4 py-2">{insumo.descripcion}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      handleEditar(insumo._id);
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  >
                    <FaEdit color="white" 
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editarInsumo && <EditarInsumo insumoId={editarInsumo}/>}
    </Layout>
  );
};

export default Insumos;