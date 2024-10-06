import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"



L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
})

interface LocationMapProps {
  latitude: number
  longitude: number
}

export default function LocationMap({ latitude, longitude }: LocationMapProps) {
  useEffect(() => {
    // Ensure map resizes correctly
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 100)
  }, [])

  return (
    <div className="h-64 w-full">
      <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}
        zIndexOffset={
             3
        }
        icon={L.icon({
          iconSize: [25, 41],
          iconAnchor: [10, 41],
          popupAnchor: [2, -40],
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        })}
        >
          <Popup>
            Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}