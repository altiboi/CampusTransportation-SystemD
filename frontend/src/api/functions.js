import { auth, rentalservice_db , db } from "../firebase/firebase.js";
import { collection, addDoc, doc, updateDoc, getDocs, getDoc, query, where } from "firebase/firestore";


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

export const addNewRentalAndUpdateVehicle = async (rentalStationID, type, userID, vehicleID, rentalDurationInHours) => {
  try {
      // Get the current time for rentedAt
      const rentedAt = new Date();

      // Calculate dueReturnAt based on rental duration in hours
      const dueReturnAt = new Date();
      dueReturnAt.setHours(rentedAt.getHours() + rentalDurationInHours);

      // Prepare rental data
      const rentalData = {
          dueReturnAt: dueReturnAt.toUTCString(), // Store in UTC format
          rentedAt: rentedAt.toUTCString(),
          returnedAt: null, // Not yet returned
          rentalStationID,
          type,
          userID,
          vehicleID
      };

      // Reference to the "VehicleRentals" collection
      const rentalsCollection = collection(rentalservice_db, "VehicleRentals");

      // Add the new rental document
      const rentalDocRef = await addDoc(rentalsCollection, rentalData);
      
      console.log("New rental added with ID: ", rentalDocRef.id);

      // Update the corresponding vehicle document
      const vehicleDocRef = doc(rentalservice_db, "Vehicles", vehicleID);

      await updateDoc(vehicleDocRef, {
          available: false, // Set the vehicle as unavailable
          currentRentalID: rentalDocRef.id // Link the new rental to the vehicle
      });

      console.log("Vehicle updated successfully!");
      
      return {
          rentalID: rentalDocRef.id,
          ...rentalData
      };
  } catch (error) {
      console.error("Error adding rental or updating vehicle:", error.message);
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

export const getAllRentals = async () => {
  try {
      const rentalsCollection = collection(rentalservice_db, "VehicleRentals");

      const rentalSnapshot = await getDocs(rentalsCollection);
      const rentalsList = rentalSnapshot.docs.map(doc => ({
          id: doc.id,  
          ...doc.data() 
      }));

      return rentalsList;
  } catch (error) {
      console.error("Error fetching rentals:", error.message);
      throw error;
  }
};

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
      //console.log(notifsList)

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

    // Loop through each user and filter based on the Audience type
    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();

      // Check if the user should receive the notification based on their role and the audience
      const userRole = userData.role; // Assuming 'role' field exists in the user document

      // Determine whether to add the notification to the user
      const isInAudience = (notification.Audience === "Everyone") ||
                           (notification.Audience === "Staff" && userRole === "staff") ||
                           (notification.Audience === "Users" && userRole === "user");

      if (isInAudience) {
        // Ensure the user has a 'readNotification' field initialized as an array
        const readNotifications = userData.userNotifications || [];

        // Add the newly created notification object to the user's 'readNotification' array
        const updatedReadNotifications = [
          ...readNotifications,
          { id: docRef.id, isRead: false } // Add the notification ID and isRead:false
        ];

        // Update the user's document with the new 'readNotification' array
        await updateDoc(doc(db, 'Users', userDoc.id), {
          userNotifications: updatedReadNotifications
        });
      }
    });

    return docRef.id;

  } catch (error) {
    console.error("Error creating notification or updating users:", error.message);
    throw error;
  }
};

export const setNotificationAsRead = async (userId, notificationId) => {
  try {
    // Fetch the user's document from the 'Users' collection
    const userDocRef = doc(db, 'Users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    // Get the user's notifications
    const userData = userDoc.data();
    const userNotifications = Array.isArray(userData.userNotifications) ? userData.userNotifications : [];

    // Find the notification index to update
    const notificationIndex = userNotifications.findIndex(n => n.id === notificationId);

    if (notificationIndex === -1) {
      throw new Error("Notification not found");
    }

    // Update the isRead status of the notification
    userNotifications[notificationIndex].isRead = true;

    // Write the updated notifications back to Firestore
    await updateDoc(userDocRef, {
      userNotifications: userNotifications,
    });

    console.log("Notification marked as read:", notificationId);
  } catch (error) {
    console.error("Error setting notification as read:", error.message);
    throw error;
  }
};

export const fetchUserNotifications = async (userId) => {
    try {
      // Fetch the user's document from the 'Users' collection
      const userDocRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
  
      // Get the user's notifications (assumes 'userNotification' field exists)
      const userData = userDoc.data();
      const userNotifications = Array.isArray(userData.userNotifications) ? userData.userNotifications : []; // Ensure it's an array

      //console.log(userNotifications)
      // Prepare an array to hold the fetched notification objects
      const notifications = [];
  
      // Loop through each notification in the 'userNotification' array and fetch the notification details
      for (const notification of userNotifications) {
        if (notification.id) { // Ensure that notification.id is defined
          const notificationDocRef = doc(db, 'Notifications', notification.id);
          const notificationDoc = await getDoc(notificationDocRef);
  
          if (notificationDoc.exists()) {
            // Add the notification details along with the isRead field
            notifications.push({
              ...notificationDoc.data(),
              isRead: notification.isRead,
              id: notification.id
            });
          }
        }
      }

      notifications.sort((a, b) => new Date(b.Date) - new Date(a.Date));
  
      // Return the list of notifications for the user
      return notifications;
  
    } catch (error) {
      console.error("Error fetching user notifications:", error.message);
      throw error;
    }
  };  
  

//Bus Schedules

export const fetchBusRoutes = async () => {
  try {
    const today = new Date().getDay();
    const dayType = today === 0 || today === 6 ? "weekend" : "weekday"; // Check if today is a weekend

    const q = query(collection(db, "Bus-Schedules"), where("day_type", "==", dayType));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      let routes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If it's a weekend, filter the schedules for Saturday or Sunday
      if (dayType === "weekend") {
        const isSaturday = today === 6;
        const isSunday = today === 0;

        routes = routes.map(route => {
          // For each route, filter the schedule if 'day' field exists (only for weekend days)
          route.routes = route.routes.map(r => {
            r.schedule = r.schedule.filter(schedule => {
              // If schedule has a 'day' field, match it with today (Saturday/Sunday)
              if (schedule.day) {
                return (isSaturday && schedule.day === "Saturday") || (isSunday && schedule.day === "Sunday");
              }
              // If no 'day' field, it applies to the entire weekend
              return true;
            });
            return r;
          });
          return route;
        });
      }

      return routes;
    } else {
      console.log("No documents found for the specified day type.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching bus routes:", error);
  }
};
