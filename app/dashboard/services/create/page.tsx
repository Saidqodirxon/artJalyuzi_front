"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { createService, type ServiceData } from "@/lib/api/services";
import type { ImageData } from "@/lib/api/banners";
import { useToast } from "@/hooks/use-toast";

export default function CreateServicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceData>({
    name_uz: "",
    name_ru: "",
    description_uz: "",
    description_ru: "",
    image: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (images: ImageData[]) => {
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
      await createService(formData);
      toast({
        title: "Success",
        description: "Service created successfully",
      });
      router.push("/dashboard/services");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create service",
      });
    } finally {
      setLoading(false);
    }
  };

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
                {loading ? "Creating..." : "Create Service"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
