// src/components/UserLocationsMap.tsx
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
    
import SingleLocation from "./SingleLocation";

interface Location {
  id: string;
  lat: number;
  lng: number;
  timestamp: number;
  userId: string;
  deviceType: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  referrer: string;
  userLanguage: string;
  userTimezone: string;
  country: string;
  city: string;
  ip: string;
}

const UserLocationsMap: React.FC = () => {
  const [userLocations, setUserLocations] = useState<Location[]>([]);

  useEffect(() => {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyD57QYhIVbgk7gzKGDM6TbsVWyZNXnncoA",
      authDomain: "todolist-59971.firebaseapp.com",
      databaseURL: "https://todolist-59971.firebaseio.com",
      projectId: "todolist-59971",
      storageBucket: "todolist-59971.appspot.com",
      messagingSenderId: "317389610882",
      appId: "1:317389610882:web:67d6e7844fe5cc1c93799b",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Fetch user locations from Firestore
    const fetchUserLocations = async () => {
      const locations: Location[] = [];
      const querySnapshot = await getDocs(collection(db, "userLocations"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        locations.push({
          id: doc.id,
          lat: data.latitude,
          lng: data.longitude,
          timestamp: data.timestamp,
          userId: data.userId,
          deviceType: data.deviceType,
          userAgent: data.userAgent,
          screenWidth: data.screenWidth,
          screenHeight: data.screenHeight,
          referrer: data.referrer,
          userLanguage: data.userLanguage,
          userTimezone: data.userTimezone,
          country: data.country,
          city: data.city,
          ip: data.ip,
        });
      });
      setUserLocations(locations);
    };

    fetchUserLocations();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold my-4">User Locations on Map</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full">
        {userLocations.map((location) => (
          <SingleLocation key={location.id} location={location} />
        ))}
        
        
      </div>
    </div>
  );
};
    
export default UserLocationsMap;
