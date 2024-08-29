// main.js
import { CubeViewer } from './CubeViewer.js';
// import { updateCubeBank } from './Database.js';

const cubeViewer = new CubeViewer();
cubeViewer.init();




document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const walletAddress = urlParams.get('address');

    if (walletAddress) {
        console.log('Wallet address received:', walletAddress);
        // Perform actions with the wallet address
    } else {
        console.error('No wallet address found in the URL.');
    }
});

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
