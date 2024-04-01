import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import logo from '../assets/lievito.svg'
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email no válido').required('Campo requerido'),
  password: Yup.string().required('Campo requerido'),
});

const Login = () => {
  const initialValues = {
    email: '',
    password: '',
  };
  
  
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        const data = await response.json();
        const { token, refreshToken, nombre, apellido } = data;

        // Almacenar el token en Local Storage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken); 
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('apellido', apellido);

        window.location.href = '/home';
      } else if (response.status === 401) {
        setFieldError('password', 'Contraseña incorrecta');
      } else {
        console.error('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }

    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-red-800 to-red-500">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <img src={logo} alt="loginImagen" className="mx-auto h-12 w-auto"/>
            <h1 className="text-2xl font-semibold text-center mb-4">Inicio de Sesión</h1>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <Field type="text" name="email" className="w-full p-2 border rounded" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700">Contraseña</label>
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-2 border rounded"
                placeholder="Contraseña"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-700 text-lg md:text-xl" 
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Iniciar Sesión
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;