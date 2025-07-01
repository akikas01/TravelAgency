import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminPage() {
    const { user, logout } = useContext(AuthContext);
    
    const handlelogout = () => {

        logout();
        
    }

    if (!user || user.role !== 'Admin') return <Navigate to="/" />;

    return <div><h1>Welcome, Admin {user.username}</h1>
        <button onClick={handlelogout}>Logout</button></div>;
}