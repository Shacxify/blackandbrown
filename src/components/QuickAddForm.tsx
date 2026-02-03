import { useState } from 'react';
import { Product, CATEGORIES, CONDITIONS } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface QuickAddFormProps {
  onAddProduct: (product: Omit<Product, 'id' | 'dateAdded' | 'sold'>) => void;
}

const QuickAddForm = ({ onAddProduct }: QuickAddFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '' as Product['category'],
    price: '',
    size: '',
    condition: '' as Product['condition'],
    description: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price || !formData.condition) {
      toast.error('Please fill in all required fields');
      return;
    }

    onAddProduct({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      size: formData.size || undefined,
      condition: formData.condition,
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop',
    });

    // Reset form
    setFormData({
      name: '',
      category: '' as Product['category'],
      price: '',
      size: '',
      condition: '' as Product['condition'],
      description: '',
      image: '',
    });

    toast.success('Product added to inventory!');
  };

  return (
    <Card className="border-2 border-dashed border-amber/30 bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber/10">
            <Zap className="h-5 w-5 text-amber" />
          </div>
          <div>
            <CardTitle className="font-serif text-xl">Quick Add</CardTitle>
            <CardDescription>Add new items to inventory in seconds</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="Vintage Leather Jacket"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(c => c !== 'All').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value as Product['condition'] })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="85"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1.5"
              />
            </div>

            {/* Size */}
            <div>
              <Label htmlFor="size">Size (optional)</Label>
              <Input
                id="size"
                placeholder="M, L, 32, etc."
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="mt-1.5"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="mt-1.5"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the item's unique features, condition details, measurements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 min-h-[80px]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" variant="vintage">
            <Plus className="h-4 w-4" />
            Add to Inventory
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickAddForm;
