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

    useEffect(() => { if (section === "bookings" || section === "travelPackages") { getTravelPackages(); } }, [section])

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

    useEffect(() => { if (selectedTravelPackage !== "" && section === "bookings") { getUsers(selectedTravelPackage); } }, [section, selectedTravelPackage]);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        tags: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [countries, setCountries] = useState([]);
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
        if (section === "createTravelPackages" || section === "travelPackages") {
            selectCountries();
        }
    }, [section])
    const availableTags = countries;


    const handleCheckboxChange = (tag) => {
        setFormData(prev => {
            const alreadySelected = prev.tags.includes(tag);
            const newTags = alreadySelected
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag];
            return { ...prev, tags: newTags };
        });
    };
    const [created, setCreated] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("https://localhost:7175/api/TravelPackage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ title: formData.title, price: formData.price, description: formData.description })
            });

            if (res.ok) {
                setCreated(true);

            }
            alert(await res.text());






        } catch (error) {
            console.error("Error fetching Travel Package:", error);
        }


    };

    const handleDestinations = async () => {

        var destinations = [];
        formData.tags.map((country) => { destinations.push({ TravelPackage: formData.title, Country: country }); });

        try {
            const res = await fetch("https://localhost:7175/api/Destinations", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(destinations)
            });

            setCreated(false);






        } catch (error) {
            console.error("Error fetching Destinations:", error);
        }


    };
    useEffect(() => {
        if (created) {
            handleDestinations();

        }
    }, [created]);

   
    useEffect(() => {
        const fetchPackageAndCountries = async () => {
            if (section === "travelPackages" && selectedTravelPackage !== "") {
                try {
                    const res = await fetch(`https://localhost:7175/api/TravelPackage/${selectedTravelPackage}`);
                    const data = await res.json();

                    
                    const countriesRes = await fetch(`https://localhost:7175/api/Destinations/TravelPackage/${selectedTravelPackage}`);
                    const countriesData = await countriesRes.json();

                    setFormData({
                        title: data.title,
                        price: data.price,
                        description: data.description,
                        tags: Array.isArray(countriesData) ? countriesData : [countriesData],
                    });
                } catch (err) {
                    console.error("Error in chained fetch:", err);
                }
            }
        };

        fetchPackageAndCountries();
    }, [selectedTravelPackage, section]);

    useEffect(() => {
        if (section === "createTravelPackages") {
            setSelectedTravelPackage("");
        }
    }, [section]);

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`https://localhost:7175/api/TravelPackage/${selectedTravelPackage}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ title: formData.title, price: formData.price, description: formData.description })
            });

            
            alert(await res.text());
            handleDestinations();





        } catch (error) {
            console.error("Error updating Travel Package:", error);
        }


    };



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
                {section === "countries" && <p>Please choose an option above.</p>}
                {section === "travelPackages" && (<div><select
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


                </select>{selectedTravelPackage && < form onSubmit={handleSubmitEdit}>
                   

                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        minHeight: '50vh'
                    }} >
                        <label>Countries:</label>
                        <div
                            onClick={() => setDropdownOpen(prev => !prev)}
                            style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                cursor: 'pointer',
                                width: '200px',
                                textAlign: 'center',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            {formData.tags.length > 0
                                ? formData.tags.join(', ')
                                : 'Select countries'}
                        </div>

                        {dropdownOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    marginTop: '10px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    width: '200px',
                                    zIndex: 1
                                }}
                            >
                                {availableTags.map(tag => (
                                    <div key={tag}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.tags.includes(tag)}
                                                onChange={() => handleCheckboxChange(tag)}
                                            />
                                            {tag}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit">Submit</button>
                </form>}</div>)}
                {section === "createTravelPackages" && (<div><h2>Create a Travel Package</h2><form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        minHeight: '50vh'
                    }} >
                        <label>Countries:</label>
                        <div
                            onClick={() => setDropdownOpen(prev => !prev)}
                            style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                cursor: 'pointer',
                                width: '200px',
                                textAlign: 'center',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            {formData.tags.length > 0
                                ? formData.tags.join(', ')
                                : 'Select countries'}
                        </div>

                        {dropdownOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    marginTop: '10px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    width: '200px',
                                    zIndex: 1
                                }}
                            >
                                {availableTags.map(tag => (
                                    <div key={tag}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.tags.includes(tag)}
                                                onChange={() => handleCheckboxChange(tag)}
                                            />
                                            {tag}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit">Submit</button>
                </form></div>)}<div />
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
            </div></div ></div >;
}