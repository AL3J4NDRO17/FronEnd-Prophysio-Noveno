import { useState, useEffect } from 'react';
import { verifyAccountService } from '../services/accountActivation';

const useAccountVerification = () => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const verifyAccount = async (token) => {
    try {
      setStatus('loading');
      const response = await verifyAccountService(token);
      setStatus('success');
      setMessage(response.message || 'Cuenta activada con éxito.');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Ocurrió un error al activar tu cuenta.');
    }
  };

  return { status, message, verifyAccount };
};

export default useAccountVerification;
