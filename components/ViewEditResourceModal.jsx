"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Package, Wallet, Tag, FileText, Edit3, ExternalLink, Calendar } from "lucide-react";

// Error message component (matching your existing style)
const ErrorMessage = ({ message }) => (
  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
    {message}
  </p>
);

const validateResource = (data) => {
  const errors = {};
  if (!data.title.trim()) errors.title = "Title is required";
  if (!data.description.trim()) errors.description = "Description is required";
  if (!data.category_id) errors.category = "Category is required";
  if (!data.price || Number(data.price) <= 0) errors.price = "Price must be positive";
  if (!data.type) errors.type = "Type is required";
  return errors;
};

export default function ViewEditResourceModal({ 
  open, 
  onOpenChange, 
  resourceId, 
  currentUserId,
  onResourceUpdated 
}) {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resource, setResource] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    price: "",
    type: "",
  });
  const [errors, setErrors] = useState({});

  const types = [
    { value: "sell", label: "Sell" },
    { value: "lend", label: "Lend" },
    { value: "share", label: "Share" },
  ];

  // Fetch resource and categories when modal opens
  useEffect(() => {
    if (!open || !resourceId) return;

    const fetchData = async () => {
      setLoading(true);
      
      try {
        const [resourceResult, categoriesResult] = await Promise.all([
          supabase
            .from("resources")
            .select("*, categories(name)")
            .eq("id", resourceId)
            .single(),
          supabase
            .from("categories")
            .select("id, name")
            .order("name", { ascending: true })
        ]);

        if (resourceResult.data) {
          const resourceData = resourceResult.data;
          setResource(resourceData);
          
          const ownerCheck = resourceData.owner_id === currentUserId;
          setIsOwner(ownerCheck);
          
          // If not owner, redirect to public resource page
          if (!ownerCheck) {
            onOpenChange(false);
            router.push(`/resources/${resourceId}`);
            return;
          }

          // Set form data for editing
          setFormData({
            title: resourceData.title,
            description: resourceData.description,
            category_id: resourceData.category_id?.toString(),
            price: resourceData.price?.toString(),
            type: resourceData.type,
          });
        }

        if (categoriesResult.data) {
          setCategories(categoriesResult.data);
        }

      } catch (error) {
        console.error("Error fetching resource:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, resourceId, currentUserId, onOpenChange, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSave = async () => {
    const validationErrors = validateResource(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("resources")
        .update({
          title: formData.title,
          description: formData.description,
          category_id: Number.parseInt(formData.category_id, 10),
          price: Number.parseFloat(formData.price),
          type: formData.type.toLowerCase(),
        })
        .eq("id", resourceId)
        .select("*, categories(name)")
        .single();

      if (error) throw error;

      setResource(data);
      setEditMode(false);
      onResourceUpdated?.(data);
      
    } catch (error) {
      console.error("Error updating resource:", error);
      setErrors({ submit: "Failed to update resource. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description,
        category_id: resource.category_id?.toString(),
        price: resource.price?.toString(),
        type: resource.type,
      });
    }
    setErrors({});
    setEditMode(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-500" />
            {editMode ? "Edit Resource" : "Resource Details"}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {editMode ? "Update your resource information" : "View and manage your resource"}
          </p>
        </DialogHeader>

        <div className="px-6 pb-6">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600 py-10">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading resource...
            </div>
          ) : resource ? (
            <div className="space-y-6">
              {/* Status and metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      resource.availability_status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    ].join(" ")}
                  >
                    {resource.availability_status || "available"}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                    {resource.type}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Created {new Date(resource.created_at).toLocaleDateString()}
                </div>
              </div>

              {editMode ? (
                // Edit Form
                <div className="space-y-5">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Resource Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.title && <ErrorMessage message={errors.title} />}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    />
                    {errors.description && <ErrorMessage message={errors.description} />}
                  </div>

                  {/* Category and Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        Category
                      </Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                      >
                        <SelectTrigger className="focus:ring-indigo-500 focus:border-indigo-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <ErrorMessage message={errors.category} />}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger className="focus:ring-indigo-500 focus:border-indigo-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && <ErrorMessage message={errors.type} />}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-gray-500" />
                      Price (₹)
                    </Label>
                    <div className="relative">
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="focus:ring-indigo-500 focus:border-indigo-500 pl-8"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    </div>
                    {errors.price && <ErrorMessage message={errors.price} />}
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <ErrorMessage message={errors.submit} />
                    </div>
                  )}
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600">{resource.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-600">{resource.categories?.name || "Uncategorized"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="ml-2 text-gray-900 font-semibold">₹{resource.price}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600 py-10">Resource not found.</div>
          )}
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t">
          {editMode ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                onClick={() => setEditMode(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Resource
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
