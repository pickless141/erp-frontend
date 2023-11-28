import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

function Producciones() {
  const [producciones, setProducciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem('token');

    fetch(`${apiUrl}/producciones/?page=${currentPage}&perPage=10`, {
      method: 'GET',
      headers: {
        'x-auth-token': token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then((data) => {
        setProducciones(data.producciones);
        setTotalPages(Math.ceil(data.totalProducciones / 10));
      })
      .catch((error) => {
        console.error('Error al obtener producciones:', error);
      });
  }, [currentPage]);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-4">Producciones</h1>
      <Link to="/nuevaproduccion" className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
        Nueva Produccion
      </Link>
      <div className="overflow-x-scroll">
        <table className="table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/5 py-2 px-4">Producto</th>
              <th className="w-1/5 py-2 px-4">Cantidad Producida</th>
              <th className="w-1/5 py-2 px-4">Fecha de Producción</th>
              <th className="w-1/5 py-2 px-4">Numero de lote</th>
              <th className="w-1/5 py-2 px-4">Fecha de Vencimiento</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {producciones.map((produccion, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{produccion.producto.nombreProducto}</td>
                <td className="border px-4 py-2">{produccion.cantidadProducida}</td>
                <td className="border px-4 py-2">{new Date(produccion.fechaProduccion).toLocaleString()}</td> 
                <td className="border px-4 py-2">{produccion.numeroLote}</td> 
                <td className="border px-4 py-2">{new Date(produccion.fechaVencimiento).toLocaleDateString()}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-2 px-4 py-2 text-sm ${
              currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'
            } rounded`}
          >
            {index + 1}
          </button>
          
        ))}
      </div>
    </Layout>
  );
}

export default Producciones;