import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import logo from "../assets/lievito-white.svg";

const getRolesFromStorage = () => {
  const roles = localStorage.getItem("roles");
  if (!roles) {
    return [];
  }
  try {
    return JSON.parse(roles);
  } catch (error) {
    console.error("Error al parsear roles desde localStorage:", error);
    return [];
  }
};

const Sidebar = () => {
  const location = useLocation();
  const roles = getRolesFromStorage();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index)
  }

  const menuOpciones = [];

  if (roles.includes("admin")) {
    menuOpciones.push(
      { path: "/home", label: "Clientes" },
      { path: "/tiendas", label: "Tiendas" },
      { path: "/pedidos", label: "Pedidos" },
      // { path: "/facturacion", label: "Facturacion" },
      {
        label: "Reposiciones",
        submenu: [
          { path: "/reposiciones", label: "Ver Reposiciones" },
          {path: "/ultimas-reposiciones", label: "Ultimas Reposiciones"}
        ],
      },
      { path: "/productos", label: "Productos" },
      { path: "/estadisticas", label: "Estadísticas" },
      {
        label: "Produccion",
        submenu: [
          { path: "/producciones", label: "Producciones"},
          { path: "/deposito", label: "Deposito en Fabrica"}
        ]
      },
      { path: "/insumos", label: "Insumos" }
    );
  }

  if (roles.includes("vendedor")) {
    menuOpciones.push(
      { path: "/pedidos", label: "Pedidos" },
      {
        label: "Reposiciones",
        submenu: [
          { path: "/reposiciones", label: "Ver Reposiciones" },
          { path: "/ultimas-reposiciones", label: "Ultimas Reposiciones" }
        ],
      },
      { path: "/productos", label: "Productos" }
    );
  }

  if (roles.includes("repositor")) {
    menuOpciones.push(
      {
        label: "Reposiciones",
        submenu: [
          { path: "/reposiciones", label: "Ver Reposiciones" },
          { path: "/ultimas-reposiciones", label: "Ultimas Reposiciones" },
        ],
      },
      { path: "/productos", label: "Productos" }
    );
  }

  if (roles.includes("tercerizado")) {
    menuOpciones.push(
      {
        label: "Reposiciones",
        submenu: [
          { path: "/reposiciones", label: "Ver Reposiciones" },
          { path: "/ultimas-reposiciones", label: "Ultimas Reposiciones" },
        ],
      },
      { path: "/productos", label: "Productos" }
    );
  }

  if(roles.includes("produccion")) {
    menuOpciones.push(
      {
        label: "Produccion",
        submenu: [
          { path: "/producciones", label: "Producciones"},
          { path: "/deposito", label: "Deposito en Fabrica"}
        ]
      },
      // { path: "/productos", label: "Productos"},
      {path: "/insumos", label: "Insumos"}
    )
  }

  return (
    <aside className="bg-gray-700 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
      <div className="flex justify-center items-center mb-5">
        <img src={logo} alt="Lievito Logo" className="w-40 h-auto" />
      </div>

      <nav className="mt-5 list-none">
        {menuOpciones.map((opcion, index) =>
          opcion.submenu ? (
            <li key={index} className="p-2">
              <button
                onClick={() => handleSubmenu(index)} 
                className="text-white text-lg flex justify-between w-full"
              >
                {opcion.label}
                {openSubmenu === index ? (
                  <ExpandLessIcon className="text-white" />
                ) : (
                  <ExpandMoreIcon className="text-white" />
                )}
              </button>
              {openSubmenu === index && (
                <ul className="pl-4 mt-2">
                  {opcion.submenu.map((sub, subIndex) => (
                    <li
                      key={subIndex}
                      className={
                        location.pathname === sub.path
                          ? "bg-blue-800 p-2 rounded"
                          : "p-2 hover:bg-gray-400 rounded"
                      }
                    >
                      <Link to={sub.path} className="text-white text-base block">
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ) : (
            <li
              key={opcion.path}
              className={
                location.pathname === opcion.path
                  ? "bg-blue-800 p-2 rounded"
                  : "p-2 hover:bg-gray-400 rounded"
              }
            >
              <Link to={opcion.path} className="text-white text-lg block">
                {opcion.label}
              </Link>
            </li>
          )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;