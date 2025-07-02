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
            }

            const data = await res.text();
            const array = data.split(',');
            
            setTravelPackages(array);
            
        } catch (error) {
            console.error("Error fetching Travel Packages:", error);
        }
    };

    

    useEffect(() => {
        if (selectedOption) {
            travelPackagesCall();
        }
    }, [selectedOption]);




    if (!user) {
        return <Navigate to="/" />;
    }

    return <div><h1>Welcome, User {user.username}</h1>
        <button onClick={handlelogout}>Logout</button>
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Options</h1>
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => setSection("travelPackages")}>View and Book Travel Packages</button>
                <button onClick={() => setSection("countries")}>View Countries and associated Travel Packages</button>
                <button onClick={() => setSection("bookings")}>Viewing Bookings</button>
            </div>

            <div style={{ marginTop: "40px" }}>
                {section === "home" && <p>Please choose an option above.</p>}
                {section === "travelPackages" && <h2>View and Book Travel Packages</h2>}
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
                            
                                { travelPackages.map((tp) => { return(<p style={{ marginTop: "20px" }}><strong>{tp}</strong> </p>) })}</div>
                                
                           
                        )}
                    </div></div>)}
                {section === "bookings" && <h2>Viewing Bookings</h2>}
            </div>
        </div></div>;

}