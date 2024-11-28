import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Grid,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Add, Delete, Close } from "@mui/icons-material";

const ProductoModal = ({ onClose, tiendaId }) => {
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([{ productoId: "", precio: "" }]);
  const apiUrl = import.meta.env.VITE_API_SERVER;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProductos = async () => {
      const response = await fetch(`${apiUrl}/productos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      const data = await response.json();
      setProductos(data);
    };
    fetchProductos();
  }, []);

  const handleProductoChange = (index, value) => {
    const updatedProductos = [...productosSeleccionados];
    updatedProductos[index].productoId = value;
    setProductosSeleccionados(updatedProductos);
  };

  const handlePrecioChange = (index, value) => {
    const updatedProductos = [...productosSeleccionados];
    updatedProductos[index].precio = value;
    setProductosSeleccionados(updatedProductos);
  };

  const añadirProducto = () => {
    setProductosSeleccionados([...productosSeleccionados, { productoId: "", precio: "" }]);
  };

  const quitarProducto = (index) => {
    const updatedProductos = [...productosSeleccionados];
    updatedProductos.splice(index, 1);
    setProductosSeleccionados(updatedProductos);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/tiendas/${tiendaId}/nuevoproducto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ tiendaId, productos: productosSeleccionados }),
    });

    if (response.ok) {
      onClose();
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Añadir Nuevo Producto
        <Tooltip title="Cerrar" arrow>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
            aria-label="Cerrar"
          >
            <Close />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Seleccione los productos y asigne un precio:
        </Typography>
        <Box component="form" onSubmit={guardarProducto}>
          {productosSeleccionados.map((producto, index) => (
            <Grid container spacing={2} key={index} alignItems="center" marginBottom={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Producto"
                  value={producto.productoId}
                  onChange={(e) => handleProductoChange(index, e.target.value)}
                  required
                >
                  <MenuItem value="">
                    <em>Seleccione un producto</em>
                  </MenuItem>
                  {productos.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.nombreProducto}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  fullWidth
                  label="Precio"
                  value={producto.precio}
                  onChange={(e) => handlePrecioChange(index, e.target.value)}
                  required
                  inputProps={{ min: "0", step: "0.01" }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                {productosSeleccionados.length > 1 && (
                  <IconButton
                    onClick={() => quitarProducto(index)}
                    color="error"
                    size="large"
                  >
                    <Delete />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <Button
            onClick={añadirProducto}
            startIcon={<Add />}
            variant="outlined"
            color="primary"
            sx={{ marginBottom: 2 }}
          >
            Añadir otro producto
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={guardarProducto} type="submit" variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoModal;