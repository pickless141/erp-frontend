import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Swal from "sweetalert2";

const NuevaProduccion = ({ open, onClose, onProduccionCreated, currentPage, currentLimit }) => {
  const [productos, setProductos] = useState([]);
  const [produccion, setProduccion] = useState({
    productoId: "",
    cantidadProducida: "",
    numeroLote: "",
    fechaVencimiento: "",
  });

  const apiUrl = import.meta.env.VITE_API_SERVER;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (open) {
      const fetchProductos = async () => {
        try {
          const response = await fetch(`${apiUrl}/productos`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          });
          const data = await response.json();
          setProductos(data);
        } catch (error) {
          console.error("Error al obtener los productos:", error);
        }
      };
      fetchProductos();
    }
  }, [open, apiUrl, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduccion({ ...produccion, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/producciones/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(produccion),
      });

      if (response.ok) {
        Swal.fire("Éxito", "Producción registrada exitosamente", "success");
        onProduccionCreated(currentPage, currentLimit);
        setProduccion({
          productoId: "",
          cantidadProducida: "",
          numeroLote: "",
          fechaVencimiento: "",
        });
        onClose();
      } else {
        Swal.fire("Error", "Error al registrar la producción", "error");
      }
    } catch (error) {
      console.error("Error al guardar la producción:", error);
      Swal.fire("Error", "Error al registrar la producción", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar Nueva Producción</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="producto-select-label">Producto</InputLabel>
            <Select
              labelId="producto-select-label"
              value={produccion.productoId}
              onChange={(e) => handleInputChange({ target: { name: "productoId", value: e.target.value } })}
              name="productoId"
              required
            >
              <MenuItem value="">
                <em>Seleccione un producto</em>
              </MenuItem>
              {productos.map((producto) => (
                <MenuItem key={producto._id} value={producto._id}>
                  {producto.nombreProducto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Cantidad Producida"
            name="cantidadProducida"
            type="number"
            fullWidth
            value={produccion.cantidadProducida}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="normal"
            label="Número de Lote"
            name="numeroLote"
            type="number"
            fullWidth
            value={produccion.numeroLote}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="normal"
            label="Fecha de Vencimiento"
            name="fechaVencimiento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={produccion.fechaVencimiento}
            onChange={handleInputChange}
            required
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Registrar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevaProduccion;