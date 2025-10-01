"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { Loader2, Package, Wallet, Tag, FileText, Edit3, Calendar, X, Upload, ImageIcon } from "lucide-react"
import { uploadResourceImage, deleteResourceImage } from "@/utils/storage/resourceImages"

// Error message component (matching your existing style)
const ErrorMessage = ({ message }) => (
  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
    {message}
  </p>
)

const validateResource = (data) => {
  const errors = {}
  if (!data.title.trim()) errors.title = "Title is required"
  if (!data.description.trim()) errors.description = "Description is required"
  if (!data.category_id) errors.category = "Category is required"
  if (!data.price || Number(data.price) <= 0) errors.price = "Price must be positive"
  if (!data.type) errors.type = "Type is required"
  return errors
}

export default function ViewEditResourceModal({ open, onOpenChange, resourceId, currentUserId, onResourceUpdated }) {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [resource, setResource] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    price: "",
    type: "",
    image_url: "",
    image_path: "",
    has_image: false,
    availability_status: "available",
  })
  const [errors, setErrors] = useState({})

  const types = [
    { value: "sell", label: "Sell" },
    { value: "lend", label: "Lend" },
    { value: "share", label: "Share" },
  ]

  // Fetch resource and categories when modal opens
  useEffect(() => {
    if (!open || !resourceId) return

    const fetchData = async () => {
      setLoading(true)

      try {
        const [resourceResult, categoriesResult] = await Promise.all([
          supabase.from("resources").select("*, categories(name)").eq("id", resourceId).single(),
          supabase.from("categories").select("id, name").order("name", { ascending: true }),
        ])

        if (resourceResult.data) {
          const resourceData = resourceResult.data
          setResource(resourceData)

          const ownerCheck = resourceData.owner_id === currentUserId
          setIsOwner(ownerCheck)

          // If not owner, redirect to public resource page
          if (!ownerCheck) {
            onOpenChange(false)
            router.push(`/resources/${resourceId}`)
            return
          }

          // Set form data for editing
          setFormData({
            title: resourceData.title,
            description: resourceData.description,
            category_id: resourceData.category_id?.toString(),
            price: resourceData.price?.toString(),
            type: resourceData.type,
            image_url: resourceData.image_url || "",
            image_path: resourceData.image_path || "",
            has_image: resourceData.has_image || false,
            availability_status: resourceData.availability_status || "available",
          })

          if (resourceData.image_url) {
            setImagePreview(resourceData.image_url)
          }
        }

        if (categoriesResult.data) {
          setCategories(categoriesResult.data)
        }
      } catch (error) {
        console.error("Error fetching resource:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [open, resourceId, currentUserId, onOpenChange, router, supabase])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const handleSave = async () => {
    const validationErrors = validateResource(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSaving(true)
    try {
      let imageData = {
        image_url: formData.image_url,
        image_path: formData.image_path,
        has_image: formData.has_image,
      }

      // Handle image upload if new image selected
      if (selectedImage) {
        setUploading(true)

        // Delete old image if exists
        if (formData.image_path) {
          await deleteResourceImage(formData.image_path)
        }

        // Upload new image
        const uploadResult = await uploadResourceImage(selectedImage, resourceId, currentUserId)

        imageData = {
          image_url: uploadResult.url,
          image_path: uploadResult.path,
          has_image: true,
        }

        setUploading(false)
      }
      const { data, error } = await supabase
        .from("resources")
        .update({
          title: formData.title,
          description: formData.description,
          category_id: Number.parseInt(formData.category_id, 10),
          price: Number.parseFloat(formData.price),
          type: formData.type.toLowerCase(),
          availability_status: formData.availability_status.toLowerCase(),
          ...imageData,
        })
        .eq("id", resourceId)
        .select("*, categories(name)")
        .single()

      if (error) throw error

      setResource(data)
      setSelectedImage(null)
      setEditMode(false)
      onResourceUpdated?.(data)
    } catch (error) {
      console.error("Error updating resource:", error)
      setErrors({ submit: "Failed to update resource. Please try again." })
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleCancel = () => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description,
        category_id: resource.category_id?.toString(),
        price: resource.price?.toString(),
        type: resource.type,
        image_url: resource.image_url || "",
        image_path: resource.image_path || "",
        has_image: resource.has_image || false,
      })
      setImagePreview(resource.image_url || null)
    }
    setSelectedImage(null)
    setErrors({})
    setEditMode(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Please select a valid image file (JPEG, PNG, or WebP)" })
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" })
        return
      }

      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setErrors({ ...errors, image: "" })
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(formData.image_url || null)
  }

  const handleDeleteCurrentImage = async () => {
    if (formData.image_path) {
      try {
        await deleteResourceImage(formData.image_path)
        setFormData({
          ...formData,
          image_url: "",
          image_path: "",
          has_image: false,
        })
        setImagePreview(null)
      } catch (error) {
        setErrors({ ...errors, image: "Failed to delete image" })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-3 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-500" />
            {editMode ? "Edit Resource" : "Resource Details"}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {editMode ? "Update your resource information" : "View and manage your resource"}
          </p>
        </DialogHeader>

        <div className="px-6 py-1 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600 py-10">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading resource...
            </div>
          ) : resource ? (
            <div className="space-y-5">
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
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                    {resource.type}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(resource.created_at).toLocaleDateString()}
                </div>
              </div>

              {editMode ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
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
                          className="focus:ring-indigo-500 focus:border-indigo-500 pl-7"
                        />
                        <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          ₹
                        </span>
                      </div>
                      {errors.price && <ErrorMessage message={errors.price} />}
                    </div>
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
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        Category
                      </Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => {
                          setFormData((prev) => ({ ...prev, category_id: value }))
                          setErrors((prev) => ({ ...prev, category: "" }))
                        }}
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
                        onValueChange={(value) => {
                          setFormData((prev) => ({ ...prev, type: value }))
                          setErrors((prev) => ({ ...prev, type: "" }))
                        }}
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
                    {/* Availability Select */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Availability</Label>
                      <Select
                        value={formData.availability_status}
                        onValueChange={(value) => {
                          setFormData((prev) => ({ ...prev, availability_status: value }))
                        }}
                      >
                        <SelectTrigger className="focus:ring-indigo-500 focus:border-indigo-500">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="resource-image"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                      Resource Image
                    </Label>

                    {/* Current/Preview Image */}
                    {imagePreview && (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Resource preview"
                          className="w-full max-w-xs h-40 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 shadow-md"
                          onClick={selectedImage ? handleRemoveImage : handleDeleteCurrentImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* File Input with better styling */}
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="resource-image"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 hover:bg-indigo-100 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </Label>
                      <Input
                        id="resource-image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <span className="text-xs text-gray-500">JPEG, PNG, WebP • Max 5MB</span>
                    </div>

                    {/* Image Upload Error */}
                    {errors.image && <ErrorMessage message={errors.image} />}
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
                  {resource.has_image && resource.image_url && (
                    <div className="mb-4">
                      <img
                        src={resource.image_url || "/placeholder.svg"}
                        alt={resource.title}
                        className="w-full max-w-md h-56 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{resource.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
                      <p className="text-sm text-gray-900 font-medium">
                        {resource.categories?.name || "Uncategorized"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price</span>
                      <p className="text-lg text-indigo-600 font-bold">₹{resource.price}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600 py-10 text-center">Resource not found.</div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          {editMode ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 sm:flex-none bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || uploading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px] flex-1 sm:flex-none"
              >
                {saving || uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {uploading ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
                Close
              </Button>
              <Button
                onClick={() => setEditMode(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 sm:flex-none"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Resource
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
