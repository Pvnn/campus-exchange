"use client"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Package, IndianRupee, Tag, FileText, X, ImageIcon } from "lucide-react"
import { uploadResourceImage } from "@/utils/storage/resourceImages"

// Error message component
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

export default function AddResourceForm({ isModalOpen, setIsModalOpen, onResourceAdded, user }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    price: "",
    type: "",
    image_url: "",
    image_path: "",
    has_image: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const types = [
    { value: "Sell", label: "Sell", icon: "" },
    { value: "Lend", label: "Lend", icon: "" },
    { value: "Share", label: "Share", icon: "" },
  ]
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("id, name").order("name", { ascending: true })

      if (!error && data) {
        setCategories(data)
      } else {
        console.error("Failed to fetch categories", error)
      }
      setLoadingCategories(false)
    }

    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: "" })
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
    setImagePreview(null)
    setErrors({ ...errors, image: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateResource(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const { data: resourceData, error: resourceError } = await supabase
        .from("resources")
        .insert([
          {
            owner_id: user.id,
            title: formData.title,
            category_id: Number.parseInt(formData.category_id, 10),
            price: Number.parseFloat(formData.price),
            type: formData.type.toLowerCase(),
            description: formData.description,
            has_image: !!selectedImage,
          },
        ])
        .select("*, categories(name)")
        .single()

      if (resourceError) throw resourceError

      let finalResourceData = resourceData

      if (selectedImage) {
        setUploading(true)

        try {
          const imageData = await uploadResourceImage(selectedImage, resourceData.id, user.id)

          const { data: updatedResource, error: updateError } = await supabase
            .from("resources")
            .update({
              image_url: imageData.url,
              image_path: imageData.path,
              has_image: true,
            })
            .eq("id", resourceData.id)
            .select("*, categories(name)")
            .single()

          if (updateError) throw updateError
          finalResourceData = updatedResource
        } catch (imageError) {
          console.error("Image upload error:", imageError)
          setErrors({ image: "Resource created but image upload failed" })
        } finally {
          setUploading(false)
        }
      }
      onResourceAdded(finalResourceData)
      setIsModalOpen(false)

      setFormData({
        title: "",
        description: "",
        category_id: "",
        price: "",
        type: "",
        image_url: "",
        image_path: "",
        has_image: false,
      })
      setSelectedImage(null)
      setImagePreview(null)
      setErrors({})
    } catch (error) {
      console.error("Error creating resource:", error)
      setErrors({ submit: "Failed to create resource. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            Add New Resource
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">Share your resources with the campus community</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-4">
            {/* Title Section */}
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
                placeholder="e.g., Data Structures and Algorithms Textbook"
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.title && <ErrorMessage message={errors.title} />}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  Category
                </Label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 p-3 border rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger className="focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.category && <ErrorMessage message={errors.category} />}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="focus:ring-indigo-500 focus:border-indigo-500">
                    <SelectValue placeholder="Select" />
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

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-gray-500" />
                  Price (₹)
                </Label>
                <div className="relative">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="focus:ring-indigo-500 focus:border-indigo-500 pl-7"
                  />
                  <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                </div>
                {errors.price && <ErrorMessage message={errors.price} />}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                Resource Image (Optional)
              </Label>

              <div className="flex items-start gap-4">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Resource preview"
                        className="w-24 h-24 object-cover rounded-md border-2 border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">No image</span>
                    </div>
                  )}
                </div>

                {/* File Input */}
                <div className="flex-1 space-y-1.5">
                  <Input
                    id="resource-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">JPEG, PNG, WebP • Max 5MB</p>
                  {errors.image && <ErrorMessage message={errors.image} />}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the condition, edition, and any other relevant details..."
                rows={3}
                className="focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
              {errors.description && <ErrorMessage message={errors.description} />}
            </div>
          </div>

          {/* Action Buttons */}
          {errors.submit && (
            <div className="mt-4">
              <ErrorMessage message={errors.submit} />
            </div>
          )}
          <DialogFooter className="mt-6 pt-4 border-t sticky bottom-0 bg-white">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {uploading ? "Uploading..." : "Creating..."}
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Create Resource
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
