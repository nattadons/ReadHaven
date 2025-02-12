import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import PropTypes from "prop-types";

const LocationMarker = ({ onLocationUpdate, initialLocation }) => {
    const [position, setPosition] = useState(null);
    const [, setLocationFetched] = useState(false);
    const map = useMap();

    useEffect(() => {
        if (initialLocation?.latitude && initialLocation?.longitude) {
            setPosition([initialLocation.latitude, initialLocation.longitude]);
            map.flyTo([initialLocation.latitude, initialLocation.longitude], 15);
            setLocationFetched(true);
        }
    }, [initialLocation, map]);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
                map.flyTo([latitude, longitude], 15);
                setLocationFetched(true);

                // Reverse geocoding to get address
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    const address = data.display_name;
                    
                    // Update parent component
                    if (onLocationUpdate) {
                        onLocationUpdate(latitude, longitude, address);
                    }
                } catch (error) {
                    console.error("Error getting address:", error);
                }
            },
            () => {
                alert("Unable to retrieve your location");
            }
        );
    };

    return (
        <>
            <button
                onClick={handleGetLocation}
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 1000,
                    background: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                }}
            >
                Get My Location
            </button>
            {position && (
                <Marker position={position}>
                    <Popup>Your location!</Popup>
                </Marker>
            )}
        </>
    );
};

const LeafMapApi = ({ onLocationUpdate, initialLocation }) => {
    return (
        <MapContainer
            center={[13.7563, 100.5018]} // Bangkok coordinates as default
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onLocationUpdate={onLocationUpdate} initialLocation={initialLocation} />
        </MapContainer>
    );
};
LocationMarker.propTypes = {
    onLocationUpdate: PropTypes.func,
    initialLocation: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
    }),
};

LeafMapApi.propTypes = {
    onLocationUpdate: PropTypes.func,
    initialLocation: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
    }),
};


export default LeafMapApi;