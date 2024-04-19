import { verifyToken } from '@/services/Login';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // ou a sua biblioteca de requisição HTTP preferida

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token'); // Ou de onde você armazena o token
      
        if (!token) {
          throw new Error('Token não encontrado');
        }

        // Verificar com o backend se o token é válido
        await verifyToken(token);

      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('token');
        router.push('/'); // Redirecionar para a página de login se o token não for válido ou não existir
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>; // Renderiza as rotas protegidas se o usuário estiver autenticado
};

export default PrivateRoute;
