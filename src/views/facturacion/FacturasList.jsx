import { useEffect } from "react";
import { useFacturasStore } from "../../store";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { format } from "date-fns";

function FacturasList() {
  const { facturas, fetchFacturas } = useFacturasStore();

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "VENCIDO":
        return "#f44336"; 
      case "PENDIENTE":
        return "#2196f3"; 
      case "COBRADO":
        return "#4caf50"; 
      case "CANCELADO":
        return "#9e9e9e"; 
      default:
        return "#000000"; 
    }
  };

  return (
    <TableContainer component={Paper} className="mt-6 shadow-md">
      <Table>
        <TableHead style={{ backgroundColor: "#1f2937" }}>
          <TableRow>
            <TableCell style={{ color: "white", fontWeight: "bold" }}>Cliente</TableCell>
            <TableCell style={{ color: "white", fontWeight: "bold" }}>Tienda</TableCell>
            <TableCell style={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
            <TableCell style={{ color: "white", fontWeight: "bold" }}>Fecha de Vencimiento</TableCell>
            <TableCell style={{ color: "white", fontWeight: "bold" }}>Total</TableCell>
            <TableCell style={{ color: "white", fontWeight: "bold" }}>Método de Pago</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {facturas.map((factura) => (
            <TableRow key={factura._id} className="hover:bg-gray-50 transition-colors">
              <TableCell>{factura.cliente.nombre}</TableCell>
              <TableCell>{factura.tienda.nombreTienda}</TableCell>
              <TableCell style={{ color: getEstadoColor(factura.estado), fontWeight: "bold" }}>
                {factura.estado}
              </TableCell>
              <TableCell>{format(new Date(factura.fechaVencimiento), "dd/MM/yyyy")}</TableCell>
              <TableCell className="font-semibold text-gray-700">Gs. {factura.total.toLocaleString()}</TableCell>
              <TableCell className="capitalize">{factura.metodoPago}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FacturasList;