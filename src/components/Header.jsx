import React, { useState, useEffect } from 'react';

const Header = () => {
  const [usuario, setUsuario] = useState({
    nombre: localStorage.getItem('nombre'),
    apellido: localStorage.getItem('apellido'),
  });

  useEffect(() => {
    // Verificar si los datos del usuario existen en el almacenamiento local
    const storedNombre = localStorage.getItem('nombre');
    const storedApellido = localStorage.getItem('apellido');
    if (storedNombre && storedApellido) {
      setUsuario({ nombre: storedNombre, apellido: storedApellido });
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('apellido');
    window.location.href = '/';
  };

  return (
    <div className="sm:flex sm:justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0 text-lg">Hola: {usuario.nombre} {usuario.apellido}</p>

      <button
        onClick={() => cerrarSesion()}
        type="button"
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;