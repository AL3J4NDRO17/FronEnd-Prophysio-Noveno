import axios from 'axios';

export const activateAccountService = async (token) => {
    const response = await axiosInstance.post('/auth/requestactivate', { token });
    return response.data;
  };

export const resendActivationEmailService = async (email) => {
    const response = await axiosInstance.post('/auth/resend-activation-email', { email });
    return response.data;
  };
  