import { Navigate } from 'react-router-dom';

const getRolesFromStorage = () => {
  const roles = localStorage.getItem('roles');
  if (!roles) {
    return [];
  }
  try {
    return JSON.parse(roles);
  } catch (error) {
    console.error('Error al parsear roles desde localStorage:', error);
    return [];
  }
};


const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const roles = getRolesFromStorage();


  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!roles.some((role) => allowedRoles.includes(role))) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;