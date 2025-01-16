import React, { useState, useEffect } from "react";
import { Info } from "@mui/icons-material";
import { Typography, Box } from "@mui/material";
import Select from "react-select";
import Layout from "../../components/Layout";
import DialogoDetalles from "../../components/DialogoDetalles";
import { useReposicionesStore, useTiendasStore } from "../../store";

const UltimasReposiciones = () => {
  const [selectedTienda, setSelectedTienda] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detalleReposicion, setDetalleReposicion] = useState(null);

  const { tiendaSelect, fetchTiendaSelect } = useTiendasStore();

  const {
    categorias,
    fetchCategorias,
    ultimasReposiciones,
    errorUltimasReposiciones,
    loadingUltimasReposiciones,
    fetchUltimasReposiciones,
    resetUltimasReposiciones,
  } = useReposicionesStore();

  useEffect(() => {
    fetchTiendaSelect();
    fetchCategorias();
    resetUltimasReposiciones();
  }, []);

  const handleTiendaChange = (selectedOption) => {
    setSelectedTienda(selectedOption);
    if (selectedOption && selectedCategoria) {
      fetchUltimasReposiciones(selectedOption.value, selectedCategoria.value);
    }
  };

  const handleCategoriaChange = (selectedOption) => {
    setSelectedCategoria(selectedOption);
    if (selectedOption && selectedTienda) {
      fetchUltimasReposiciones(selectedTienda.value, selectedOption.value);
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
          Reposiciones por Tienda y Categoría
        </h1>
        <Box display="flex" alignItems="center" gap={1} mb={4}>
          <Info fontSize="small" color="action" />
          <Typography variant="body2" color="textSecondary">
            Selecciona una tienda y categoría para visualizar las reposiciones recientes.
          </Typography>
        </Box>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una tienda:
            </label>
            <Select
              options={tiendaSelect}
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

        {loadingUltimasReposiciones && (
          <p className="text-gray-500">Cargando reposiciones...</p>
        )}

        {errorUltimasReposiciones && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            {errorUltimasReposiciones}
          </div>
        )}

        {ultimasReposiciones.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md border-l-4 border-blue-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-blue-600 mb-1">Reciente</h2>
                <p className="text-gray-600">
                  <strong className="text-gray-800">Tienda:</strong>{" "}
                  {ultimasReposiciones[0].tienda?.nombreTienda}
                </p>
                <p className="text-gray-600">
                  <strong className="text-gray-800">Fecha:</strong>{" "}
                  {new Date(
                    ultimasReposiciones[0].fechaReposicion
                  ).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong className="text-gray-800">Usuario:</strong>{" "}
                  {`${ultimasReposiciones[0].usuario?.nombre} ${ultimasReposiciones[0].usuario?.apellido}`}
                </p>
              </div>
              <button
                onClick={() => handleOpenDialog(ultimasReposiciones[0])}
                className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition duration-200 shadow-sm"
              >
                Ver Productos
              </button>
            </div>

            {ultimasReposiciones.length > 1 && (
              <div className="bg-gray-50 rounded-lg shadow-md border-l-4 border-gray-500 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-600 mb-1">Anterior</h2>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Tienda:</strong>{" "}
                    {ultimasReposiciones[1].tienda?.nombreTienda}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Fecha:</strong>{" "}
                    {new Date(
                      ultimasReposiciones[1].fechaReposicion
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Usuario:</strong>{" "}
                    {`${ultimasReposiciones[1].usuario?.nombre} ${ultimasReposiciones[1].usuario?.apellido}`}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenDialog(ultimasReposiciones[1])}
                  className="bg-gray-500 text-white font-medium py-2 px-4 rounded hover:bg-gray-600 transition duration-200 shadow-sm"
                >
                  Ver Productos
                </button>
              </div>
            )}
          </div>
        )}

        {/* Uso del Componente Reutilizable */}
        <DialogoDetalles
          open={dialogOpen}
          onClose={handleCloseDialog}
          titulo="Detalle de la Reposición"
          detalleReposicion={detalleReposicion}
        />
      </div>
    </Layout>
  );
};

export default UltimasReposiciones;