import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from "react-select";
import dayjs from "dayjs";
import { useTiendasStore } from "../../store";
import axios from "axios";
import Swal from "sweetalert2";

const CrearFacturaModal = ({ open, onClose, refreshFacturas }) => {
  const { tiendaSelect, fetchTiendaSelect } = useTiendasStore();
  const [tienda, setTienda] = useState(null);
  const [cliente, setCliente] = useState({ nombre: "", ruc: "" });
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [fechaFactura, setFechaFactura] = useState(dayjs());
  const [fechaVencimiento, setFechaVencimiento] = useState(dayjs());
  const [metodoPago, setMetodoPago] = useState("credito");

  useEffect(() => {
    fetchTiendaSelect();
  }, [fetchTiendaSelect]);

  const handleTiendaChange = (selectedOption) => {
    setTienda(selectedOption);
    if (selectedOption) {
      setCliente(selectedOption.cliente);
      setProductos(selectedOption.productos || []);
      const initialCantidades = {};
      selectedOption.productos.forEach((producto) => {
        initialCantidades[producto.producto._id] = 0;
      });
      setCantidades(initialCantidades);
    } else {
      setProductos([]);
      setCantidades({});
      setCliente({ nombre: "", ruc: "" });
    }
  };

  const handleCantidadChange = (productoId, value) => {
    setCantidades((prev) => ({ ...prev, [productoId]: Number(value) }));
  };

  
  const handleCrearFactura = async () => {
    const productosSeleccionados = productos
      .map((producto) => ({
        productoId: producto.producto._id,
        cantidad: cantidades[producto.producto._id] || 0,
      }))
      .filter((p) => p.cantidad > 0);

    if (productosSeleccionados.length === 0) {
      Swal.fire("Advertencia", "Debe agregar al menos un producto con cantidad mayor a cero.", "warning");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_SERVER;
      await axios.post(
        `${apiUrl}/facturacion/crear-factura`,
        {
          clienteId: cliente._id,
          tiendaId: tienda.value,
          productosSeleccionados,
          fechaFactura: fechaFactura.toISOString(),
          fechaVencimiento: fechaVencimiento.toISOString(),
          metodoPago,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      Swal.fire("Éxito", "La factura ha sido registrada exitosamente", "success");
      refreshFacturas()
      onClose();
    } catch (error) {
      console.error("Error al registrar la factura:", error);
      Swal.fire("Error", "No se pudo registrar la factura", "error");
    }
  };

  const handleMetodoPagoChange = (pago) => {
    setMetodoPago(pago);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Nueva Factura</DialogTitle>
      <DialogContent>
        <Select
          options={tiendaSelect}
          onChange={handleTiendaChange}
          value={tienda}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
          className="mb-4"
          placeholder="Seleccionar Tienda"
          styles={{
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
        />

        {tienda && (
          <>
            <TextField label="Cliente" value={cliente.nombre} fullWidth margin="normal" InputProps={{ readOnly: true }} />
            <TextField label="RUC" value={cliente.ruc} fullWidth margin="normal" InputProps={{ readOnly: true }} />
          </>
        )}

        {productos.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Productos</h2>
            {productos.map((producto) => (
              <div key={producto.producto._id} className="flex justify-between items-center mt-4">
                <span className="text-gray-700">{producto.producto.nombreProducto}</span>
                <TextField
                  type="number"
                  min="0"
                  value={cantidades[producto.producto._id] || ""}
                  onChange={(e) => handleCantidadChange(producto.producto._id, e.target.value)}
                  className="w-24"
                  variant="outlined"
                  size="small"
                />
              </div>
            ))}
          </div>
        )}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} mb={2}>
            <DatePicker
              label="Fecha de Emisión"
              value={fechaFactura}
              onChange={(newDate) => setFechaFactura(newDate)}
              slotProps={{ textField: { fullWidth: true } }}
            />

            <DatePicker
              label="Fecha de Vencimiento"
              value={fechaVencimiento}
              onChange={(newDate) => setFechaVencimiento(newDate)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>
        </LocalizationProvider>

        <Box display="flex" flexDirection="row">
          <FormControlLabel
            control={
              <Checkbox
                checked={metodoPago === "credito"}
                onChange={() => handleMetodoPagoChange("credito")}
                color="primary"
              />
            }
            label="Crédito"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={metodoPago === "contado"}
                onChange={() => handleMetodoPagoChange("contado")}
                color="primary"
              />
            }
            label="Contado"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleCrearFactura} variant="contained" color="primary">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearFacturaModal;