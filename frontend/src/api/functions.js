import { auth, rentalservice_db , db } from "../firebase/firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";


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
            currentRentalID: null,
            lastMaintenance: null,
            rentalStationID: vehicle.location,
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

export const fetchRentalStations = async () => {
    const rentalStationsRef = collection(rentalservice_db, "RentalStation");
    const rentalStationsSnapshot = await getDocs(rentalStationsRef);
  
    const rentalStationsList = rentalStationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  
    return rentalStationsList;
}

export const createNotification = async (notification) => {
    try {
      const notificationData = {
        Audience: notification.Audience,
        Body: notification.Body,
        Date: notification.Date,
        Sender: notification.Sender,
        Title: notification.Title
      };
  
      // Add the notification to the Firestore 'Notifications' collection
      const docRef = await addDoc(collection(db, 'Notifications'), notificationData);
      console.log("Notification added with ID: ", docRef.id);
  
      // Fetch all user documents from the 'Users' collection
      const usersSnapshot = await getDocs(collection(db, 'Users'));
  
      // Loop through each user and update their 'readNotification' property
      usersSnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
  
        // Ensure the user has a 'readNotification' field initialized as an array
        const readNotifications = userData.readNotification || [];
  
        // Add the newly created notification object to the user's 'readNotification' array
        const updatedReadNotifications = [
          ...readNotifications, 
          { id: docRef.id, isRead: false }  // Add the notification ID and isRead:false
        ];
  
        // Update the user's document with the new 'readNotification' array
        await updateDoc(doc(db, 'Users', userDoc.id), {
          userNotification: updatedReadNotifications
        });
  
        console.log(`Updated user ${userDoc.id} with new read notification: { id: ${docRef.id}, isRead: false }`);
      });
  
      return docRef.id;
  
    } catch (error) {
      console.error("Error creating notification or updating users:", error.message);
      throw error;
    }
  };
export const setNotificationAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
      });
    } catch (error) {
      console.error("Error setting notification as read:", error);
    }
  };
  
  export const fetchBusRoutes = async () => {
    try {
      const today = new Date().getDay();
      const dayType = today === 0 || today === 6 ? "weekend" : "weekday";
      const q = query(collection(db, "Bus-Schedules"), where("day_type", "==", dayType));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const routes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return routes;
      } else {
        console.log("No documents found for the specified day type.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching bus routes:", error);
    }
  };
