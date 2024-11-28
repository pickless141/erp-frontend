import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Bar } from 'react-chartjs-2';
import Select from 'react-select';
import { useEstadisticasStore, useTiendasStore } from '../../store/index';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductosMasVendidosPorTienda = () => {
  const { productosMasVendidosPorTienda, fetchProductosMasVendidosPorTienda, clearProductosMasVendidosPorTienda } = useEstadisticasStore();
  const { tiendaSelect, fetchTiendaSelect } = useTiendasStore();
  const [selectedTienda, setSelectedTienda] = useState(null);

  
  useEffect(() => {
    fetchTiendaSelect();

    return () => {
      setSelectedTienda(null);
      clearProductosMasVendidosPorTienda();
    };
  }, [fetchTiendaSelect, clearProductosMasVendidosPorTienda]);

  const handleTiendaChange = (selectedOption) => {
    setSelectedTienda(selectedOption);
    fetchProductosMasVendidosPorTienda(selectedOption.value);
  };

  const productosLabels = productosMasVendidosPorTienda.map((producto) => producto._id.nombreProducto);
  const productosData = productosMasVendidosPorTienda.map((producto) => producto.totalVendidos);

  const data = {
    labels: productosLabels,
    datasets: [
      {
        label: 'Total Vendidos',
        data: productosData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Productos Más Vendidos en ${selectedTienda ? selectedTienda.label : ''}` },
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { callback: (value) => value.toLocaleString() },
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
  
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Productos Más Vendidos por Tienda</h2>
  
        <div className="flex justify-start mb-6">
          <Select
            options={tiendaSelect}
            onChange={handleTiendaChange}
            value={selectedTienda}
            placeholder="Seleccione una tienda..."
            className="w-full max-w-xs"
          />
        </div>
  
        {productosMasVendidosPorTienda.length > 0 ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Bar data={data} options={options} />
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {selectedTienda ? `No hay datos disponibles para la tienda ${selectedTienda.label}.` : "Seleccione una tienda para ver las estadísticas de productos más vendidos."}
          </p>
        )}
      </div>
    </Layout>
  );
};

export default ProductosMasVendidosPorTienda;