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
        if (section === "createTravelPackages" || section === "travelPackages" || section === "countries") {
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
    const deleteTravelPackage = async (travelPackage) => {
        try {
            const res = await fetch(`https://localhost:7175/api/TravelPackage/${travelPackage}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            alert(await res.text());
            setSelectedTravelPackage("");
            setSection("home");
        } catch (error) {
            console.error("Error deleting Travel Package:", error);
        }
    };
    const [selectedOption, setSelectedOption] = useState("");
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
    if (!user || user.role !== 'Admin') return <Navigate to="/" />;

    return <div><h1 style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>Welcome, Admin {user.username}</h1>
        <button onClick={handlelogout} style={{
            backgroundColor: '#1890FF', 
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '999px',
            fontSize: '16px',
            cursor: 'pointer',
        }}>Logout</button>
        <div style={{ textAlign: "center" }} ><img style={{ width: '30%', height:'200px' }} src="https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg" srcset="https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=360 360w, https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=740 740w, https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=826 826w, https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=900 900w, https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=996 996w, https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=1060 1060w, https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=1380 1380w, https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=1480 1480w, https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=1800 1800w, https://img.freepik.com/free-photo/top-view-travel-elements-collection_23-2148691133.jpg?t=st=1752650959~exp=1752654559~hmac=a1c344e8aa7f635f0d8cd59ae9f9fb6826c8b3396bc851f613013b874e1c7d5c&amp;w=2000 2000w" width="626" height="417" alt="top view travel elements collection" fetchpriority="high" sizes="(max-width: 480px) 100vw, (min-aspect-ratio: 626/417) 100%, (max-width: 1096px) calc(100vw - 40px), calc(100vw - 540px)" class="size-full object-contain" /></div>
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1 style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>Options</h1>
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => setSection("travelPackages")} style={section === "travelPackages" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>View, Edit and Delete Travel Packages with Details</button>
                <button onClick={() => setSection("countries")} style={section === "countries" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>View Countries and associated Travel Packages</button>
                <button onClick={() => setSection("createTravelPackages")} style={section === "createTravelPackages" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>Create a package</button>
                <button onClick={() => setSection("bookings")} style={section === "bookings" ? { backgroundColor: 'lightblue', color: 'black', border: 'none' } : { border: 'none', backgroundColor: 'white' }}>View users who booked a specific package</button>
            </div><div style={{ marginTop: "40px" }}>
                {section === "home" && <p>Please choose an option above.</p>}
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
                </select>{selectedTravelPackage && <div>< form onSubmit={handleSubmitEdit}>


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
                        <button type="submit" style={{
                            backgroundColor: 'yellow',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            border: 'none',
                            cursor: 'pointer',
                        }}>Submit</button>
                    </form> <button onClick={() => deleteTravelPackage(selectedTravelPackage)} style={{
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                    }}>Delete</button></div>}</div>)}
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
                    <button type="submit" style={{
                        backgroundColor: 'yellow',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        border: 'none',
                        cursor: 'pointer',
                    }}>Submit</button>
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