import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface SignupForm {
    username: string;
    email:string;
    password: string;
}

const SignupPage:React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                navigate('/dashboard');
            }
        }, [navigate]);
    const [error, setError] = useState<string | null>(null);
    const [formData,setFormData]=useState<SignupForm>({username:'',password:'',email:''});
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value});
    }
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try{
            const response = await axios.post('http://localhost:5000/signup',formData);
            if(response.status===201){
                localStorage.setItem('token', response.data.token);
                // Save user data if needed
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log("SignUp successful from frontend",response.data);
                navigate('/dashboard');
            }
            setError(null);
        }
        catch(err){
            console.log('Error ',err);
            setError('Failed to log in. Please check your credentials.');
        }
    }

  return (
    <>
    <div>Signup</div>
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="Name">Enter your name:</label>
            <Input className='rounded border-2 bg-transparent' type="text"
                    name='username'
                    onChange={handleChange}
                    placeholder='Enter your Name'
                    value={formData.username}
            />
        </div>
        <div>
            <label htmlFor="email">Enter your Email:</label>
            <Input className='rounded border-2 bg-transparent' type="email"
                    name='email'
                    onChange={handleChange}
                    placeholder='Enter your Email'
                    value={formData.email}
            />
        </div>
        <div>
            <label htmlFor="Password">Create your password:</label>
            <Input type="password"
                    name='password'
                    onChange={handleChange}
                    placeholder='Enter your password'
                    value={formData.password}
            />
        </div>
        <Button type='submit'>Submit</Button>
    </form>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  )
}

export default SignupPage