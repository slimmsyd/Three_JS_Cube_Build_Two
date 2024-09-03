export const cubeBank = {
    // "1": {
    //     file: "1.glb",
    //     icon: "1.png",
    //     eInt: 1
    // },
    // "2": {
    //     file: "2.glb",
    //     icon: "2.png",
    //     eInt: 1
    // },
    // "1": {
    //     file: "1.glb",
    //     icon: "1.png",
    //     eInt: 1
    // },
    // "3": {
    //     file: "3.glb",
    //     icon: "3.png",
    //     eInt: 1
    // },

    
    // "1": {
    //     file: "1.glb",
    //     icon: "1.png",
    //     eInt: 1
    // },
    // "2": {
    //     file: "2.glb",
    //     icon: "2.png",
    //     eInt: 1
    // },
    // "3": {
    //     file: "3.glb",
    //     icon: "3.png",
    //     eInt: 1
    // },

    
    
}



    



export function updateCubeBank(newData) {
    Object.assign(cubeBank, newData);
    console.log('Updated cubeBank:', cubeBank); // Log the updated cubeBank after population
}