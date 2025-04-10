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
import {
  getService,
  updateService,
  type ServiceData,
} from "@/lib/api/services";
import type { ImageData } from "@/lib/api/banners";
import { useToast } from "@/hooks/use-toast";

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<ServiceData>({
    name_uz: "",
    name_ru: "",
    description_uz: "",
    description_ru: "",
    image: [],
  });

  // Unwrap params with useEffect or directly in client component
  useEffect(() => {
    const fetchService = async () => {
      try {
        const resolvedParams = await params; // Resolve the Promise
        const data = await getService(resolvedParams.id);
        setFormData(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch service",
        });
        router.push("/dashboard/services");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchService();
  }, [params, router, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: ImageData | ImageData[] | null) => {
    const images = Array.isArray(value) ? value : value ? [value] : [];
    setFormData((prev) => ({ ...prev, image: images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || formData.image.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload at least one image",
      });
      return;
    }

    setLoading(true);
    try {
      const resolvedParams = await params; // Resolve the Promise
      await updateService(resolvedParams.id, formData);
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
      router.push("/dashboard/services");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update service",
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
        onClick={() => router.push("/dashboard/services")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
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
              <Label>Service Images</Label>
              <FileUpload
                multiple={true}
                value={formData.image}
                onChange={handleImageChange}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Service"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
