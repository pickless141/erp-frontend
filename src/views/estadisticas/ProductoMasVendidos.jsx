import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEstadisticasStore } from '../../store/index';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProductosMasVendidos() {
  const { productosMasVendidos, fetchProductosMasVendidos } = useEstadisticasStore((state) => ({
    productosMasVendidos: state.productosMasVendidos,
    fetchProductosMasVendidos: state.fetchProductosMasVendidos,
  }));

  useEffect(() => {
    fetchProductosMasVendidos();
  }, [fetchProductosMasVendidos]);

  const nombresProductos = productosMasVendidos.map((producto) => producto._id.nombreProducto);
  const cantidadesVendidas = productosMasVendidos.map((producto) => producto.totalVendidos);

  const data = {
    labels: nombresProductos,
    datasets: [
      {
        label: 'Total Vendidos',
        data: cantidadesVendidas,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }, // Eliminada la aserción de tipo
      title: { display: true, text: 'Productos Más Vendidos' },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { 
          callback: (value) => value.toLocaleString() 
        },
      },
    },
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-4">
          <Link
            to="/estadisticas"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold"
          >
            <ArrowBackIcon fontSize="small" />
            <span>Volver</span>
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Productos Más Vendidos</h2>

        <div className="bg-white p-4 rounded-lg shadow-md">
          {productosMasVendidos.length > 0 ? (
            <Bar data={data} options={options} />
          ) : (
            <p className="text-center text-gray-500">Cargando estadísticas...</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ProductosMasVendidos;