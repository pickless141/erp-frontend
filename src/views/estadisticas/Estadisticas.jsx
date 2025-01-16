import React from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Estadisticas = () => {
  const estadisticasItems = [
    { label: 'Ventas', path: '/estadisticas/ventas' },
    { label: 'Producto Más Vendido', path: '/estadisticas/producto-mas-vendido' },
    { label: 'Tiendas', path: '/estadisticas/productos-mas-vendidos-por-tienda' },
    { label: 'Reposiciones', path: '/estadisticas/reposiciones' },
  ];

  return (
    
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-2">Estadisticas</h1>
      <span className='text-xl font-light mb-2'>Selecciona una estadistica</span>

      <div className="max-w-4xl mx-auto py-8">
        <Grid container spacing={4} justifyContent="center">
          {estadisticasItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.label}>
              <Link to={item.path}>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="text-center">
                    <Typography variant="h6" className="text-gray-800 font-medium">
                      {item.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export default Estadisticas;