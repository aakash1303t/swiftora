// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
// import debounce from "lodash.debounce";

// const API_KEY = "AIzaSyAEpXrSYZihkYrLc45u6ZmYcpK5npiX5qQ"; // Directly assign the API key
// const MAP_LIBRARIES = ["places"];

// // Helper function to fetch with retry capability
// const SupplierProfile = () => {
//   const [userData, setUserData] = useState({
//     userId: "",
//     supplierId: "",
//     username: "",
//     email: "",
//     role: "",
//     name: "",
//     contact: "",
//     location: { lat: null, lng: null },
//     address: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [apiErrors, setApiErrors] = useState([]);

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   useEffect(() => {
//     if (!userData.location.lat || !userData.location.lng) {
//       getCurrentLocation();
//     }
//   }, [userData.location]);

//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by this browser.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;
//         console.log("Got current position:", { lat, lng });

//         try {
//           const response = await axios.get(
//             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
//           );

//           const formattedAddress =
//             response.data.results[0]?.formatted_address || "Unknown location";

//           setUserData((prev) => ({
//             ...prev,
//             location: { lat, lng },
//             address: formattedAddress,
//           }));
//         } catch (error) {
//           console.error("Error fetching location address:", error);
//           setUserData((prev) => ({
//             ...prev,
//             location: { lat, lng },
//             address: "Location detected but address unavailable",
//           }));
//         }
//       },
//       (err) => {
//         console.error("Error fetching location:", err);
//         setError("Unable to fetch location. Please enable location services.");
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!isTokenValid(token)) throw new Error("Invalid token");

//       if (!userData.supplierId) {
//         setError("Supplier ID not found.");
//         setLoading(false);
//         return;
//       }

//       if (!userData.location.lat || !userData.location.lng) {
//         setError("Location not available.");
//         setLoading(false);
//         return;
//       }

//       await axios.put(
//         `https://swiftora.vercel.app/api/suppliers/${userData.supplierId}`,
//         { name: userData.name, contact: userData.contact },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await axios.put(
//         "https://swiftora.vercel.app/api/users/update-location",
//         {
//           userId: userData.userId,
//           location: {
//             lat: userData.location.lat,
//             lng: userData.location.lng,
//             address: userData.address,
//           },
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await fetchUserProfile();
//       setMessage("Profile updated successfully!");
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to update profile.");
//       setLoading(false);
//     }
//   };
//   // Function to display API errors for debugging
//   const renderApiErrors = () => {
//     if (apiErrors.length === 0) return null;

//     return (
//       <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
//         <h3 className="text-sm font-semibold text-yellow-800">Debug Information</h3>
//         <div className="text-xs text-yellow-700 mt-2">
//           {apiErrors.map((apiError, index) => (
//             <div key={index} className="mb-2 pb-2 border-b border-yellow-100">
//               <p>
//                 <strong>Endpoint:</strong> {apiError.endpoint}
//               </p>
//               <p>
//                 <strong>Error:</strong> {apiError.error}
//               </p>
//               {apiError.details && (
//                 <p>
//                   <strong>Details:</strong> {JSON.stringify(apiError.details)}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6">
//       <h2 className="text-xl font-semibold text-[#5b2333]">Supplier Profile</h2>

//       {loading ? (
//         <div className="text-gray-600 py-4">
//           <p>Loading profile...</p>
//           <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//             <div className="h-full bg-[#5b2333] animate-pulse" style={{ width: "100%" }}></div>
//           </div>
//         </div>
//       ) : error ? (
//         <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
//           <p className="font-medium">{error}</p>
//           <p className="text-sm mt-2">
//             Please try refreshing the page or contact support if the issue persists.
//           </p>
//           <button
//             onClick={fetchUserProfile}
//             className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
//           >
//             Retry
//           </button>
//           {renderApiErrors()}
//         </div>
//       ) : (
//         <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
//           {message && (
//             <div className="p-3 bg-green-100 text-green-700 rounded-md border border-green-200">
//               {message}
//             </div>
//           )}

//           {/* Read-only fields from user table */}
//           <div className="bg-gray-50 p-3 rounded-md">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">User Information</h3>
//             {["username", "email", "role"].map((field) => (
//               <div key={field} className="mb-2 last:mb-0">
//                 <label className="block text-sm font-medium text-gray-700 capitalize">
//                   {field}
//                 </label>
//                 <input
//                   type="text"
//                   name={field}
//                   value={userData[field]}
//                   readOnly
//                   className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Editable fields from supplier table */}
//           <div className="bg-gray-50 p-3 rounded-md">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Supplier Information</h3>
//             <div className="text-xs text-gray-500 mb-3">
//               Supplier ID: {userData.supplierId || "Not found"}
//             </div>
//             {["name", "contact"].map((field) => (
//               <div key={field} className="mb-2 last:mb-0">
//                 <label className="block text-sm font-medium text-gray-700 capitalize">
//                   {field}
//                 </label>
//                 <input
//                   type="text"
//                   name={field}
//                   value={userData[field]}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded-md focus:ring-[#5b2333] focus:border-[#5b2333]"
//                   required
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Location field */}
//           <div className="bg-gray-50 p-3 rounded-md">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Location Information</h3>
//             <div className="mb-2">
//               <label className="block text-sm font-medium text-gray-700">Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={userData.address}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md focus:ring-[#5b2333] focus:border-[#5b2333]"
//                 placeholder="Enter your location"
//               />
//             </div>

