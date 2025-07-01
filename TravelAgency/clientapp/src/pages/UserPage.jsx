import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminPage() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handlelogout =  () => {
        
            logout();
            navigate('/');
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return <div><h1>Welcome, User {user.username}</h1>
            <button onClick={handlelogout}>Logout</button></div>;
    }