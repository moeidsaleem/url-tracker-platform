import { useEffect, useState } from "react";
import { database } from "../lib/firebase";
import { ref, onValue, remove, update } from "firebase/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, Trash, Edit, Globe, User, Link, Smartphone, Monitor, Maximize2, ExternalLink, Clock, RefreshCw, Calendar, Tag } from "lucide-react";
import Map from "./Map";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import AddressText from "./crumbs/AddressText";
import { Location } from "./interfaces/location.interface";
import { momentAgo } from "@/lib/momentAgo";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    {icon}
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editedLocation, setEditedLocation] = useState<Location | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [locationsPerPage] = useState(10);

    const { toast } = useToast()

    useEffect(() => {
        const locationsRef = ref(database, 'locations');
        onValue(locationsRef, (snapshot) => {
            const data = snapshot.val();
            const locationArray = data ? Object.entries(data).map(([id, loc]) => ({ ...loc as Location, id })) : [];
            setLocations(locationArray);
        });
    }, []);

    const handleLocationClick = (location: Location) => {
        setSelectedLocation(location);
    };

    const handleRemoveLocation = async (id: string) => {
        try {
            await remove(ref(database, `locations/${id}`));
            toast({
                title: "Location removed",
                description: "The location has been successfully removed.",
            });
            if (selectedLocation?.id === id) {
                setSelectedLocation(null);
            }
        } catch (error) {
            console.error("Error removing location:", error);
            toast({
                title: "Error",
                description: "Failed to remove the location. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEditLocation = (location: Location) => {
        setEditedLocation(location);
        setIsEditDialogOpen(true);
    };

    const handleUpdateLocation = async () => {
        if (!editedLocation) return;

        try {
            await update(ref(database, `locations/${editedLocation.id}`), {
                ip: editedLocation.ip,
                latitude: editedLocation.latitude,
                longitude: editedLocation.longitude,
                nickname: editedLocation.nickname,
            });
            setIsEditDialogOpen(false);
            toast({
                title: "Location updated",
                description: "The location has been successfully updated.",
            });
            if (selectedLocation?.id === editedLocation.id) {
                setSelectedLocation(editedLocation);
            }
        } catch (error) {
            console.error("Error updating location:", error);
            toast({
                title: "Error",
                description: "Failed to update the location. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Get current locations
    const indexOfLastLocation = currentPage * locationsPerPage;
    const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
    const currentLocations = locations.slice(indexOfFirstLocation, indexOfLastLocation);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="flex">
            <Card className="w-full max-w-4xl mx-auto mt-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nickname</TableHead>
                            <TableHead>IP</TableHead>
                            <TableHead>Coordinates</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentLocations.map((location: Location) => (
                            <TableRow key={location.id}>
                                <TableCell>{location.nickname}</TableCell>
                                <TableCell>{location.ip}</TableCell>
                                <TableCell>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                <AddressText
                                 lat={location.latitude || 0} lng={location.longitude || 0  } />
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleLocationClick(location)}
                                        >
                                            <MapPin className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditLocation(location)}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleRemoveLocation(location.id || '')}
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                        </PaginationItem>
                        {[...Array(Math.ceil(locations.length / locationsPerPage))].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink onClick={() => paginate(index + 1)} isActive={currentPage === index + 1}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext onClick={() => paginate(currentPage + 1)} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
                {selectedLocation && (
                    <Card className="mt-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Selected Location Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <InfoItem icon={<Globe className="h-4 w-4" />} label="IP" value={selectedLocation.ip} />
                                    <InfoItem icon={<MapPin className="h-4 w-4" />} label="Coordinates" value={`${selectedLocation.latitude?.toFixed(6)}, ${selectedLocation.longitude?.toFixed(6)}`} />
                                    <InfoItem icon={<User className="h-4 w-4" />} label="User ID" value={selectedLocation.userId} />
                                    <InfoItem icon={<Link className="h-4 w-4" />} label="Share Link ID" value={selectedLocation.shareLinkId} />
                                    <InfoItem icon={<Smartphone className="h-4 w-4" />} label="Device ID" value={selectedLocation.deviceId} />
                                    <InfoItem icon={<Monitor className="h-4 w-4" />} label="Device Type" value={selectedLocation.deviceType} />
                                    <InfoItem icon={<Globe className="h-4 w-4" />} label="User Agent" value={selectedLocation.userAgent} />
                                </div>
                                <div className="space-y-2">
                                    <InfoItem icon={<Maximize2 className="h-4 w-4" />} label="Screen Size" value={`${selectedLocation.screenWidth}x${selectedLocation.screenHeight}`} />
                                    <InfoItem icon={<ExternalLink className="h-4 w-4" />} label="Referrer" value={selectedLocation.referrer} />
                                    <InfoItem icon={<Globe className="h-4 w-4" />} label="User Language" value={selectedLocation.userLanguage} />
                                    <InfoItem icon={<Clock className="h-4 w-4" />} label="User Timezone" value={selectedLocation.userTimezone} />
                                    <InfoItem icon={<RefreshCw className="h-4 w-4" />} label="Updated" value={momentAgo(selectedLocation.updatedAt || 0)} />
                                    <InfoItem icon={<Calendar className="h-4 w-4" />} label="Created" value={momentAgo(selectedLocation.createdAt || 0)} />
                                    <InfoItem icon={<Tag className="h-4 w-4" />} label="Nickname" value={selectedLocation.nickname} />
                                </div>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Location on Map</h3>
                                <Map 
                                    userLocations={[{
                                        id: selectedLocation.id,
                                        latitude: selectedLocation.latitude,
                                        longitude: selectedLocation.longitude,
                                        userId: '1',
                                    }]} 
                                    center={[
                                        selectedLocation.latitude || 0,
                                        selectedLocation.longitude || 0,
                                    ]}
                                    style={{ height: "300px", width: "100%" }}
                                    zoom={14}
                                />
                            </div>
                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => handleEditLocation(selectedLocation)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleRemoveLocation(selectedLocation.id || '')}>
                                    <Trash className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Location</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nickname" className="text-right">
                                Nickname
                            </Label>
                            <Input
                                id="nickname"
                                value={editedLocation?.nickname || ''}
                                onChange={(e) => setEditedLocation(prev => ({ ...prev!, nickname: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ip" className="text-right">
                                IP
                            </Label>
                            <Input
                                id="ip"
                                value={editedLocation?.ip || ''}
                                onChange={(e) => setEditedLocation(prev => ({ ...prev!, ip: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="latitude" className="text-right">
                                Latitude
                            </Label>
                            <Input
                                id="latitude"
                                type="number"
                                value={editedLocation?.latitude || 0}
                                onChange={(e) => setEditedLocation(prev => ({ ...prev!, latitude: parseFloat(e.target.value) }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="longitude" className="text-right">
                                Longitude
                            </Label>
                            <Input
                                id="longitude"
                                type="number"
                                value={editedLocation?.longitude || 0}
                                onChange={(e) => setEditedLocation(prev => ({ ...prev!, longitude: parseFloat(e.target.value) }))}
                                className="col-span-3"
                            />
                        </div>
                  
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleUpdateLocation}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
        </div>
       
    );
};

export default AdminDashboard;
