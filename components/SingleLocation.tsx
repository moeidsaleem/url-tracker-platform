import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Clock, Smartphone, Globe, Languages } from "lucide-react"
import { useEffect, useState } from "react"
import LocationMap from "./LocationMap"
import { getLocationInfo } from "@/lib/utils"

interface LocationData {
  lat: number
  lng: number
  timestamp: number
  deviceType: string
  userAgent: string
  userLanguage: string
  userTimezone: string
}

interface LocationInfo {
  address: {
    country: string
    city: string
    suburb: string
  }
  timezone: string
}

export default function LocationCard({ location }: { location: LocationData }) {
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)

  const handleShowOnMap = () => {
    setIsHighlighted(true)
    setIsMapOpen(true)
  }

  const handleCloseMap = () => {
    setIsMapOpen(false)
  }

  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

  useEffect(() => {
    const fetchLocationInfo = async () => {
      const info = await getLocationInfo(location.lat, location.lng);
      setLocationInfo(info);
    };
    fetchLocationInfo();
  }, [location.lat, location.lng]);

  return (
    <Card className="w-full max-w-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Location Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-3 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Coordinates</p>
              <p className="text-muted-foreground">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>

          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground">
                {`${locationInfo?.address?.suburb || ''} ${locationInfo?.address?.city || ''} ${locationInfo?.address?.country || 'Loading...'}`}
              </p>
            </div>
          </div>
      
          <div className="flex items-start gap-2">
            <Smartphone className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Device Type</p>
              <p className="text-muted-foreground">{location.deviceType}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Globe className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium">User Agent</p>
              <p className="text-muted-foreground break-words">
                {location.userAgent.split(' ').slice(0, 3).join(' ')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Languages className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium">User Language</p>
              <p className="text-muted-foreground">{location.userLanguage}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="font-medium">User Timezone</p>
              <p className="text-muted-foreground">{location.userTimezone}</p>
            </div>
          </div>
          <div className="flex items-center justify-start mt-2">
            <Button
              variant={isHighlighted ? "default" : "outline"}
              onClick={handleShowOnMap}
              className={`w-full ${isHighlighted ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Show on Map
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="p-0">
          <DialogHeader>
            <DialogTitle>Location on Map</DialogTitle>
          </DialogHeader>
          <LocationMap latitude={location.lat} longitude={location.lng} />
          <div className="p-4">
            <Button onClick={handleCloseMap} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}