//             <div className="text-xs text-gray-500 mb-2">
//               Coordinates: {userData.location.lat.toFixed(6)}, {userData.location.lng.toFixed(6)}
//             </div>

//             {/* Google Map */}
//             {isLoaded ? (
//               <div className="border rounded-md overflow-hidden mt-2">
//                 <GoogleMap
//                   mapContainerStyle={{ width: "100%", height: "300px" }}
//                   center={
//                     userData.location.lat ? userData.location : { lat: 28.6139, lng: 77.209 }
//                   }
//                   zoom={12}
//                   onClick={handleMapClick}
//                 >
//                   <MarkerF position={userData.location} />
//                 </GoogleMap>
//               </div>
//             ) : (
//               <div className="h-[300px] bg-gray-100 flex items-center justify-center rounded-md">
//                 <p className="text-gray-500">Loading map...</p>
//               </div>
//             )}

//             <p className="text-xs text-gray-500 mt-2">
//               Click on the map to set your location or type an address above.
//             </p>
//           </div>

//           {/* Form submission button */}
//           <button
//             type="submit"
//             className="w-full p-2 bg-[#5b2333] text-white rounded-md hover:bg-[#4a1c29] disabled:bg-gray-400 disabled:cursor-not-allowed"
//             disabled={!userData.supplierId || loading}
//           >
//             {loading ? "Saving..." : "Save Profile"}
//           </button>

//           {!userData.supplierId && (
//             <div className="p-3 bg-yellow-100 text-yellow-700 rounded-md border border-yellow-200">
//               <p className="font-medium">Supplier profile not found.</p>
//               <p className="text-sm mt-1">Please contact support to set up your supplier account.</p>
//             </div>
//           )}

//           {/* Debugging information */}
//           {apiErrors.length > 0 && renderApiErrors()}
//         </form>
//       )}
//     </div>
//   );
// };

// export default SupplierProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
const MAP_LIBRARIES = ["places"];

const SupplierProfile = () => {
  const [userData, setUserData] = useState({
    userId: "",
    supplierId: "",
    username: "",
    email: "",
    role: "",
    name: "",
    contact: "",
    location: { lat: 0, lng: 0 },
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: MAP_LIBRARIES,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userData.location.lat || !userData.location.lng) {
      getCurrentLocation();
    }
  }, [userData.location]);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get("https://swiftora.vercel.app/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
    } catch (err) {
      setError("Failed to fetch user profile.");
    } finally {
      setLoading(false);
    }
  };

  // Get current location using Geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("Got current position:", { lat, lng });

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
          );

          const formattedAddress = response.data.results[0]?.formatted_address || "Unknown location";

          setUserData((prev) => ({
            ...prev,
            location: { lat, lng },
            address: formattedAddress,
          }));
        } catch (error) {
          console.error("Error fetching location address:", error);
          setUserData((prev) => ({
            ...prev,
            location: { lat, lng },
            address: "Location detected but address unavailable",
          }));
        }
      },
      (err) => {
        console.error("Error fetching location:", err);
        setError("Unable to fetch location. Please enable location services.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Update supplier profile including location
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

      if (!userData.location.lat || !userData.location.lng) {
        setError("Location not available.");
        setLoading(false);
        return;
      }

      // Update supplier details including location
      await axios.put(
        `https://swiftora.vercel.app/api/suppliers/${userData.supplierId}`,
        {
          name: userData.name,
          contact: userData.contact,
          location: {
            lat: userData.location.lat,
            lng: userData.location.lng,
            address: userData.address,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchUserProfile();
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div>
      <h2>Supplier Profile</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {loading && <p>Loading...</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </label>

        <label>
          Contact:
          <input
            type="text"
            value={userData.contact}
            onChange={(e) => setUserData({ ...userData, contact: e.target.value })}
          />
        </label>

        <label>
          Address:
          <input type="text" value={userData.address} readOnly />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* Google Map with marker */}
      <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
        <GoogleMap
          center={{
            lat: userData.location?.lat || 0,
            lng: userData.location?.lng || 0,
          }}
          zoom={12}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          {userData.location?.lat && userData.location?.lng && (
            <MarkerF position={{ lat: userData.location.lat, lng: userData.location.lng }} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default SupplierProfile;
