'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Edit2, Copy, MapPin } from 'lucide-react';
import { database } from "@/lib/firebase";
import { ref, onValue, remove, update, set } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from '@/components/CreateLinkModal';
import { v4 as uuidv4 } from 'uuid'; // Install uuid if not already
import { useRouter } from 'next/navigation';

interface ShareLink {
  id: string;
  name: string;
  url: string;
  shortUrl?: string;
  description?: string;
  expirationDate?: string;
  title?: string;
  imageUrl?: string;
}

const ShareLinksPage = () => {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<Partial<ShareLink> | null>(null);
  const { toast } = useToast();
const router = useRouter();

// react nextjs get the hostname 


  useEffect(() => {
  

    const shareLinksRef = ref(database, 'shareLinks');

    onValue(shareLinksRef, (snapshot) => {
      const data = snapshot.val();
      const linkArray = data
        ? Object.entries(data).map(([id, link]) => ({ ...link as ShareLink, id }))
        : [];
      setShareLinks(linkArray);
    });
  }, []);

  const handleCreateShareLink = async (link: Omit<ShareLink, 'id'>) => {
    try {
      const uniqueId = uuidv4();  // Generate a unique identifier
      const newLinkRef = ref(database, `shareLinks/${uniqueId}`);
      await set(newLinkRef, link);
      toast({
        title: "Share link created",
        description: "The new share link has been successfully created.",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating share link:", error);
      toast({
        title: "Error",
        description: "Failed to create the share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateShareLink = async (id: string, updatedLink: Partial<ShareLink>) => {
    try {
      await update(ref(database, `shareLinks/${id}`), updatedLink);
      toast({
        title: "Share link updated",
        description: "The share link has been successfully updated.",
      });
      setIsModalOpen(false);
      setCurrentLink(null);
    } catch (error) {
      console.error("Error updating share link:", error);
      toast({
        title: "Error",
        description: "Failed to update the share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteShareLink = async (id: string) => {
    try {
      await remove(ref(database, `shareLinks/${id}`));
      toast({
        title: "Share link deleted",
        description: "The share link has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting share link:", error);
      toast({
        title: "Error",
        description: "Failed to delete the share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openCreateModal = () => {
    setCurrentLink(null);
    setIsModalOpen(true);
  };

  const openEditModal = (link: ShareLink) => {
    setCurrentLink(link);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const expirationDate = formData.get('expirationDate') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const title = formData.get('title') as string;
    if (currentLink && currentLink.id) {
      // Update existing link
      handleUpdateShareLink(currentLink.id, { name, description, expirationDate });
    } else {
      // Create new link
      const newLink = {
        name,
        imageUrl,
        url: `/track?id=${uuidv4()}`,   // Enhanced URL generation using UUID
        title,
        description,
        expirationDate,
      };
      handleCreateShareLink(newLink);
    }
  };

  const generateShortUrl = async (linkId: string) => {
    try {
      console.log("Generating short URL for link ID:", linkId);
      const shortCode = generateShortCode(); // Implement this function to generate a unique short code
      const shortUrlRef = ref(database, `shortUrls/${shortCode}`);

      await set(shortUrlRef, { linkId });
      console.log("Short URL generated:", shortCode);
      const hostname = window.location.hostname;
      const shortUrl =  `https://${hostname}/s/${shortCode}`;
      console.log('shortUrl',shortUrl);

      await update(ref(database, `shareLinks/${linkId}`), { shortUrl });

      toast({
        title: "Short URL generated",
        description: `Short URL: ${shortUrl}`,
        duration: 3000
      });
      
      return shortUrl;
    } catch (error) {
      console.error("Error generating short URL:", error);
      throw error;
    }
  };

  const generateShortCode = () => {
    // Implement a function to generate a unique short code
    // This could be a random string, a hash, or any other method you prefer
    return Math.random().toString(36).substring(2, 8);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Share Links</h1>
      <div className="flex space-x-2 mb-6">
        <Button onClick={openCreateModal}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Link
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shareLinks.map((link) => (
            <TableRow key={link.id}>
              <TableCell>{link.name}</TableCell>
              <TableCell>
                {link.imageUrl && (
                  <img src={link.imageUrl} alt={link.name} className="w-10 h-10" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {link.url}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const hostname = window.location.hostname;
                      const url = hostname.includes('localhost')
                        ? `http://${hostname}:3000/track?id=${link.id}`
                        : `https://${hostname}/track?id=${link.id}`;
                      navigator.clipboard.writeText(url);
                      toast({
                        title: "URL copied to clipboard",
                        description: "You can now share this URL with others.",
                        duration: 3000,
                      });
                    }}
                    title="Copy URL"
                    aria-label="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {link.shortUrl && (
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Short URL:</span>
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-sm">
                      {link.shortUrl}
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(link.shortUrl!);
                        toast({
                          title: "Short URL copied to clipboard",
                          description: "You can now share this shortened URL with others.",
                          duration: 3000,
                        });
                      }}
                      title="Copy Short URL"
                      aria-label="Copy Short URL"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {!link.shortUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={async () => {
                      try {
                        const shortUrl = await generateShortUrl(link.id);
                        toast({
                          title: "Short URL generated",
                          description: `Short URL: ${shortUrl}`,
                          duration: 3000,
                        });
                      } catch (error) {
                        console.error("Error generating short URL:", error);
                        toast({
                          title: "Error",
                          description: "Failed to generate short URL. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Generate Short URL
                  </Button>
                )}
              </TableCell>
              <TableCell>{link.description || 'N/A'}</TableCell>
              <TableCell>{link.expirationDate ? new Date(link.expirationDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditModal(link)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteShareLink(link.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                    title="View Locations"
                    aria-label="View Locations"
                    onClick={() => {
                      router.push(`/share-links/${link.id}/locations`);
                    }}
                  >
                    
                    <MapPin className="h-4 w-4" />
                  </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Creating/Editing Share Links */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentLink ? "Edit Share Link" : "Create Share Link"}
      >
        <form onSubmit={handleModalSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              name="name"
              defaultValue={currentLink?.name || ''}
              required
              placeholder="Enter link name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Input
              name="description"
              defaultValue={currentLink?.description || ''}
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Page Title</label>
            <Input
              name="title"
              defaultValue={currentLink?.title || ''}
              placeholder="Enter link title"
            />
          </div>
          {/* add image upload as url */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <Input
              name="imageUrl"
              defaultValue={currentLink?.imageUrl || ''}
              placeholder="Enter image URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
            <Input
              type="date"
              name="expirationDate"
              defaultValue={currentLink?.expirationDate ? currentLink.expirationDate.split('T')[0] : ''}
              placeholder="Select expiration date"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {currentLink ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShareLinksPage;