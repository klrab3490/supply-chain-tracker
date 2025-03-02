"use client";

import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import ConnectButton from '@/components/ConnectButton';
import CONTRACT_ABI from '@/constants/contractABI.json';
import ProductDetails from '@/components/ProductDetails';
import ProductTransfer from '@/components/ProductTransfer';
import ProductRegistration from '@/components/ProductRegistration';
import ProductVerification from '@/components/ProductVerification'; 
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Type definitions
export interface ProductType {
  productId: string;
  name: string;
  manufacturer: string;
  manufactureDate: string;
  currentCustodian: string;
  currentLocation: string;
  transferCount: number;
  history: TransferEventType[];
}

export interface TransferEventType {
  from: string;
  to: string;
  fromLocation: string;
  toLocation: string;
  timestamp: string;
  notes: string;
}

export interface ProductFormData {
  productId: string;
  name: string;
  manufacturer: string;
  location: string;
}

export interface TransferFormData {
  productId: string;
  toAddress: string;
  fromLocation: string;
  toLocation: string;
  notes: string;
}

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; 

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<ProductType | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      const supplyChainContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        web3Provider
      );
      setContract(supplyChainContract);

      checkIfConnected(web3Provider);
    }
  }, []);

  const checkIfConnected = async (web3Provider: ethers.providers.Web3Provider) => {
    try {
      const accounts = await web3Provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (provider) {
          const accounts = await provider.listAccounts();
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } else {
        setError("MetaMask is not installed");
      }
    } catch (error: unknown) {
      setError("Failed to connect wallet: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const registerProduct = async (productData: ProductFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (!isConnected || !provider || !contract) throw new Error("Wallet not connected");
      
      const signer = provider.getSigner();
      const connectedContract = contract.connect(signer);
      
      const tx = await connectedContract.registerProduct(
        productData.productId,
        productData.name,
        productData.manufacturer,
        productData.location
      );
      
      await tx.wait();
      setSuccessMessage(`Product ${productData.productId} registered successfully!`);
    } catch (error: unknown) {
      setError("Registration failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const transferProduct = async (transferData: TransferFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (!isConnected || !provider || !contract) throw new Error("Wallet not connected");
      
      const signer = provider.getSigner();
      const connectedContract = contract.connect(signer);
      
      const tx = await connectedContract.transferProduct(
        transferData.productId,
        transferData.toAddress,
        transferData.fromLocation,
        transferData.toLocation,
        transferData.notes
      );
      
      await tx.wait();
      setSuccessMessage(`Product ${transferData.productId} transferred successfully!`);
    } catch (error: unknown) {
      setError("Transfer failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyProduct = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setProductDetails(null);
    
    try {
      if (!contract) throw new Error("Contract not initialized");
      
      const isAuthentic = await contract.verifyProduct(productId);
      
      if (isAuthentic) {
        const productInfo = await contract.getProductInfo(productId);
        const formattedProduct: ProductType = {
          productId: productInfo.productId,
          name: productInfo.name,
          manufacturer: productInfo.manufacturer,
          manufactureDate: new Date(productInfo.manufactureDate.toNumber() * 1000).toLocaleString(),
          currentCustodian: productInfo.currentCustodian,
          currentLocation: productInfo.currentLocation,
          transferCount: productInfo.transferCount.toNumber(),
          history: []
        };
        
        // Get transfer history
        for (let i = 0; i < formattedProduct.transferCount; i++) {
          const transferEvent = await contract.getTransferEvent(productId, i);
          formattedProduct.history.push({
            from: transferEvent.from,
            to: transferEvent.to,
            fromLocation: transferEvent.fromLocation,
            toLocation: transferEvent.toLocation,
            timestamp: new Date(transferEvent.timestamp.toNumber() * 1000).toLocaleString(),
            notes: transferEvent.notes
          });
        }
        
        setProductDetails(formattedProduct);
        setSuccessMessage("Product verification successful!");
      } else {
        setError("Product not found or not authentic");
      }
    } catch (error: unknown) {
      setError("Verification failed: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">BlockChain Supply Chain</h1>
          <ConnectButton 
            isConnected={isConnected} 
            account={account} 
            connectWallet={connectWallet}
            isLoading={isLoading}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-400">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="verify" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="verify">Verify Product</TabsTrigger>
            <TabsTrigger value="register" disabled={!isConnected}>Register Product</TabsTrigger>
            <TabsTrigger value="transfer" disabled={!isConnected}>Transfer Product</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verify">
            <ProductVerification 
              onVerify={verifyProduct} 
              isLoading={isLoading}
            />
            
            {productDetails && (
              <ProductDetails product={productDetails} />
            )}
          </TabsContent>
          
          <TabsContent value="register">
            <ProductRegistration 
              onRegister={registerProduct} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="transfer">
            <ProductTransfer 
              onTransfer={transferProduct} 
              isLoading={isLoading}
              account={account}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}