import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Layout from "../../components/Layout";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const UltimasReposiciones = () => {
  const [tiendas, setTiendas] = useState([]); 
  const [categorias, setCategorias] = useState([]); 
  const [reposiciones, setReposiciones] = useState([]); 
  const [selectedTienda, setSelectedTienda] = useState(null); 
  const [selectedCategoria, setSelectedCategoria] = useState(null); 
  const [error, setError] = useState(null); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [detalleReposicion, setDetalleReposicion] = useState(null); 
  

  const fetchTiendas = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_SERVER;

      const response = await axios.get(`${apiUrl}/tiendas/tiendaSelect`, {
        headers: { "x-auth-token": token },
      });

      const opciones = response.data.map((tienda) => ({
        value: tienda._id,
        label: tienda.nombreTienda,
      }));

      setTiendas(opciones);
    } catch (err) {
      console.error("Error al obtener las tiendas:", err);
      Swal.fire("Error", "No se pudieron cargar las tiendas.", "error");
    }
  };

  // Función para cargar las categorías
  const fetchCategorias = () => {
    const opcionesCategorias = [
      { value: "Lievito", label: "Lievito" },
      { value: "EatWell", label: "EatWell" },
    ];
    setCategorias(opcionesCategorias);
  };

  // Función para cargar las reposiciones filtradas por tienda y categoría
  const fetchReposiciones = async (tiendaId, categoria) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_SERVER;

      const response = await axios.get(
        `${apiUrl}/reposiciones/ultimas/${tiendaId}?categoria=${categoria}`,
        {
          headers: { "x-auth-token": token },
        }
      );

      setReposiciones(response.data.reposiciones);
      setError(null);
    } catch (err) {
      console.error("Error al obtener las reposiciones:", err);
      setReposiciones([]);
      setError("No se encontraron reposiciones para esta tienda y categoría.");
    }
  };

  // Efecto para cargar las tiendas y categorías al montar el componente
  useEffect(() => {
    fetchTiendas();
    fetchCategorias();
  }, []);

  // Manejo del cambio en el select d
  const handleTiendaChange = (selectedOption) => {
    setSelectedTienda(selectedOption);
    if (selectedOption && selectedCategoria) {
      fetchReposiciones(selectedOption.value, selectedCategoria.value);
    }
  };

  const handleCategoriaChange = (selectedOption) => {
    setSelectedCategoria(selectedOption);
    if (selectedOption && selectedTienda) {
      fetchReposiciones(selectedTienda.value, selectedOption.value);
    }
  };

  const handleOpenDialog = (data) => {
    setDetalleReposicion(data.productos); 
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDetalleReposicion(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl text-gray-800 font-light mb-4">
          Últimas Reposiciones por Tienda y Categoría
        </h1>

        {/* Selects lado a lado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una tienda:
            </label>
            <Select
              options={tiendas}
              value={selectedTienda}
              onChange={handleTiendaChange}
              placeholder="Buscar tienda..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una categoría:
            </label>
            <Select
              options={categorias}
              value={selectedCategoria}
              onChange={handleCategoriaChange}
              placeholder="Buscar categoría..."
            />
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Mostrar reposiciones */}
              {reposiciones.length > 0 && (
                  <div className="space-y-4">
                      {/* Reciente */}
                      <div className="bg-white shadow-md rounded p-4 flex justify-between items-center">
                          <div>
                              <h2 className="text-lg font-bold text-gray-800 mb-2">Reciente</h2>
                              <p>
                                  <strong>Fecha:</strong>{" "}
                                  {new Date(reposiciones[0].fechaReposicion).toLocaleDateString()}
                              </p>
                              <p>
                                  <strong>Tienda:</strong> {reposiciones[0].tienda.nombreTienda}
                              </p>
                              <p>
                                  <strong>Usuario:</strong>{" "}
                                  {`${reposiciones[0].usuario.nombre} ${reposiciones[0].usuario.apellido}`}
                              </p>
                          </div>
                          <button
                              onClick={() => handleOpenDialog(reposiciones[0])}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                              Ver Detalle
                          </button>
                      </div>

                      {/* Anterior */}
                      {reposiciones.length > 1 && (
                          <div className="bg-gray-100 shadow-md rounded p-4 flex justify-between items-center">
                              <div>
                                  <h2 className="text-lg font-bold text-gray-800 mb-2">Anterior</h2>
                                  <p>
                                      <strong>Fecha:</strong>{" "}
                                      {new Date(reposiciones[1].fechaReposicion).toLocaleDateString()}
                                  </p>
                                  <p>
                                      <strong>Tienda:</strong> {reposiciones[1].tienda.nombreTienda}
                                  </p>
                                  <p>
                                      <strong>Usuario:</strong>{" "}
                                      {`${reposiciones[1].usuario.nombre} ${reposiciones[1].usuario.apellido}`}
                                  </p>
                              </div>
                              <button
                                  onClick={() => handleOpenDialog(reposiciones[1])}
                                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                              >
                                  Ver Detalle
                              </button>
                          </div>
                      )}
                  </div>
              )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            Detalle de la Reposición
            <Tooltip title="Cerrar" arrow>
              <IconButton
                onClick={handleCloseDialog}
                sx={{ position: "absolute", right: 8, top: 8 }}
                aria-label="Cerrar"
              >
                <Close />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <DialogContent>
            {detalleReposicion ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 divide-y divide-gray-300">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Cantidad Exhibida
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Sugerido
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Deposito
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Vencidos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-300">
                    {detalleReposicion.map((producto) => (
                      <tr key={producto._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.producto?.nombreProducto}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.cantidadExhibida}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.deposito}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.sugerido}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.vencidos}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Typography>Cargando detalles...</Typography>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default UltimasReposiciones;