import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';
import './Styles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('login/', {username, password});
            setUsername('');
            setPassword('');
            const { token } = response.data;
            window.localStorage.setItem('token', token);
            console.log(token)
            if (token) {
                axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            }
            console.log(response.data.is_staff)
            if(response.data.is_staff) {
                navigate('/admin');
            }
            else{
                navigate('/');
            }
        }
        catch (e) {
            console.error('Error logging in', e);
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                {/* <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button> apply css to these lines*/}
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="form-control">Login</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
