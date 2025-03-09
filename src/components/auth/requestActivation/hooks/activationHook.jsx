import { useState } from 'react';
import { toast } from 'react-toastify';
import { activateAccountService, resendActivationEmailService } from '../services/activationService';

export function useAccountActivation() {
  const [status, setStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [message, setMessage] = useState('');

  const activateAccount = async (token) => {
    setStatus('pending');
    try {
      await activateAccountService(token); // Llama al servicio del backend
      setStatus('success');
      setMessage('¡Tu cuenta ha sido activada exitosamente!');
      toast.success('Cuenta activada con éxito');
    } catch (error) {
      setStatus('error');
      setMessage('Hubo un problema al activar tu cuenta. Por favor, intenta de nuevo o contacta a soporte.');
      toast.error(error.response?.data?.message || 'Error al activar la cuenta');
    }
  };

  const resendActivationEmail = async (email) => {
    try {
      await resendActivationEmailService(email); // Servicio para reenviar el correo
      toast.success('Correo de activación reenviado exitosamente.');
    } catch (error) {
      toast.error('Error al reenviar el correo de activación. Intenta más tarde.');
    }
  };

  return { status, message, activateAccount, resendActivationEmail };
}
