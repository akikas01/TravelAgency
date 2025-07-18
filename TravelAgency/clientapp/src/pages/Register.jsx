import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const user = await register(username, password);
            if (user.role === 'Admin') navigate('/admin');
            else navigate('/user');
        } catch(ex) {
            alert(ex.message);
        }
    };

    return (
        <div>
            <h2 style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>Register</h2>
            <input onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleRegister} style={{
                'textAlign': 'center', backgroundColor: '#1890FF',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '999px',
                fontSize: '16px',
                cursor: 'pointer', marginLeft: '20px',
            }}>Register</button>
        </div>
    );
}
