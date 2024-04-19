'use client'
import { Login } from '@/services/Login';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '../Alert/Alert';

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<boolean>(false);
    const [alertRender, setAlertRender] = useState<boolean>(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = await Login(email, password);
            localStorage.setItem('token', token);
            setError(false)
            setTimeout(() => {
                router.push('/user/list');
            }, 1000);
        } catch (error) {
            setError(true)
            console.error('Erro ao fazer login:', error);
        } finally {
            setAlertRender(true); // Este bloco finally será executado, independentemente de a requisição ter sucesso ou falhar
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/user/list');
        }
    }, []);

    return (
        <div className="max-w-md w-100 mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            {alertRender && (
                error == false ? (
                    <div className='mb-4'>
                        <Alert type="success" message="Login successfully" />
                    </div>
                ) : (
                    <div className='mb-4'>
                        <Alert type="error" message="Username or password is invalid" />
                    </div>
                )
            )}

            <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" className={`
                    ${error && 'border border-red'}
          mt-1 block h-10 px-2 w-full rounded-md border-gray-300 shadow-sm 
          focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50
          `} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" className={`
                    ${error && 'border border-red'}
          mt-1 block h-10 px-2 w-full rounded-md border-gray-300 shadow-sm 
          focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50  
          `} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
