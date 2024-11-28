import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import FacturaNotificacion from "../../components/FacturaNotificacion";
import Facturaslist from "./FacturasList";
import CrearFacturaModal from "./CrearFacturaModal";

function Facturacion() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl text-gray-800 font-light mb-6">Facturas</h1>

        <div className="flex justify-between items-center mb-4">
          {/* Botón Agregar */}
          <Link
            to="#"
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-800 py-2 px-5 text-white rounded text-sm hover:bg-gray-800 uppercase font-bold w-full lg:w-auto text-center"
          >
            Agregar
          </Link>

          {/* Icono de notificación */}
          <FacturaNotificacion />
        </div>

        {/* Lista de facturas */}
        <Facturaslist />

        {/* Modal para crear facturas */}
        <CrearFacturaModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </Layout>
  );
}

export default Facturacion;