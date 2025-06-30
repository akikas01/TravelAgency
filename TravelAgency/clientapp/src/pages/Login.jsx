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
        <div>
            <h2>Login</h2>
            <input onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}