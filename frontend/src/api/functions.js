import { auth, rentalservice_db , db } from "../firebase/firebase.js";
import { collection, getDocs , addDoc } from "firebase/firestore";


export const getAllVehicles = async () => {
    try {
        const vehiclesCollection = collection(rentalservice_db, "Vehicles");

       
        const vehiclesSnapshot = await getDocs(vehiclesCollection);
        const vehiclesList = vehiclesSnapshot.docs.map(doc => ({
            id: doc.id,  
            ...doc.data() 
        }));

        return vehiclesList;
    } catch (error) {
        console.error("Error fetching vehicles:", error.message);
        throw error;
    }
};

export const getNotifications = async () => {
    try {
        const notifsCollection = collection(db, "Notifications");

       
        const NotifSnapshot = await getDocs(notifsCollection);
        const notifsList = NotifSnapshot.docs.map(doc => ({
            id: doc.id,  
            ...doc.data() 
        }));
        console.log(notifsList)

        return notifsList;
    } catch (error) {
        console.error("Error fetching Notifications:", error.message);
        throw error;
    }
};

export const addVehicle = async (vehicle) => {
    try {
        const vehiclesCollection = collection(rentalservice_db, "Vehicles");

       
        const docRef = await addDoc(vehiclesCollection, {
            year: vehicle.year,
            available: true,
            registration: vehicle.registration,
            currentRentalID: "----",
            lastMaintenance: null,
            rentalStationID: vehicle.rentalStationID || "----",
            make: vehicle.make,
            model:vehicle.model,
            type: vehicle.type,
          });
      

          return {
            id: docRef.id,
            ...vehicle
          };
    } catch (error) {
        console.error("Error adding vehicles:", error.message);
        throw error;
    }
};

export const setNotificationAsRead = async (vehicle) => {
    try {
        
    } catch (error) {
        console.error("Error setting Notification as read:", error.message);
        throw error;
    }
};



