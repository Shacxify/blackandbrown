import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Sparkles, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CATEGORIES, CONDITIONS, ProductCondition, ProductStatus } from '@/types/product';

interface ProductFormProps {
  onSaved: () => void;
}

const ProductForm = ({ onSaved }: ProductFormProps) => {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    size: '',
    condition: '' as ProductCondition | '',
    description: '',
    price: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<{
    low: number; high: number; condition: string; reasoning: string;
  } | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setForm({ name: '', brand: '', category: '', size: '', condition: '', description: '', price: '' });
    setFiles([]);
    setPreviews([]);
    setAiSuggestion(null);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []).slice(0, 4 - files.length);
    const valid = incoming.filter((f) => f.size <= 10 * 1024 * 1024 && f.type.startsWith('image/'));
    if (valid.length < incoming.length) toast.error('Skipped files larger than 10MB or not images');
    setFiles((prev) => [...prev, ...valid]);
    setPreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const getAiEstimate = async () => {
    if (!form.brand || !form.size || !form.description) {
      toast.error('Brand, size, and description help the AI estimate');
      return;
    }
    if (files.length === 0) {
      toast.error('Add at least one photo for AI to analyze');
      return;
    }
    setEstimating(true);
    try {
      // Convert files to data URLs for the AI (no upload yet — quick preview)
      const dataUrls = await Promise.all(
        files.map(
          (f) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(f);
            }),
        ),
      );

      const { data, error } = await supabase.functions.invoke('estimate-price', {
        body: {
          brand: form.brand,
          size: form.size,
          use: form.description,
          category: form.category,
          photoUrls: dataUrls,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAiSuggestion({
        low: data.price_low,
        high: data.price_high,
        condition: data.condition,
        reasoning: data.reasoning,
      });
      // Pre-fill price with midpoint and condition
      const mid = Math.round((data.price_low + data.price_high) / 2);
      setForm((f) => ({
        ...f,
        price: f.price || String(mid),
        condition: f.condition || (data.condition as ProductCondition),
      }));
      toast.success('AI estimate ready — adjust the price as you see fit');
    } catch (err: any) {
      toast.error(err.message || 'Failed to get AI estimate');
    } finally {
      setEstimating(false);
    }
  };

  const save = async (status: ProductStatus) => {
    if (!form.name || !form.category || !form.price || !form.condition) {
      toast.error('Name, category, condition, and price are required');
      return;
    }

    setSaving(true);
    try {
      // Upload files to product-photos
      const photoPaths: string[] = [];
      const folder = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${folder}/photo-${i}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('product-photos')
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('product-photos').getPublicUrl(path);
        photoPaths.push(pub.publicUrl);
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('products').insert({
        name: form.name,
        brand: form.brand || null,
        category: form.category,
        size: form.size || null,
        condition: form.condition as ProductCondition,
        description: form.description || null,
        price: parseFloat(form.price),
        ai_suggested_price: aiSuggestion ? Math.round((aiSuggestion.low + aiSuggestion.high) / 2) : null,
        photos: photoPaths,
        status,
        created_by: user?.id ?? null,
      });
      if (error) throw error;

      toast.success(status === 'published' ? 'Product published to shop' : 'Saved as draft');
      reset();
      onSaved();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-xl font-light tracking-wide uppercase">
          Add Item to Inventory
        </CardTitle>
        <div className="section-divider mt-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-xs tracking-wide uppercase">Item Name *</Label>
              <Input
                placeholder="Vintage Leather Jacket"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5"
                maxLength={120}
              />
            </div>
            <div>
              <Label className="text-xs tracking-wide uppercase">Brand</Label>
              <Input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="mt-1.5"
                maxLength={100}
              />
            </div>
            <div>
              <Label className="text-xs tracking-wide uppercase">Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs tracking-wide uppercase">Size</Label>
              <Input
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="mt-1.5"
                maxLength={40}
              />
            </div>
            <div>
              <Label className="text-xs tracking-wide uppercase">Condition *</Label>
              <Select
                value={form.condition}
                onValueChange={(v) => setForm({ ...form, condition: v as ProductCondition })}
              >
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs tracking-wide uppercase">Description / Use</Label>
              <Textarea
                placeholder="Era, fabric, fit, any flaws..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1.5 min-h-[80px]"
                maxLength={1000}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs tracking-wide uppercase">Photos (up to 4)</Label>
              <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square">
                    <img src={src} alt={`upload ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-background/90 p-1 hover:bg-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {files.length < 4 && (
                  <label className="aspect-square border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50">
                    <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-[10px] tracking-wide uppercase text-muted-foreground">Add Photo</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={getAiEstimate}
            disabled={estimating}
          >
            {estimating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {estimating ? 'Analyzing...' : 'Get AI Price Suggestion'}
          </Button>

          {aiSuggestion && (
            <div className="border border-border p-4 text-center bg-accent/30">
              <p className="text-xs tracking-nav uppercase text-muted-foreground mb-2">AI Suggested Range</p>
              <p className="font-serif text-2xl text-foreground mb-2">
                ${aiSuggestion.low.toFixed(0)} – ${aiSuggestion.high.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground mb-1">Condition: {aiSuggestion.condition}</p>
              <p className="text-xs text-muted-foreground italic leading-relaxed">{aiSuggestion.reasoning}</p>
            </div>
          )}

          <div>
            <Label className="text-xs tracking-wide uppercase">Final Price ($) *</Label>
            <Input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1.5"
              placeholder="Set your price"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => save('draft')}
              disabled={saving}
            >
              Save Draft
            </Button>
            <Button
              type="button"
              variant="minimal"
              className="flex-1 gap-2"
              onClick={() => save('published')}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Publish
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
