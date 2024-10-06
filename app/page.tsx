'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Link as LinkIcon, Users } from 'lucide-react';
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Location } from "@/components/interfaces/location.interface";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

export default function Home() {
  const [totalLocations, setTotalLocations] = useState(0);
  const [activeShareLinks, setActiveShareLinks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userLocations, setUserLocations] = useState<Location[]>([]);

  useEffect(() => {
    const locationsRef = ref(database, 'locations');
    const shareLinksRef = ref(database, 'shareLinks');
    const usersRef = ref(database, 'users');

    const unsubscribeLocations = onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locationsArray = Object.entries(data).map(([id, location]) => ({
          id,
          ...(location as Location),
        }));
        setUserLocations(locationsArray);
        setTotalLocations(locationsArray.length);
      } else {
        setUserLocations([]);
        setTotalLocations(0);
      }
    });

    const unsubscribeShareLinks = onValue(shareLinksRef, (snapshot) => {
      const data = snapshot.val();
      setActiveShareLinks(data ? Object.keys(data).length : 0);
    });

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setTotalUsers(data ? Object.keys(data).length : 0);
    });

    return () => {
      unsubscribeLocations();
      unsubscribeShareLinks();
      unsubscribeUsers();
    };
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Welcome to Location Tracker</h1>
      <p className="text-xl mb-8">Manage your locations and share links efficiently.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
            <CardDescription>View and manage tracked locations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/locations">
              <Button className="w-full">
                Go to Locations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share Links</CardTitle>
            <CardDescription>Create and manage share links</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/share-links">
              <Button className="w-full">
                Manage Share Links
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>View user statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/users">
              <Button className="w-full">
                View Users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Locations
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLocations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Share Links
              </CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeShareLinks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">All Locations</h2>
        <Map 
          userLocations={userLocations}
          style={{ height: "500px", width: "100%" }}
          zoom={2}
        />
      </div>
    </div>
  );
}