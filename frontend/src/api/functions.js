import { auth, rentalservice_db , db , mapping_db, } from "../firebase/firebase.js";
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

export const getUserRentals = async (userID) => {
  try {
      const rentalsCollection = collection(rentalservice_db, "VehicleRentals");
      
      // Query to filter rentals by userID
      const userRentalsQuery = query(rentalsCollection, where("userID", "==", userID));

      // Fetch rentals based on the query
      const rentalsSnapshot = await getDocs(userRentalsQuery);
      const rentalsList = rentalsSnapshot.docs.map(doc => ({
          id: doc.id,  
          ...doc.data() 
      }));

      return rentalsList;
  } catch (error) {
      console.error("Error fetching user rentals:", error.message);
      throw error;
  }
};

export const fetchUserFines = async (userID) => {
  try {
    const finesQuery = query(collection(rentalservice_db, 'RentalFines'), where("userID", "==", userID));
    const querySnapshot = await getDocs(finesQuery);
    const fines = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return fines;
  } catch (error) {
    console.error("Error fetching fines: ", error);
    return [];
  }
};

export const handleFinePayment = async (fineID) => {
  try {
    const fineRef = doc(rentalservice_db, "RentalFines", fineID);
    await updateDoc(fineRef, { paid: true });
    console.log(`Fine ${fineID} has been paid.`);
  } catch (error) {
    console.error("Error processing fine payment: ", error);
  }
};

//Notifications

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

  //Bus Schedules
  
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

  export const getAllLocations = async () => {
    try {
        const buildingsCollection = collection(mapping_db, "Buildings");
        const poiCollection = collection(mapping_db, "Points of Interest");

        // Get all buildings
        const buildingsSnapshot = await getDocs(buildingsCollection);
        const buildingsList = buildingsSnapshot.docs.map(doc => {
            const data = doc.data();
            
            return {
                name: doc.id,
                coordinates: data.Coordinates ? {
                    latitude: data.Coordinates._lat || null,
                    longitude: data.Coordinates._long || null,
                } : null,
            };
        });
       

        // Get all points of interest
        const poiSnapshot = await getDocs(poiCollection);
    
        const poiList = poiSnapshot.docs.map(doc => {
            const data = doc.data();
            

            //console.log(doc.id + " " +data)
            return {
                name: doc.id,
                category: data.Category || "Unknown",
                coordinates: data.Coordinates ? {
                    latitude: data.Coordinates._lat|| null,
                    longitude: data.Coordinates._long || null,
                } : null,
            };
        });
        

        // Combine buildings and POIs into a single list
        const allLocations = [...buildingsList, ...poiList];
        console.log(allLocations)
   
        

        return allLocations;
    } catch (error) {
        console.error("Error fetching locations:", error.message);
        throw error;
    }
};

