// File: components/ProductRegistration.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ProductFormData } from '@/app/page';

interface ProductRegistrationProps {
  onRegister: (productData: ProductFormData) => Promise<void>;
  isLoading: boolean;
}

export default function ProductRegistration({ onRegister, isLoading }: ProductRegistrationProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    productId: '',
    name: '',
    manufacturer: '',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Product</CardTitle>
        <CardDescription>
          Add a new product to the blockchain supply chain
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product ID</Label>
            <Input
              id="productId"
              placeholder="Enter a unique product identifier"
              value={formData.productId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              placeholder="Enter manufacturer name"
              value={formData.manufacturer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Current Location</Label>
            <Input
              id="location"
              placeholder="Enter current location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering
              </>
            ) : (
              "Register Product"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

