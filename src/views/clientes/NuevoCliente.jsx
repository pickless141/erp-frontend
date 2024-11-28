import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, Box } from "@mui/material";

const NuevoCliente = ({ open, onClose }) => {
  const [cliente, setCliente] = useState({
    nombre: "",
    ruc: "",
    telefono: "",
  });
  const [alerta, setAlerta] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        setAlerta({ message: "Cliente creado exitosamente", type: "success" });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setAlerta({ message: "Error al crear un nuevo cliente", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setAlerta({ message: "Error al crear un nuevo cliente", type: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nuevo Cliente</DialogTitle>
      <DialogContent>
        {alerta && (
          <Alert severity={alerta.type} sx={{ mb: 2 }}>
            {alerta.message}
          </Alert>
        )}
        <TextField
          label="Razón Social"
          name="nombre"
          value={cliente.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          label="RUC"
          name="ruc"
          value={cliente.ruc}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={cliente.telefono}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
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

export default NuevoCliente;