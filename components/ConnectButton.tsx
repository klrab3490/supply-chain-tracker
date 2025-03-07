import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConnectButtonProps {
  isConnected: boolean;
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isLoading: boolean;
}

export default function ConnectButton({ isConnected, account, connectWallet, disconnectWallet, isLoading }: ConnectButtonProps) {
  const shortenAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div>
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">{shortenAddress(account)}</span>
          <Button onClick={disconnectWallet} variant="outline" size="sm">
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={connectWallet} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      )}
    </div>
  );
}
