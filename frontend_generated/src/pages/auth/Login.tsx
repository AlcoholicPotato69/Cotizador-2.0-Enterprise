import { BaseInput } from '../../components/base/BaseInput';
import { BaseButton } from '../../components/base/BaseButton';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../core/api';
import { useAuthStore } from '../../core/auth';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAuthStore(state => state.setSession);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // NestJS global interceptor wraps the payload in response.data.data
      const { token, user } = response.data.data || response.data;
      const permissions = user?.permissions || [];
      
      setSession(token, user, permissions);
      
      toast.success('Sesión iniciada correctamente');
      navigate('/app');
    } catch (error: any) {
      // Error is handled globally by api.ts interceptor, but we can stop loading here
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const emailInput = document.getElementById('email') as HTMLInputElement;
    if (!emailInput?.value) {
      toast.error('Por favor ingresa tu correo corporativo para buscar tu cuenta.');
      return;
    }
    toast.success(`Alerta enviada a TI. Un administrador revisará tu solicitud para restablecer la contraseña.`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#8A1538] shadow-lg shadow-[#C8102E]/30 p-2 overflow-hidden">
             <img src="/logo.png" alt="Plaza Mayor" className="w-full h-full object-contain brightness-0 invert" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Enterprise ERP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Oficial de <span className="font-semibold text-[#8A1538]">Plaza Mayor</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <BaseInput 
                id="email" 
                type="email" 
                label="Correo Corporativo" 
                placeholder="usuario@plazamayor.com"
                required
              />
            </div>

            <div>
              <BaseInput 
                id="password" 
                type="password" 
                label="Contraseña"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[#C8102E] focus:ring-[#C8102E]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" onClick={handleForgotPassword} className="font-medium text-[#8A1538] hover:text-[#C8102E] transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <BaseButton type="submit" className="w-full bg-[#C8102E] hover:bg-[#A00D25] text-white border-none" size="lg" isLoading={isLoading}>
                Acceder al Sistema
              </BaseButton>
            </div>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Recinto Seguro</span>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Plaza Mayor. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
