import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import { Delete, Close } from "@mui/icons-material";

const EditarTienda = ({ open, onClose, onUpdated, tiendaId }) => {
  const [tienda, setTienda] = useState({
    nombreCliente: "",
    nombreTienda: "",
    direccion: "",
    descripcion: "",
    productos: [],
  });
  const [productosEliminados, setProductosEliminados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && tiendaId) {
      const obtenerTienda = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_SERVER;
          const token = localStorage.getItem("token");
          const response = await fetch(`${apiUrl}/tiendas/tienda/${tiendaId}`, {
            method: "GET",
            headers: {
              "x-auth-token": token,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setTienda({
              nombreCliente: data.nombreCliente,
              nombreTienda: data.nombreTienda,
              direccion: data.direccion,
              descripcion: data.descripcion,
              productos: data.productos.map((prod) => ({
                id: prod.id,
                nombre: prod.nombre,
                precio: prod.precio,
              })),
            });
          } else {
            throw new Error(
              `Error en la solicitud: ${response.status} - ${response.statusText}`
            );
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      obtenerTienda();
    }
  }, [open, tiendaId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTienda({ ...tienda, [name]: value });
  };

  const handlePrecioChange = (index, value) => {
    const updatedProductos = [...tienda.productos];
    updatedProductos[index].precio = parseFloat(value);
    setTienda({ ...tienda, productos: updatedProductos });
  };

  const handleDeleteProduct = (index) => {
    const updatedProductos = tienda.productos.filter((_, i) => i !== index);
    setProductosEliminados([...productosEliminados, tienda.productos[index].id]);
    setTienda({ ...tienda, productos: updatedProductos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/tiendas/${tiendaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          nombreCliente: tienda.nombreCliente,
          nombreTienda: tienda.nombreTienda,
          direccion: tienda.direccion,
          descripcion: tienda.descripcion,
          productos: tienda.productos,
          productosAEliminar: productosEliminados,
        }),
      });
      if (response.ok) {
        onUpdated();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(`Error al actualizar la tienda: ${errorData.message}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography>Cargando datos de la tienda...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Editar Tienda
        <Tooltip title="Cerrar" arrow>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Nombre de la Tienda"
              name="nombreTienda"
              value={tienda.nombreTienda}
              onChange={handleInputChange}
              required
              margin="dense"
              size="small" 
            />
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={tienda.direccion}
              onChange={handleInputChange}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={tienda.descripcion}
              onChange={handleInputChange}
              margin="dense"
              size="small"
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            Productos
          </Typography>
          {tienda.productos.map((producto, index) => (
            <Box
              key={producto.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1.5}
              p={1}
              border={1}
              borderRadius={1}
              sx={{
                borderColor: "grey.300",
                "&:hover .delete-icon": { opacity: 1 },
              }}
            >
              <Typography sx={{ fontSize: "0.9rem" }}>
                {producto.nombre} - Gs. {producto.precio}
              </Typography>
              <TextField
                type="number"
                label="Precio"
                value={producto.precio}
                onChange={(e) => handlePrecioChange(index, e.target.value)}
                inputProps={{ min: "0", step: "0.01" }}
                sx={{ width: "30%" }}
                size="small"
              />
              <IconButton
                className="delete-icon"
                onClick={() => handleDeleteProduct(index)}
                color="error"
                size="small"
                sx={{
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" size="small">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" size="small">
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarTienda;