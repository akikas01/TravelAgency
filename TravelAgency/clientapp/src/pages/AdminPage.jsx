import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminPage() {
    const { user } = useContext(AuthContext);
    if (!user || user.role !== 'Admin') return <Navigate to="/" />;

    return <h1>Welcome, Admin {user.username}</h1>;
}