import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const user = await login(username, password);
            if (user.role === 'Admin') navigate('/admin');
            else navigate('/user');
        } catch(ex) {
            alert(ex.message);
        }
    };

    return (
        <div style={{ 'textAlign': 'center' }}>
            <h1 style={{ 'textAlign': 'center' }}>Travelling to Europe!!! </h1>
            <img src="https://www.parkonking.com.au/wp-content/uploads/2023/08/travelling-around-Europe-from-Australia.jpg" alt="TravellingInEurope" />
            <h2 style={{ 'textAlign': 'center' }}>Login</h2>
            <input style={{ 'textAlign': 'center' }} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input style={{ 'textAlign': 'center' }} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button style={{ 'textAlign': 'center' }} onClick={handleLogin}>Login</button>
            <p style={{ 'textAlign': 'center' }}>Don't have an account? <Link style={{ 'textAlign': 'center' }} to="/register">Register</Link></p>
        </div>
    );
}