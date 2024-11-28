import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Alert, Box, IconButton } from "@mui/material";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { useProductosStore } from "../../store";

const NuevaTienda = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [tienda, setTienda] = useState({
    cliente: null,
    nombreTienda: "",
    direccion: "",
    descripcion: "",
    productos: [],
  });
  const [clientesOptions, setClientesOptions] = useState([]);
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);

  const { productos, fetchProductos } = useProductosStore((state) => ({
    productos: state.productos,
    fetchProductos: state.fetchProductos,
  }));

  const productosOptions = productos.map((producto) => ({
    value: producto._id,
    label: producto.nombreProducto,
  }));

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/clientes/clienteSelect`, {
          headers: { "x-auth-token": token },
        });
        const clientes = response.data.map((cliente) => ({
          value: cliente._id,
          label: cliente.nombre,
        }));
        setClientesOptions(clientes);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };
    
    obtenerClientes();
    fetchProductos();
  }, [fetchProductos]);

  const handleInputChange = (name, value) => {
    setTienda((prevTienda) => ({
      ...prevTienda,
      [name]: value,
    }));
  };

  const handleProductoChange = (selectedOptions) => {
    handleInputChange(
      "productos",
      selectedOptions.map((producto) => ({
        _id: producto.value,
        nombre: producto.label,
        precio: "",
      }))
    );
  };

  const handlePrecioChange = (index, precio) => {
    const nuevosProductos = [...tienda.productos];
    nuevosProductos[index].precio = precio;
    setTienda((prevTienda) => ({
      ...prevTienda,
      productos: nuevosProductos,
    }));
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = [...tienda.productos];
    nuevosProductos.splice(index, 1);
    setTienda((prevTienda) => ({
      ...prevTienda,
      productos: nuevosProductos,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/tiendas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          ...tienda,
          nombreCliente: tienda.cliente, 
          productos: tienda.productos.map((producto) => ({
            producto: producto._id,
            precio: producto.precio,
          })),
        }),
      });
  
      if (response.ok) {
        setExito("Tienda creada exitosamente");
        setTimeout(() => {
          onClose();
          navigate("/tiendas");
        }, 2000);
      } else {
        setError("Error al crear una nueva tienda");
      }
    } catch (error) {
      console.error(error);
      setError("Error al crear una nueva tienda");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={tienda.productos.length > 0 ? "md" : "sm"} 
      fullWidth
    >
      <DialogTitle>Nueva Tienda</DialogTitle>
      <DialogContent>
        {exito && <Alert severity="success" sx={{ mb: 2 }}>{exito}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box display="flex" flexDirection={{ xs: "column", md: tienda.productos.length > 0 ? "row" : "column" }} gap={3}>
          {/* Columna Izquierda */}
          <Box flex={1} width={tienda.productos.length > 0 ? "50%" : "100%"}>
            <Typography variant="h6" gutterBottom>Información de la Tienda</Typography>
            <Select
              options={clientesOptions}
              onChange={(option) => handleInputChange("cliente", option?.value)}
              value={clientesOptions.find((option) => option.value === tienda.cliente) || null}
              placeholder="Seleccionar Cliente"
              className="mb-4"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 1300 }),
              }}
            />
            <TextField
              label="Nombre de la Tienda"
              fullWidth
              margin="normal"
              variant="outlined"
              value={tienda.nombreTienda}
              onChange={(e) => handleInputChange("nombreTienda", e.target.value)}
              required
            />
            <TextField
              label="Dirección"
              fullWidth
              margin="normal"
              variant="outlined"
              value={tienda.direccion}
              onChange={(e) => handleInputChange("direccion", e.target.value)}
              required
            />
            <TextField
              label="Descripción"
              fullWidth
              margin="normal"
              variant="outlined"
              rows={3}
              value={tienda.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
            />
            <Typography variant="h6" gutterBottom className="mt-4">Productos</Typography>
            <Select
              options={productosOptions}
              isMulti
              onChange={handleProductoChange}
              value={tienda.productos.map((producto) => ({ value: producto._id, label: producto.nombre }))}
              placeholder="Seleccionar Productos"
              className="mb-4"
            />
          </Box>

          {/* Columna Derecha */}
          {tienda.productos.length > 0 && (
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>Productos Seleccionados</Typography>
              {tienda.productos.map((producto, index) => (
                <Box
                  key={producto._id}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mb={2}
                  sx={{
                    position: "relative",
                    "&:hover .delete-icon": {
                      visibility: "visible",
                    },
                  }}
                >
                  <TextField
                    label={`Precio de ${producto.nombre}`}
                    variant="outlined"
                    type="number"
                    value={producto.precio}
                    onChange={(e) => handlePrecioChange(index, e.target.value)}
                    required
                    fullWidth
                  />
                  <Box
                    className="delete-icon"
                    sx={{
                      visibility: "hidden", 
                      cursor: "pointer",
                    }}
                  >
                    <IconButton onClick={() => eliminarProducto(index)} color="error">
                      <Delete/>
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NuevaTienda; 