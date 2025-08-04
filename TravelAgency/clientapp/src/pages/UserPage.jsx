import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useState, useEffect } from 'react';
export default function AdminPage() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handlelogout = () => {

        logout();
        navigate('/');
    }
    const [section, setSection] = useState("home");
    const [selectedOption, setSelectedOption] = useState("");
    const [countries, setCountries] = useState([]);
    const [travelPackages, setTravelPackages] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedTravelPackage, setSelectedTravelPackage] = useState("");
    const [travelPackagesView, setTravelPackagesView] = useState([]);
    const [currentTravelPackage, setCurrentTravelPackage] = useState(null);
    const selectCountries = async () => {
        try {
            const res = await fetch('https://localhost:7175/api/Countries', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            setCountries(data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };
    useEffect(() => {
        selectCountries();
    }, []);
    const travelPackagesCall = async () => {
        if (!selectedOption) return;
        try {
            const res = await fetch(`https://localhost:7175/api/Destinations/Country/${selectedOption}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) {
                alert(await res.text());
                setTravelPackages([]);
            }
            const data = await res.json();
            setTravelPackages(data);
        } catch (error) {
            console.error("Error fetching Travel Packages:", error);
        }
    };
    useEffect(() => {
        if (selectedOption) {
            travelPackagesCall();
        }
    }, [selectedOption]);
    const viewBookings = async () => {
        try {
            const res = await fetch(`https://localhost:7175/api/Booking/TravelPackages/${user.username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!res.ok) {
                alert(await res.text());
                setBookings([]);

            }
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching Bookings:", error);
        }
    }
    useEffect(() => { if (section === "bookings") viewBookings(); return; }, [section]);
    useEffect(() => {
        if (section === "travelPackages") {
            getTravelPackages();
        }
    }, [section]);
    const getTravelPackages = async () => {

        try {
            const res = await fetch("https://localhost:7175/api/TravelPackage/titles", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            setTravelPackagesView(data);
        } catch (error) {
            console.error("Error fetching Travel Packages View:", error);
        }
    }
    const getTravelPackage = async () => {
        try {
            const res = await fetch(`https://localhost:7175/api/TravelPackage/${selectedTravelPackage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'

                }
            });
            const data = await res.json();
            setCurrentTravelPackage(data);
        } catch (error) {
            console.error("Error fetching Current Travel Package:", error);
        }
    }
    useEffect(() => {
        if (selectedTravelPackage !== "") {
            getTravelPackage();
        }
    }, [selectedTravelPackage]);

    if (!user) {
        return <Navigate to="/" />;
    }
    const book = async (currentbooking) => {
        try {
            const res = await fetch("https://localhost:7175/api/Booking", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(currentbooking)
            });
            alert(await res.text());
        } catch (error) {
            console.error("Error fetching Booking:", error);
        }
    }
    return <div><h1 style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>Welcome, User {user.username}</h1>
        <button onClick={handlelogout} style={{
            backgroundColor: '#1890FF',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '999px',
            fontSize: '16px',
            cursor: 'pointer',
        }}>Logout</button>
        <div style={{ textAlign: "center" }} ><img style={{ width: '30%', height: '200px' }} src="https://images.pexels.com/photos/185933/pexels-photo-185933.jpeg" alt="Travelling"/></div>
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1 style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>Options</h1>
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => setSection("travelPackages")} style={section === "travelPackages" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>View and Book Travel Packages</button>
                <button onClick={() => setSection("countries")} style={section === "countries" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>View Countries and associated Travel Packages</button>
                <button onClick={() => setSection("bookings")} style={section === "bookings" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>View Bookings</button>
            </div>
            <div style={{ marginTop: "40px" }}>
                {section === "home" && <p>Please choose an option above.</p>}
                {section === "travelPackages" && (<div><h2>Travel Packages</h2>
                    <select
                        value={selectedTravelPackage}
                        onChange={(e) => setSelectedTravelPackage(e.target.value)}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            position: "relative",
                            zIndex: 1
                        }}
                    ><option value="">-- Select --</option>
                        {
                            travelPackagesView.map((travelPackage) => (<option value={travelPackage}>{travelPackage}</option>))
                        }
                    </select>{selectedTravelPackage !== "" && currentTravelPackage && <form><label style={{ fontWeight: 'bold' }}> Price in euros:</label><div>{currentTravelPackage.price}</div> <label style={{ fontWeight: 'bold' }}> Description:</label><div>{currentTravelPackage.description}<div><button onClick={() => book({ user: user.username, travelPackage: currentTravelPackage.title })} style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '10px 20px',
                        cursor: 'pointer'
                    }}>Book</button></div>
                    </div></form>}</div>)}
                {section === "countries" && (<div><h2>View Countries and associated Travel Packages</h2>
                    <div style={{ textAlign: "center", marginTop: "50px", overflow: "visible" }}>
                        <h2>Select an Option:</h2>
                        <select
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            style={{
                                padding: "10px",
                                fontSize: "16px",
                                position: "relative",
                                zIndex: 1
                            }}
                        >
                            <option value="">-- Select --</option>
                            {

                                countries.map((country) => (<option value={country}>{country}</option>))
                            }
                        </select>
                        {
                            selectedOption && (<div>

                                {travelPackages.map((tp) => { return (<p style={{ marginTop: "20px" }}><strong>{tp}</strong> </p>) })}</div>
                            )}
                    </div></div>)}
                {section === "bookings" && (<div><h2>Bookings</h2><ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>{bookings.map((booking) => { return (<li>{booking}</li>) })}</ul></div>)}
            </div>
        </div></div>;
}