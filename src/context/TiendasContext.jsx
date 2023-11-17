import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TiendasContext = createContext();

export const useTiendas = () => {
  return useContext(TiendasContext);
};

export const TiendasProvider = ({ children }) => {
  const [tiendas, setTiendas] = useState([]);

  const obtenerTiendas = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const response = await axios.get(`${apiUrl}/tiendas/tiendaSelect`, {
        headers: {
          'x-auth-token': token,
        },
      });
  
      const tiendas = response.data.map(tienda => ({
        value: tienda._id,
        label: tienda.nombreTienda,
      }));
      
      setTiendas(tiendas);
    } catch (error) {
      console.error('Error al obtener las tiendas:', error);
    }
  };

  useEffect(() => {
    obtenerTiendas();
  }, []);

  const value = {
    tiendas,
    setTiendas,
    obtenerTiendas,
  };

  return <TiendasContext.Provider value={value}>{children}</TiendasContext.Provider>;
};