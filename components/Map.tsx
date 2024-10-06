import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import moment from "moment";
import "leaflet/dist/leaflet.css";
import { Location } from "./interfaces/location.interface";


interface MapProps {
    userLocations: Location | Location[];
    center?: [number, number];
    zoom?: number;
    style?: React.CSSProperties;
    preferCanvas?: boolean;
}

const Map: React.FC<MapProps> = ({
    userLocations,
    center = [25.276987, 55.296249],
    zoom = 5,
    style = { height: "400px", width: "100%" },
    preferCanvas = true,
}) => {
    const locations = Array.isArray(userLocations) ? userLocations : userLocations ? [userLocations] : [];

    return ( 
        <MapContainer
            center={center}
            zoom={zoom}
            style={style}
            preferCanvas={preferCanvas}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((location, index) => (
                <Marker
                    icon={L.icon({
                        iconUrl:
                            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowUrl:
                            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                        shadowSize: [41, 41],
                        shadowAnchor: [12, 41],
                    })}
                    key={location.id || index}
                    position={[location.latitude || 0, location.longitude || 0]}
                >
                    <Popup>
                        <div>
                            <h2>Location</h2>
                            {location.createdAt && (
                                <p>
                                    Created:{" "}
                                    {moment(location.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                                </p>
                            )}
                            <p>Latitude: {location.latitude}</p>
                            <p>Longitude: {location.longitude}</p>
                            {location.userId && <p>User ID: {location.userId}</p>}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
