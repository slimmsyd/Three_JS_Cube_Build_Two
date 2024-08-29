// main.js
import { CubeViewer } from './CubeViewer.js';
// import { updateCubeBank } from './Database.js';

const cubeViewer = new CubeViewer();
cubeViewer.init();




document.addEventListener('DOMContentLoaded', () => {
    // Get the full URL
    const urlParams = new URLSearchParams(window.location.search);
  
    // Retrieve a specific parameter, e.g., 'address'
    const walletAddress = urlParams.get('address');
  
    if (walletAddress) {
      console.log('Wallet address from URL:', walletAddress);
  
      // Now that you have the wallet address, you can use it as needed
      fetchWalletAddressData(walletAddress);
    } else {
      console.error('No wallet address found in the URL.');
    }
  });
  
  // Function to fetch wallet data using the wallet address
  const fetchWalletAddressData = async (walletAddress) => {
    try {
      // Construct the request URL with the wallet address as a query parameter
      const response = await fetch(
        `https://creature-cubes-express-api.vercel.app/nft-mint?address=${encodeURIComponent(walletAddress)}`
      );
      const data = await response.json();
  
      console.log('Data received from the server:', data);
      // Process the data as needed
    } catch (error) {
      console.error('Error fetching wallet data from server:', error);
    }
  };
  
  // Function to fetch the wallet address from an external server (if needed)
  const fetchWalletAddressFromExternalServer = async () => {
    try {
      const response = await fetch("https://creature-cubes-express-api.vercel.app/nft-mints");
      const data = await response.json();
  
      console.log("Logging the data from external server:", data);
      // Assuming the server returns a wallet address, return it
      // return data.walletAddress || null;
    } catch (error) {
      console.error("Error fetching wallet address from external server:", error);
      return null;
    }
  };
  
  // Example call for fetching the wallet address from an external server
  // fetchWalletAddressFromExternalServer();
  

// Function to fetch the wallet address from the external server
// async function fetchWalletAddress() {
//     const url = "https://three-js-cube-build-two.vercel.app/wallet";
    
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         const data = await response.json();
//         const walletAddress = data.walletAddress;
//         console.log("Wallet address received:", walletAddress);
//         return walletAddress;
//     } catch (error) {
//         console.error('Error fetching wallet address:', error);
//         return null;
//     }
// }

// // Main script initialization
// window.initMainScript = async function() {
//     const walletAddress = await fetchWalletAddress();
    
//     if (walletAddress) {
//         console.log("Initializing main script with wallet address:", walletAddress);
//         // Initialize CubeViewer or any other logic
        
//         await fetchAndUpdateCubeBank(walletAddress);
//     } else {
//         console.error("Failed to retrieve wallet address. Initialization aborted.");
//     }
// };

// // Example usage: Automatically initialize the main script
// window.initMainScript();
