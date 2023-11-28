import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/lievito-white.svg'

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="bg-gray-700 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <Link to="/home">
            <img src={logo} alt="loginImagen"/>
            </Link>

            <nav className="mt-5 list-none">
                <li className={location.pathname === "/home" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link to="/home" className="text-white text-lg block">
                        Clientes
                    </Link>
                </li>
                <li className={location.pathname === "/tiendas" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link to="/tiendas" className="text-white text-lg block">
                        Tiendas
                    </Link>
                </li>
                <li className={location.pathname === "/pedidos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link to="/pedidos" className="text-white text-lg block">
                        Pedidos
                    </Link>
                </li>
                <li className={location.pathname === "/reposiciones" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link to="/reposiciones" className="text-white text-lg block">
                        Reposiciones
                    </Link>
                </li>
                <li className={location.pathname === "/productos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link to="/productos" className="text-white text-lg block">
                        Productos
                    </Link>
                </li>
            </nav>

            <div className="sm:mt-10">
                <p className="text-white text-3xl font-black">Otras Opciones</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={location.pathname === "/producciones" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link to="/producciones" className="text-white text-lg block">
                        Producciones
                    </Link>
                </li>
                <li className={location.pathname === "/insumos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link to="/insumos" className="text-white text-lg block">
                        Insumos
                    </Link>
                </li>
            </nav>
        </aside>
    );
}

export default Sidebar;