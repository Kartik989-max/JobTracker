import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LoginForm {
    email: string;
    password: string;
}
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);
    const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            // console.log('Login successful:', response.data);
            if (response.status === 200) {
                 // Save token to localStorage
                 
                 localStorage.setItem('token', response.data.token);
                 // Save user data if needed
                 
                 localStorage.setItem('user', JSON.stringify(response.data.user));
                 console.log(response.data.token);
                 console.log('Login Successful');
                 navigate('/dashboard')
                // Redirect to dashboard
            }
            else if (response.status===400){
                console.log(response.data.message);  
            }

             // Clear any previous errors
        } catch (err) {
            console.error('Error during login:', err);
            setError('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input className='rounded border-2 bg-transparent'
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input className='rounded border-2 bg-transparent'  
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Button   type="submit">Login</Button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;
