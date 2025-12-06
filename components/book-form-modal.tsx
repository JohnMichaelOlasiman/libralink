"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, AlertCircle } from "lucide-react"

interface BookFormData {
  id?: string
  title: string
  isbn: string
  author: string
  publisher: string
  category: string
  categoryId?: string
  yearPublished: string
  totalCopies: string
  availableCopies?: string
  coverUrl: string
  description: string
  status: string
}

interface BookFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BookFormData) => void
  initialData?: BookFormData | null
  mode: "add" | "edit"
  categories?: Array<{ id: string; name: string }>
}

const defaultCategories = [
  "Thriller / Mystery",
  "Psychological Thriller",
  "Horror",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Non-Fiction",
  "Biography",
  "Self-Help",
  "History",
]

const statuses = ["Available", "Borrowed", "Reserved", "Lost"]

const defaultFormData: BookFormData = {
  title: "",
  isbn: "",
  author: "",
  publisher: "",
  category: "",
  categoryId: "",
  yearPublished: "",
  totalCopies: "1",
  availableCopies: "1",
  coverUrl: "",
  description: "",
  status: "Available",
}

export function BookFormModal({ isOpen, onClose, onSubmit, initialData, mode, categories }: BookFormModalProps) {
  const [formData, setFormData] = useState<BookFormData>(defaultFormData)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        title: initialData.title ?? "",
        isbn: initialData.isbn ?? "",
        author: initialData.author ?? "",
        publisher: initialData.publisher ?? "",
        category: initialData.category ?? "",
        categoryId: initialData.categoryId ?? "",
        yearPublished: initialData.yearPublished ?? "",
        totalCopies: String(initialData.totalCopies ?? "1"),
        availableCopies: String(initialData.availableCopies ?? "0"),
        coverUrl: initialData.coverUrl ?? "",
        description: initialData.description ?? "",
        status: initialData.status ?? "Available",
      })
      setCoverPreview(initialData.coverUrl || null)
    } else {
      setFormData(defaultFormData)
      setCoverPreview(null)
    }
    setValidationError(null)
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const totalCopies = Number.parseInt(formData.totalCopies) || 0
    const availableCopies = Number.parseInt(formData.availableCopies ?? "0") || 0

    if (mode === "edit" && totalCopies < availableCopies) {
      setValidationError("Total copies cannot be less than available copies")
      return
    }

    setValidationError(null)
    onSubmit({
      ...formData,
      coverUrl: coverPreview || formData.coverUrl,
      totalCopies: totalCopies,
      availableCopies: availableCopies,
    })
    onClose()
  }

  const handleChange = (field: keyof BookFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setValidationError(null)
  }

  const handleCategoryChange = (value: string) => {
    if (categories) {
      const selectedCat = categories.find((c) => c.id === value)
      setFormData((prev) => ({
        ...prev,
        category: selectedCat?.name || value,
        categoryId: value,
      }))
    } else {
      setFormData((prev) => ({ ...prev, category: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setCoverPreview(base64String)
        setFormData((prev) => ({ ...prev, coverUrl: base64String }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveCover = () => {
    setCoverPreview(null)
    setFormData((prev) => ({ ...prev, coverUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const categoryOptions = categories || defaultCategories.map((name, i) => ({ id: name, name }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {mode === "add" ? "Add New Book" : "Edit Book"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm">{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-muted-foreground">
                Book Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter book title"
                required
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn" className="text-sm text-muted-foreground">
                ISBN
              </Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleChange("isbn", e.target.value)}
                placeholder="Enter ISBN"
                required
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm text-muted-foreground">
                Author
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Enter author name"
                required
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher" className="text-sm text-muted-foreground">
                Publisher
              </Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => handleChange("publisher", e.target.value)}
                placeholder="Enter publisher"
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-muted-foreground">
                Category
              </Label>
              <Select value={formData.categoryId || formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm text-muted-foreground">
                Year Published
              </Label>
              <Input
                id="year"
                type="number"
                value={formData.yearPublished}
                onChange={(e) => handleChange("yearPublished", e.target.value)}
                placeholder="e.g., 2023"
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="copies" className="text-sm text-muted-foreground">
                Total Copies
              </Label>
              <Input
                id="copies"
                type="number"
                min={0}
                value={formData.totalCopies}
                onChange={(e) => handleChange("totalCopies", e.target.value)}
                className="bg-input border-border"
              />
            </div>
            {mode === "edit" && (
              <div className="space-y-2">
                <Label htmlFor="availableCopies" className="text-sm text-muted-foreground">
                  Available Copies
                </Label>
                <Input
                  id="availableCopies"
                  type="number"
                  min={0}
                  value={formData.availableCopies ?? ""}
                  onChange={(e) => handleChange("availableCopies", e.target.value)}
                  className="bg-input border-border"
                />
              </div>
            )}
            {mode === "add" && (
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm text-muted-foreground">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter book description"
              rows={3}
              className="bg-input border-border resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Cover Image</Label>
            {coverPreview ? (
              <div className="relative inline-block">
                <img
                  src={coverPreview || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-32 h-48 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-accent/50 transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              {mode === "add" ? "Add Book" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
