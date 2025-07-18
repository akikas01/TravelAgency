import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true);
            const user = await login(username, password);
            setLoading(false);
            if (user.role === 'Admin') navigate('/admin');
            else navigate('/user');
        } catch (ex) {
            alert(ex.message);
            setLoading(false)
        }
    };

    return (
        <div style={{ 'textAlign': 'center' }}>
            <h1 style={{ 'textAlign': 'center' }}>Travelling to Europe!!! </h1>
            <img src="https://www.parkonking.com.au/wp-content/uploads/2023/08/travelling-around-Europe-from-Australia.jpg" alt="TravellingInEurope" />
            <h2 style={{ 'textAlign': 'center' }}>Login</h2>
            <input style={{ 'textAlign': 'center' }} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input style={{ 'textAlign': 'center' }} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button style={{
                'textAlign': 'center', backgroundColor: '#1890FF',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '999px',
                fontSize: '16px',
                cursor: 'pointer', marginLeft: '20px',
            }} onClick={handleLogin}>
                {
                    loading ? (
                        <img
                            src="https://i.gifer.com/ZZ5H.gif"
                            alt="loading"
                            style={{
                                width: '20px', height: '20px',
                                backgroundColor: '#1890FF',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '999px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                marginLeft: '20px', 
                            }}
                        />
                    ) : (
                        'Login'
                    )}</button>
            <p style={{ 'textAlign': 'center' }}>Don't have an account? <Link style={{ 'textAlign': 'center' }} to="/register">Register</Link></p>
        </div>
    );
}