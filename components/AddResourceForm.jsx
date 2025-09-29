"use client"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Package, IndianRupee, Tag, FileText } from "lucide-react"

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
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateResource(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from("resources")
      .insert([
        {
          owner_id: user.id,
          title: formData.title,
          category_id: Number.parseInt(formData.category_id, 10),
          price: Number.parseFloat(formData.price),
          type: formData.type.toLowerCase(),
          description: formData.description,
        },
      ])
      .select("*, categories(name)")
      .single()
    if (!error && data) {
      onResourceAdded(data)
      setIsModalOpen(false)
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        type: "",
      })
    }
    setLoading(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            Add New Resource
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">Share your resources with the campus community</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-5">
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

            {/* Category and Type Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  Category
                </Label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 p-3 border rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading categories...
                  </div>
                ) : (
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
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
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <ErrorMessage message={errors.type} />}
              </div>
            </div>

            {/* Price Section */}
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
                  className="focus:ring-indigo-500 focus:border-indigo-500 pl-8"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
              </div>
              {errors.price && <ErrorMessage message={errors.price} />}
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Add Resource
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
