import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useEstadisticasStore } from '../../store/index';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReposicionesEstadisticas = () => {
  const navigate = useNavigate();

  // Usar el estado `useEstadisticasStore`
  const { estadisticasReposiciones, fetchEstadisticasReposiciones } = useEstadisticasStore((state) => ({
    estadisticasReposiciones: state.estadisticasReposiciones,
    fetchEstadisticasReposiciones: state.fetchEstadisticasReposiciones,
  }));

  useEffect(() => {
    fetchEstadisticasReposiciones();
  }, [fetchEstadisticasReposiciones]);

  // Extraer datos para el gráfico
  const usuarios = estadisticasReposiciones.map((usuario) => `${usuario._id.nombre} ${usuario._id.apellido}`);
  const totalReposiciones = estadisticasReposiciones.map((usuario) => usuario.totalReposiciones);

  // Configuración de los datos del gráfico
  const data = {
    labels: usuarios,
    datasets: [
      {
        label: 'Total de Reposiciones',
        data: totalReposiciones,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones de configuración del gráfico
  const options = {
    indexAxis: 'y', // Muestra las barras en horizontal
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Productividad de Repositores - Total de Reposiciones',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString(), // Formato numérico
        },
      },
    },
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Estadísticas de Reposiciones</h2>
          <button
            onClick={() => navigate('/estadisticas')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold"
          >
            <ArrowBackIcon fontSize="small" />
            <span>Volver</span>
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          {estadisticasReposiciones.length > 0 ? (
            <Bar data={data} options={options} />
          ) : (
            <p className="text-center text-gray-500">Cargando estadísticas de reposiciones...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReposicionesEstadisticas;