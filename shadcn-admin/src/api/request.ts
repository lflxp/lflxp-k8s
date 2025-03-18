import axios from 'axios';
import { handleServerError } from '@/utils/handle-server-error';
import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(config => {
  const token = useAuthStore.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.Cookie = `token=${token}`;
  }
//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoUHJvdmlkZXIiOiIiLCJlbWFpbCI6IiIsImV4cCI6MTc0MjMyNTI5OSwiaXNHbG9iYWwiOiIiLCJvcmlnX2lhdCI6MTc0MjI4OTI5OSwicm9sZSI6IiIsInJvbGVMZXZlbCI6IiIsInJvbGVSZWFsIjoiIiwidGVuYW50IjoiIiwidG9rZW4iOiJ2ZXJpZnlBdXRoIiwidXNlcklkIjoiIiwidXNlcm5hbWUiOiJhZG1pbiJ9.QcSwEJv8VSoQq-8h-cB5LumrXKc2EBGSJPn1YbCLY9g'
//   config.headers.Cookie = `token=${token}`;
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        useAuthStore.getState().auth.reset();
        window.location.href = '/sign-in';
      }

      if (status >= 500) {
        toast({
          variant: 'destructive',
          title: '服务器错误',
          description: '请稍后再试或联系管理员'
        });
      }

      handleServerError(error);
    } else if (error.request) {
      toast({
        variant: 'destructive',
        title: '网络错误',
        description: '无法连接服务器，请检查网络连接'
      });
    }
    return Promise.reject(error);
  }
);

export default request;