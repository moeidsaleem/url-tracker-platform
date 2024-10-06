'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { database } from '@/lib/firebase';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Smartphone, Globe, Languages } from "lucide-react";

import { Location } from '@/components/interfaces/location.interface';
import { momentAgo } from "@/lib/momentAgo";
import { handleBrowserUserInfoToReadable } from '@/lib/utils';

const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const shareLinkId = params.id as string;
    if (!shareLinkId) return;

    const locationsRef = ref(database, 'locations');
    const locationsQuery = query(locationsRef, orderByChild('shareLinkId'), equalTo(shareLinkId));

    const unsubscribe = onValue(locationsQuery, (snapshot) => {
      const data = snapshot.val();
      const locationsArray = data
        ? Object.entries(data).map(([locId, loc]) => ({ ...loc as Location, id: locId }))
        : [];
      setLocations(locationsArray);
    }, (error) => {
      console.error("Error fetching locations:", error);
      toast({
        title: "Error",
        description: "Failed to load locations.",
        variant: "destructive",
      });
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast, params.id]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-extrabold mb-4 text-primary">
          Location Insights
        </h1>
        <p className="text-lg text-muted-foreground">
          Tracking data for share link: 
          <a href={`/share-links`} className="font-semibold text-green-500">{params.id}</a>
        </p>
      </div>
      <Button onClick={() => router.back()} className="mb-4">
        Back
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Browser</TableHead>
            <TableHead>Language</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell>{location.nickname || 'Anonymous'}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {momentAgo(location.createdAt || 0)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  {location.deviceType || 'Unknown'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  {handleBrowserUserInfoToReadable(
                    location.userAgent || 'Unknown'
                  ).browser}, 
                 {handleBrowserUserInfoToReadable(
                    location.userAgent || 'Unknown'
                  ).language}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Languages className="h-4 w-4 mr-2" />
                  {location.userLanguage || 'Unknown'}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {locations.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No locations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LocationsPage;