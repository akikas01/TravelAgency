import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export default function AdminPage() {
    const { user, logout } = useContext(AuthContext);
    const [travelPackages, setTravelPackages] = useState([]);


    const handlelogout = () => {

        logout();

    }
    const [section, setSection] = useState("home");
    const [selectedTravelPackage, setSelectedTravelPackage] = useState("");
    const [users, setUsers] = useState([]);
    const getTravelPackages = async () => {

        try {
            const res = await fetch("https://localhost:7175/api/TravelPackage/titles", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await res.json();
            setTravelPackages(data);




        } catch (error) {
            console.error("Error fetching Travel Packages View:", error);
        }
    }

    useEffect(() => { if (section === "bookings") { getTravelPackages(); } }, [section])

    const getUsers = async (selectedTravelPackage) => {

        try {
            const res = await fetch(`https://localhost:7175/api/Booking/Users/${selectedTravelPackage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!res.ok) {
                alert(await res.text());
                setUsers([]);
                return;
            }

            const data = await res.json();
            setUsers(data);




        } catch (error) {
            console.error("Error fetching Booking:", error);
        }
    }

    useEffect(() => { if (selectedTravelPackage !== "") { getUsers(selectedTravelPackage); } }, [selectedTravelPackage]);

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
                {section === "createTravelPackages" && <p>Please choose an option above.</p>}<div />
                {section === "bookings" && (<div><select
                    value={selectedTravelPackage}
                    onChange={(e) => setSelectedTravelPackage(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        position: "relative",
                        zIndex: 1
                    }}
                ><option value="">-- Select Travel Package --</option>
                    {

                        travelPackages.map((travelPackage) => (<option value={travelPackage}>{travelPackage}</option>))



                    }


                </select><div><h2>Users who booked the specific package</h2><ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>{users.map((user) => { return (<li>{user}</li>) })}</ul></div></div>)}
            </div></div></div>;
}