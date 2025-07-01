import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return token && user ? JSON.parse(user) : null;
    });

    const login = async (username, password) => {
        const res = await fetch('https://localhost:7175/api/Users/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            const errorMessage = await res.text();
            throw new Error(errorMessage);
            return;
        }
        
            const data = await res.json();
            const userInfo = { username: data.user, role: data.role };
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userInfo));
            setUser(userInfo);
            return userInfo;
        
    };

    const register = async (username, password) => {
        const res = await fetch('https://localhost:7175/api/Users/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.status == 409) {
            const message = await res.text();
            throw new Error(message); 
            return;

        }

        if (res.ok) {

            alert("User registered succesfully")
            
        }
        else{
            const errorMessage = await res.text();
            throw new Error(errorMessage);
        }

        const data = await res.json();
        const userInfo = { username: data.user, role: data.role };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
        return userInfo;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};