"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { getBanner, updateBanner, type BannerData } from "@/lib/api/banners";
import type { ImageData } from "@/lib/api/banners";
import { useToast } from "@/hooks/use-toast";

export default function EditBannerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<BannerData>({
    name_uz: "",
    name_ru: "",
    description_uz: "",
    description_ru: "",
    link: "",
    image: {} as ImageData,
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBanner(params.id);
        setFormData(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch banner",
        });
        router.push("/dashboard/banners");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBanner();
  }, [params.id, router, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: ImageData | ImageData[] | null) => {
    if (value && !Array.isArray(value)) {
      setFormData((prev) => ({ ...prev, image: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || !formData.image.url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image",
      });
      return;
    }

    setLoading(true);
    try {
      await updateBanner(params.id, formData);
      toast({
        title: "Success",
        description: "Banner updated successfully",
      });
      router.push("/dashboard/banners");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update banner",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/dashboard/banners")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Banners
      </Button>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name_uz">Name (UZ)</Label>
                <Input
                  id="name_uz"
                  name="name_uz"
                  value={formData.name_uz}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_ru">Name (RU)</Label>
                <Input
                  id="name_ru"
                  name="name_ru"
                  value={formData.name_ru}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="description_uz">Description (UZ)</Label>
                <Textarea
                  id="description_uz"
                  name="description_uz"
                  value={formData.description_uz}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_ru">Description (RU)</Label>
                <Textarea
                  id="description_ru"
                  name="description_ru"
                  value={formData.description_ru}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Banner Image</Label>
              <FileUpload
                multiple={false}
                value={formData.image}
                onChange={handleImageChange}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Banner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
