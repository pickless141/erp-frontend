import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Bar } from 'react-chartjs-2';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEstadisticasStore } from '../../store/index';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VentasEstadisticas = () => {
  const { estadisticasTiendas, fetchEstadisticasTiendas } = useEstadisticasStore((state) => ({
    estadisticasTiendas: state.estadisticasTiendas,
    fetchEstadisticasTiendas: state.fetchEstadisticasTiendas,
  }));

  const [selectedDataset, setSelectedDataset] = useState('pedidos');

  useEffect(() => {
    fetchEstadisticasTiendas();
  }, [fetchEstadisticasTiendas]);

  const tiendas = estadisticasTiendas.map((tienda) => tienda._id.nombreTienda);
  const pedidosCompletados = estadisticasTiendas.map((tienda) => tienda.totalPedidos);
  const ventasTotales = estadisticasTiendas.map((tienda) => tienda.totalVentas);

  const data = {
    labels: tiendas,
    datasets: [
      selectedDataset === 'pedidos'
        ? {
            label: 'Pedidos Completados',
            data: pedidosCompletados,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }
        : {
            label: 'Total de Ventas (Gs)',
            data: ventasTotales,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Tiendas - ${selectedDataset === 'pedidos' ? 'Pedidos Completados' : 'Ventas Totales'}` },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (value) => value.toLocaleString() } },
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

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Estadísticas de Ventas por Tienda</h2>

        <div className="flex justify-start mb-6">
          <FormControl size="small" variant="outlined">
            <InputLabel>Seleccionar Métrica</InputLabel>
            <Select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              label="Seleccionar Métrica"
              className="bg-gray-100 text-gray-800"
            >
              <MenuItem value="pedidos">Pedidos Completados</MenuItem>
              <MenuItem value="ventas">Total de Ventas (Gs)</MenuItem>
            </Select>
          </FormControl>
        </div>

        {estadisticasTiendas.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <p className="text-center text-gray-500">Cargando estadísticas...</p>
        )}
      </div>
    </Layout>
  );
};

export default VentasEstadisticas;