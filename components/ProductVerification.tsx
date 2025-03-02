// File: components/ProductVerification.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ProductVerificationProps {
  onVerify: (productId: string) => Promise<void>;
  isLoading: boolean;
}

export default function ProductVerification({ onVerify, isLoading }: ProductVerificationProps) {
  const [productId, setProductId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(productId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Product</CardTitle>
        <CardDescription>
          Check authenticity and view the complete history of a product
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="verifyProductId">Product ID</Label>
            <div className="flex space-x-2">
              <Input
                id="verifyProductId"
                placeholder="Enter product ID to verify"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}