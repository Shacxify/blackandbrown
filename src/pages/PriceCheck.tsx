import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';
import { Upload, X, Sparkles, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const submissionSchema = z.object({
  customer_name: z.string().trim().min(1, 'Name required').max(100),
  customer_email: z.string().trim().email('Invalid email').max(255),
  customer_phone: z.string().trim().max(40).optional(),
  brand: z.string().trim().min(1, 'Brand required').max(100),
  size: z.string().trim().min(1, 'Size required').max(40),
  category: z.string().trim().max(60).optional(),
  use_description: z.string().trim().min(5, 'Tell us a bit more').max(1000),
});

interface Estimate {
  price_low: number;
  price_high: number;
  condition: string;
  reasoning: string;
}

const PriceCheck = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    brand: '',
    size: '',
    category: '',
    use_description: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = submissionSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    if (files.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    setSubmitting(true);
    setEstimate(null);

    try {
      // 1. Upload photos to submission-photos bucket
      const photoPaths: string[] = [];
      const signedUrls: string[] = [];
      const folder = `submissions/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${folder}/photo-${i}.${ext}`;
        const { data: upData, error: upErr } = await supabase.storage
          .from('submission-photos')
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        const storedPath = upData?.path ?? path;
        photoPaths.push(storedPath);

        // Signed URL — retry briefly to handle storage propagation
        let signedUrl: string | null = null;
        let lastErr: any = null;
        for (let attempt = 0; attempt < 4; attempt++) {
          const { data: signed, error: signErr } = await supabase.storage
            .from('submission-photos')
            .createSignedUrl(storedPath, 600);
          if (signed?.signedUrl) {
            signedUrl = signed.signedUrl;
            break;
          }
          lastErr = signErr;
          await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
        }
        if (!signedUrl) throw lastErr ?? new Error('Could not sign uploaded photo URL');
        signedUrls.push(signedUrl);
      }

      // 2. Call AI edge function
      const { data: aiData, error: aiErr } = await supabase.functions.invoke('estimate-price', {
        body: {
          brand: form.brand,
          size: form.size,
          use: form.use_description,
          category: form.category,
          photoUrls: signedUrls,
        },
      });
      if (aiErr) throw aiErr;
      if (aiData?.error) throw new Error(aiData.error);

      const result = aiData as Estimate;
      setEstimate(result);

      // 3. Save submission to DB
      const { error: insErr } = await supabase.from('price_submissions').insert({
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone || null,
        brand: form.brand,
        size: form.size,
        category: form.category || null,
        use_description: form.use_description,
        photos: photoPaths,
        ai_estimate_low: result.price_low,
        ai_estimate_high: result.price_high,
        ai_reasoning: result.reasoning,
      });
      if (insErr) throw insErr;

      toast.success('Estimate generated and submission saved');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header mode="consumer" onModeChange={() => navigate('/auth')} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide uppercase mb-4">
              Get a Price Estimate
            </h2>
            <div className="section-divider-decorated mb-6" />
            <p className="text-sm text-muted-foreground tracking-wide max-w-md mx-auto">
              Share a few details and photos. We'll send back an estimate of what your piece could be worth at Black & Brown.
              Bring it in to finalize the deal in person.
            </p>
          </div>

          {estimate && (
            <Card className="mb-8 border-foreground">
              <CardHeader className="text-center">
                <CardTitle className="font-serif text-xl font-light tracking-wide uppercase flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" /> Your Estimate
                </CardTitle>
                <div className="section-divider mt-4" />
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="font-serif text-3xl text-foreground">
                  ${estimate.price_low.toFixed(0)} – ${estimate.price_high.toFixed(0)}
                </p>
                <p className="text-xs tracking-nav uppercase text-muted-foreground">
                  Apparent condition: {estimate.condition}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  {estimate.reasoning}
                </p>
                <div className="section-divider my-4" />
                <p className="text-xs tracking-wide text-muted-foreground">
                  Visit us at 408 S 1st St, San Jose to finalize. We'll review your item in person.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-xl font-light tracking-wide uppercase">
                Item Details
              </CardTitle>
              <div className="section-divider mt-4" />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs tracking-wide uppercase">Your Name *</Label>
                    <Input
                      value={form.customer_name}
                      onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                      className="mt-1.5"
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs tracking-wide uppercase">Email *</Label>
                    <Input
                      type="email"
                      value={form.customer_email}
                      onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                      className="mt-1.5"
                      maxLength={255}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs tracking-wide uppercase">Phone (optional)</Label>
                    <Input
                      value={form.customer_phone}
                      onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                      className="mt-1.5"
                      maxLength={40}
                    />
                  </div>
                  <div>
                    <Label className="text-xs tracking-wide uppercase">Brand *</Label>
                    <Input
                      placeholder="Levi's, Polo, etc."
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="mt-1.5"
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs tracking-wide uppercase">Size *</Label>
                    <Input
                      placeholder="M, 32, 9.5, etc."
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="mt-1.5"
                      maxLength={40}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs tracking-wide uppercase">Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes', 'Bags'].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs tracking-wide uppercase">Use & Condition *</Label>
                    <Textarea
                      placeholder="Worn maybe 5 times, no flaws, fits true to size..."
                      value={form.use_description}
                      onChange={(e) => setForm({ ...form, use_description: e.target.value })}
                      className="mt-1.5 min-h-[100px]"
                      maxLength={1000}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs tracking-wide uppercase">Photos * (up to 4)</Label>
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
                        <label className="aspect-square border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors">
                          <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                          <span className="text-[10px] tracking-wide uppercase text-muted-foreground">Add Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFiles}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="minimal" className="w-full gap-2" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Get Estimate</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PriceCheck;
