'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { database } from '@/lib/firebase';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import { Location } from '@/components/interfaces/location.interface';

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
      <h1 className="text-2xl font-bold mb-6">Locations for Share Link</h1>
      <Button onClick={() => router.back()} className="mb-4">
        Back
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            {/* Add other headers as needed */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell>{location.nickname}</TableCell>
              <TableCell>{location.latitude}</TableCell>
              <TableCell>{location.longitude}</TableCell>
              {/* Add other cells as needed */}
            </TableRow>
          ))}
          {locations.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
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