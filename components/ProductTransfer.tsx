// File: components/ProductTransfer.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { TransferFormData } from '@/app/page';

interface ProductTransferProps {
  onTransfer: (transferData: TransferFormData) => Promise<void>;
  isLoading: boolean;
  account: string | null;
}

export default function ProductTransfer({ onTransfer, isLoading }: ProductTransferProps) {
  const [formData, setFormData] = useState<TransferFormData>({
    productId: '',
    toAddress: '',
    fromLocation: '',
    toLocation: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTransfer(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Product</CardTitle>
        <CardDescription>
          Transfer ownership of a product to another party
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product ID</Label>
            <Input
              id="productId"
              placeholder="Enter product ID"
              value={formData.productId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toAddress">Recipient Address</Label>
            <Input
              id="toAddress"
              placeholder="Enter recipient's Ethereum address"
              value={formData.toAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromLocation">From Location</Label>
            <Input
              id="fromLocation"
              placeholder="Enter current location"
              value={formData.fromLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toLocation">To Location</Label>
            <Input
              id="toLocation"
              placeholder="Enter destination location"
              value={formData.toLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about this transfer"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferring
              </>
            ) : (
              "Transfer Product"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}