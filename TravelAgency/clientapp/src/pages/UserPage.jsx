import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminPage() {
    const { user } = useContext(AuthContext);
    

    return <h1>Welcome, User {user.username}</h1>;
}