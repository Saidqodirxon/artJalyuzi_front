"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { getBanners, deleteBanner, type BannerData } from "@/lib/api/banners";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

export default function BannersPage() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchBanners = async () => {
    try {
      const data = await getBanners();
      // Ensure banners is always an array
      setBanners(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch banners",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [toast]);

  const handleDelete = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteBanner(bannerToDelete);
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      fetchBanners();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete banner",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Banners List</h2>
        <Button onClick={() => router.push("/dashboard/banners/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Banner
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : !Array.isArray(banners) || banners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No banners found. Create your first banner.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name (UZ)</TableHead>
              <TableHead>Name (RU)</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner._id}>
                <TableCell>
                  {banner.image && banner.image.url ? (
                    <Image
                      src={banner.image.url || "/placeholder.svg"}
                      alt={banner.name_uz}
                      className="w-16 h-16 object-cover rounded"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      No image
                    </div>
                  )}
                </TableCell>
                <TableCell>{banner.name_uz}</TableCell>
                <TableCell>{banner.name_ru}</TableCell>
                <TableCell>
                  {banner.link && (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Link
                    </a>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(`/dashboard/banners/edit/${banner._id}`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(banner._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              banner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
