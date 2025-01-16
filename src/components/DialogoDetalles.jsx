import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const DialogoDetalles = ({
  open,
  onClose,
  titulo = "Detalle",
  detalleReposicion = [],
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {titulo}
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
      <DialogContent>
        {Array.isArray(detalleReposicion) && detalleReposicion.length > 0 ? (
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
                    Depósito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Sugerido
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
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {producto.cantidadExhibida}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {producto.deposito}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {producto.sugerido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {producto.vencidos}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Typography className="text-gray-500 text-center py-4">
            No hay detalles disponibles.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogoDetalles;