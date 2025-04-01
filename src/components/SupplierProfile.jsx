import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_LIBRARIES = ["places"];
const mapContainerStyle = { width: "100%", height: "300px" };

const SupplierProfile = () => {
  const [userData, setUserData] = useState({
    userId: "",
    supplierId: "",
    username: "",
    email: "",
    role: "",
    name: "",
    contact: "",
    location: null,
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries: MAP_LIBRARIES,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Invalid token");

      const response = await axios.get(`http://localhost:5000/api/suppliers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setUserData({
          ...response.data,
          location: response.data.location || null,
        });
        setEditedLocation(response.data.location || null);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile.");
      setLoading(false);
    }
  };

  const handleMapClick = (e) => {
    if (isEditing) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setEditedLocation({ lat, lng });
    }
  };

  const handleAccurateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setEditedLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to fetch location.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Invalid token");

      if (!userData.supplierId) {
        setError("Supplier ID not found.");
        setLoading(false);
        return;
      }

      if (!editedLocation) {
        setError("Location not set. Please select a location.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/suppliers/${userData.supplierId}`,
        {
          name: userData.name,
          contact: userData.contact,
          location: editedLocation,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Update response:", response.data);
      setMessage("Profile updated successfully!");
      setUserData((prev) => ({ ...prev, location: editedLocation }));
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-[#5b2333]">Supplier Profile</h2>

      {loading ? (
        <p className="text-gray-600">Loading profile...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="mt-4 space-y-4">
          {message && <div className="p-2 bg-green-100 text-green-700 rounded">{message}</div>}

          {/* Read-Only Profile View */}
          {!isEditing ? (
            <>
              {["username", "email", "name", "contact"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  <p className="text-gray-900">{userData[field] || "N/A"}</p>
                </div>
              ))}

              {userData.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <GoogleMap mapContainerStyle={mapContainerStyle} center={userData.location} zoom={15}>
                    <MarkerF position={userData.location} />
                  </GoogleMap>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "contact"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={userData[field]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-[#5b2333] focus:border-[#5b2333]"
                    required
                  />
                </div>
              ))}

              {/* Location Editing */}
              {isLoaded && (
                <>
                  <button
                    type="button"
                    onClick={handleAccurateLocation}
                    className="mb-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Get Current Location
                  </button>

                  {editedLocation && (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={editedLocation}
                      zoom={15}
                      onClick={handleMapClick}
                    >
                      <MarkerF position={editedLocation} />
                    </GoogleMap>
                  )}
                </>
              )}

              <button type="submit" className="w-full p-2 bg-[#5b2333] text-white rounded-md hover:bg-[#4a1c29]">
                Update Profile
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SupplierProfile;
