import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductType } from '@/app/page';

interface ProductDetailsProps {
  product: ProductType;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Details for product {product.productId}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Product ID</h3>
              <p className="mt-1 text-sm text-gray-900">{product.productId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-sm text-gray-900">{product.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Manufacturer</h3>
              <p className="mt-1 text-sm text-gray-900">{product.manufacturer}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Manufacture Date</h3>
              <p className="mt-1 text-sm text-gray-900">{product.manufactureDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Custodian</h3>
              <p className="mt-1 text-sm text-gray-900">{product.currentCustodian}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Location</h3>
              <p className="mt-1 text-sm text-gray-900">{product.currentLocation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {product.history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer History</CardTitle>
            <CardDescription>
              This product has been transferred {product.transferCount} times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {product.history.map((transfer, index) => (
                <div key={index} className="relative">
                  {index < product.history.length - 1 && (
                    <span className="absolute top-0 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  )}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <span className="text-xs font-medium text-white">{index + 1}</span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">
                            Transfer from {transfer.fromLocation} to {transfer.toLocation}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {transfer.timestamp}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>From: {transfer.from}</p>
                        <p>To: {transfer.to}</p>
                        {transfer.notes && (
                          <div className="mt-2">
                            <Badge variant="outline">Notes</Badge>
                            <p className="mt-1 text-gray-600">{transfer.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}