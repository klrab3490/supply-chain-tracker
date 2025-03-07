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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
const CONTRACT_ADDRESS = "0xD4Fc541236927E2EAf8F27606bD7309C1Fc2cbee"; 

export default function Home() {
  const [isAdmin, setAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
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
          console.log("Connected account:", accounts[0]);
          setIsConnected(true);
          if (accounts[0] === "0x63Fd440E5a0b48E2515765b857C6e35544C8F573") {
            setAdmin(true);
          }
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

  const disconnectWallet = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      setAccount(null);
      setIsConnected(false);
      setAdmin(false); // Reset admin state if applicable
    } catch (error: unknown) {
      setError("Failed to disconnect wallet: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      if (!contract) throw new Error("Contract not initialized");

      const products = await contract.getProducts(); // Fetch products

      if (!Array.isArray(products)) {
          throw new Error("Invalid product data received");
      }

      setProducts(products); // Correctly set state
      setSuccessMessage("Products fetched successfully");

    } catch (error: unknown) {
      console.error("Error fetching products:", error);
      setError("Fetching products failed: " + (error as Error).message);
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
      
      const tx = await connectedContract.addProduct(
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

      // Fetch product details
      const productInfo = await contract.getProduct(productId);
      
      const formattedProduct: ProductType = {
        productId: productInfo.productId,
        name: productInfo.name,
        manufacturer: productInfo.manufacturer,
        manufactureDate: productInfo.manufactureDate
          ? new Date(productInfo.manufactureDate.toNumber() * 1000).toLocaleString()
          : "N/A",
        currentCustodian: productInfo.currentCustodian,
        currentLocation: productInfo.currentLocation,
        transferCount: productInfo.transferCount ? productInfo.transferCount.toNumber() : 0,
        history: []
      };

      // 🔴 Note: `getTransferEvent` is not defined in your Solidity contract
      // You'll need to replace this with fetching event logs using web3
      if (formattedProduct.transferCount > 0) {
        for (let i = 0; i < formattedProduct.transferCount; i++) {
          try {
            const transferEvent = await contract.getTransferEvent(productId, i);
            formattedProduct.history.push({
              from: transferEvent.from,
              to: transferEvent.to,
              fromLocation: transferEvent.fromLocation,
              toLocation: transferEvent.toLocation,
              timestamp: new Date(transferEvent.timestamp.toNumber() * 1000).toLocaleString(),
              notes: transferEvent.notes
            });
          } catch (error) {
            console.warn(`Failed to fetch transfer event ${i}:`, error);
          }
        }
      }
      
      setProductDetails(formattedProduct);
      setSuccessMessage("Product verification successful!");
      
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
            disconnectWallet={disconnectWallet}
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
          <TabsList className={`grid w-full mb-8 ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="verify">Verify Product</TabsTrigger>
            <TabsTrigger value="register" disabled={!isConnected}>Register Product</TabsTrigger>
            <TabsTrigger value="transfer" disabled={!isConnected}>Transfer Product</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" onClick={fetchProducts}>Admin</TabsTrigger>
            )}
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

          <TabsContent value="admin">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Current Custodian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: ProductType, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{product.productId}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.manufacturer}</TableCell>
                    <TableCell>{product.currentCustodian}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}