import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export default function AdminPage() {
    const { user, logout } = useContext(AuthContext);

    const handlelogout = () => {

        logout();

    }
    const [section, setSection] = useState("home");
    if (!user || user.role !== 'Admin') return <Navigate to="/" />;

    return <div><h1>Welcome, Admin {user.username}</h1>
        <button onClick={handlelogout}>Logout</button>
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Options</h1>
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => setSection("travelPackages")} style={section === "travelPackages" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>View, Edit and Delete Travel Packages with Details</button>
                <button onClick={() => setSection("countries")} style={section === "countries" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>View Countries and associated Travel Packages</button>
                <button onClick={() => setSection("createTravelPackages")} style={section === "createTravelPackages" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>Create a package</button>
                <button onClick={() => setSection("bookings")} style={section === "bookings" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>View users who booked a specific package</button>
            </div><div style={{ marginTop: "40px" }}>
                {section === "home" && <p>Please choose an option above.</p>}
                {section === "countries" && <p>Please choose an option above.</p>}<div />
            </div></div></div>;
}