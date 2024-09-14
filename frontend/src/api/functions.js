import { auth, rentalservice_db } from "../firebase/firebase.js";
import { collection, getDocs } from "firebase/firestore";


export const getAllVehicles = async () => {
    try {
        const vehiclesCollection = collection(rentalservice_db, "Vehicles");

       
        const vehiclesSnapshot = await getDocs(vehiclesCollection);

        // Map the documents to an array of objects
        const vehiclesList = vehiclesSnapshot.docs.map(doc => ({
            id: doc.id,  // Document ID
            ...doc.data() // Document data
        }));

        return vehiclesList;
    } catch (error) {
        console.error("Error fetching vehicles:", error.message);
        throw error;
    }
};
