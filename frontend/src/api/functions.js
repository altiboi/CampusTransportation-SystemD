import { auth, rentalservice_db,mapping_db , preference_db, db } from "../firebase/firebase.js";
import { Firestore,collection,getDoc, addDoc, setDoc, doc, updateDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";


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
      // Check if the user already has an active rental
      const userDocRef = doc(db, "Users", userID);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
          throw new Error("User not found");
      }

      const userData = userDoc.data();
      
      // Check if the user already has a current rental that is not yet returned
      if (userData.currentRentalID) {
          const currentRentalDocRef = doc(rentalservice_db, "VehicleRentals", userData.currentRentalID);
          const currentRentalDoc = await getDoc(currentRentalDocRef);

          if (currentRentalDoc.exists() && !currentRentalDoc.data().returnedAt) {
              // User already has an active rental that hasn't been returned
              throw new Error("User already has an active rental. Please return the current vehicle before making a new rental.");
          }
      }

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

      // Update the user document with the currentRentalID
      await updateDoc(userDocRef, {
          currentRentalID: rentalDocRef.id
      });

      console.log("User's current rental updated successfully!");
      
      return {
          rentalID: rentalDocRef.id,
          ...rentalData
      };
  } catch (error) {
      console.error("Error adding rental or updating vehicle:", error.message);
      throw error;
  }
};

export const returnVehicleAndIssueFine = async (rentalID, vehicleID) => {
  try {
    // Get the current time for returnedAt
    const returnedAt = new Date();

    // Reference to the "VehicleRentals" collection and the specific rental
    const rentalDocRef = doc(rentalservice_db, "VehicleRentals", rentalID);
    const rentalDoc = await getDoc(rentalDocRef);

    if (!rentalDoc.exists()) {
      throw new Error("Rental not found");
    }

    const rentalData = rentalDoc.data();
    const dueReturnAt = new Date(rentalData.dueReturnAt); // Convert dueReturnAt back to Date object

    // Calculate the time difference between dueReturnAt and returnedAt in milliseconds
    const timeDifference = returnedAt - dueReturnAt;
    
    // Convert the time difference to hours
    const differenceInHours = timeDifference / (1000 * 60 * 60); 

    // Initialize fine amount
    let fineAmount = 0;

    // If the return is late (more than 10 minutes after dueReturnAt)
    if (differenceInHours > (10 / 60)) {
      // Calculate fine: R50 for every hour late
      fineAmount = Math.ceil(differenceInHours) * 50;
    }

    // Update the rental with returnedAt
    await updateDoc(rentalDocRef, {
      returnedAt: returnedAt.toUTCString(),
    });

    // Update the vehicle to mark it as available again
    const vehicleDocRef = doc(rentalservice_db, "Vehicles", vehicleID);
    await updateDoc(vehicleDocRef, {
      available: true,
      currentRentalID: null, // Remove the rental reference from the vehicle
    });

   // Update the user document to clear currentRentalID
   const userDocRef = doc(db, "Users", rentalData.userID);
   const userDoc = await getDoc(userDocRef);

   if (userDoc.exists()) {
     // Clear the user's currentRentalID
     await updateDoc(userDocRef, {
       currentRentalID: null
     });
   } else {
     throw new Error("User not found");
   }

   console.log("User's current rental cleared successfully!");

    // If there is a fine, create a fine document
    let fineData = null;
    if (fineAmount > 0) {
      const finesCollection = collection(rentalservice_db, "RentalFines");

      fineData = {
        rentalID,
        vehicleID,
        userID: rentalData.userID,
        amount: fineAmount,
        issuedAt: returnedAt.toUTCString(),
        paid: false, // Fine is unpaid by default
      };

      // Add the fine document to the "Fines" collection
      const fineDocRef = await addDoc(finesCollection, fineData);
      // Add the fine document ID to the fineData
      fineData.id = fineDocRef.id;

      console.log("Fine issued with ID:", fineDocRef.id);
    }

    return {
      rentalDetails: {
        ...rentalData,
        returnedAt: returnedAt.toUTCString(),
      },
      fine: fineData, // Fine data or null
    };

  } catch (error) {
    console.error("Error returning vehicle or issuing fine:", error.message);
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

export const getRentalDetails = async (rentalID) => {
  try {
    // Fetch the rental document
    const rentalDocRef = doc(rentalservice_db, "VehicleRentals", rentalID);
    const rentalDoc = await getDoc(rentalDocRef);

    if (!rentalDoc.exists()) {
      throw new Error("Rental not found");
    }

    const rentalData = rentalDoc.data();

    // Fetch the vehicle document using vehicleID from rentalData
    const vehicleDocRef = doc(rentalservice_db, "Vehicles", rentalData.vehicleID);
    const vehicleDoc = await getDoc(vehicleDocRef);

    if (!vehicleDoc.exists()) {
      throw new Error("Vehicle not found");
    }

    const vehicleData = vehicleDoc.data();

    // Fetch the rental station document using rentalStationID from rentalData
    const rentalStationDocRef = doc(rentalservice_db, "RentalStation", rentalData.rentalStationID);
    const rentalStationDoc = await getDoc(rentalStationDocRef);

    if (!rentalStationDoc.exists()) {
      throw new Error("Rental station not found");
    }

    const rentalStationData = rentalStationDoc.data();

    // Return rental details along with vehicle and rental station data
    return {
      rentalID: rentalDocRef.id,
      ...rentalData,  // Include all rental data
      vehicle: {
        vehicleID: vehicleDocRef.id,
        ...vehicleData,  // Include all vehicle data
      },
      rentalStation: {
        rentalStationID: rentalStationDocRef.id,
        ...rentalStationData,  // Include all rental station data
      }
    };
  } catch (error) {
    console.error("Error fetching rental details:", error.message);
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
    // Query the RentalFines collection based on userID
    const finesQuery = query(
      collection(rentalservice_db, 'RentalFines'),
      where("userID", "==", userID)
    );
    const querySnapshot = await getDocs(finesQuery);
    
    // Map through the fines to fetch rental details
    const finesWithRentalDetails = await Promise.all(
      querySnapshot.docs.map(async (fineDoc) => {
        const fineData = fineDoc.data();

        // Fetch rental details using rentalID
        const rentalDocRef = doc(rentalservice_db, 'VehicleRentals', fineData.rentalID); // Adjust collection name if necessary
        const rentalDocSnap = await getDoc(rentalDocRef);

        const rentalDetails = rentalDocSnap.exists() ? rentalDocSnap.data() : null;

        // Return the fine details along with the rental details
        return {
          id: fineDoc.id,
          ...fineData,
          rentalDetails, // Include rental details in the response
        };
      })
    );

    return finesWithRentalDetails;
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

export const getAllFines = async () => {
  const fines = [];
  try {
      const finesCollection = collection(rentalservice_db, 'RentalFines');
      const querySnapshot = await getDocs(finesCollection);

      for (const fineDoc of querySnapshot.docs) {
          const fineData = fineDoc.data();
          const vehicleDocRef = doc(rentalservice_db, 'Vehicles', fineData.vehicleID);
          const vehicleDoc = await getDoc(vehicleDocRef);
          const userDocRef = doc(db, 'Users', fineData.userID);
          const userDoc = await getDoc(userDocRef);


          if (vehicleDoc.exists()) {
              fines.push({ id: fineDoc.id, vehicleReg: vehicleDoc.data().registration, vehicleType: vehicleDoc.data().type, user: userDoc.data().name + " " + userDoc.data().surname, ...fineData });
          } else {
              console.error("Vehicle not found:", fineData.vehicleID);
          }
      }
  } catch (error) {
      console.error("Error fetching fines:", error);
  }
  return fines;
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
      SenderID: notification.SenderID,
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

      // Exclude the user who created the notification
      const isNotSender = userDoc.id !== notification.SenderID;

      if (isInAudience && isNotSender) {
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
  
      // Prepare an array to hold the notifications created by the user
    const createdNotifications = [];

    // If the user is a staff member, fetch the notifications they created
    if (userData.role === "staff") {
      const createdNotificationsSnapshot = await getDocs(
        query(collection(db, 'Notifications'), where('SenderID', '==', userId))
      );

      createdNotificationsSnapshot.forEach((doc) => {
        createdNotifications.push({
          ...doc.data(),
          isRead: true,
          id: doc.id
        });
      });

      createdNotifications.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    }

    // Return the list of notifications for the user and the list of notifications they created
    return {
      receivedNotifications: notifications,
      createdNotifications: createdNotifications
    };
  
    } catch (error) {
      console.error("Error fetching user notifications:", error.message);
      throw error;
    }
  };  
  
export const deleteNotification = async (notificationId) => {
    try {
      // Delete the notification from the 'Notifications' collection
      await deleteDoc(doc(db, 'Notifications', notificationId));
      console.log(`Notification with ID: ${notificationId} deleted from Notifications collection`);
  
      // Fetch all user documents from the 'Users' collection
      const usersSnapshot = await getDocs(collection(db, 'Users'));
  
      // Loop through each user and remove the notification from their 'userNotifications' field
      usersSnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        const userNotifications = userData.userNotifications || [];
  
        // Filter out the notification to be deleted
        const updatedNotifications = userNotifications.filter(notification => notification.id !== notificationId);
  
        // Update the user's document with the new 'userNotifications' array
        await updateDoc(doc(db, 'Users', userDoc.id), {
          userNotifications: updatedNotifications
        });
      });
  
    } catch (error) {
      console.error("Error deleting notification:", error.message);
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

  export const getAllRentalStations= async () => {
    try {
        const rentalCollection = collection(rentalservice_db, "RentalStation");
        const rentalsSnapshot = await getDocs(rentalCollection);
        const rentalList = rentalsSnapshot.docs.map(doc => {
            const data = doc.data();
            
            return {
                name: data.name,
                location: data.location ? {
                    latitude: data.location._lat || null,
                    longitude: data.location._long || null,
                } : null,
            };
        });
     
        return rentalList;
    } catch (error) {
        console.error("Error fetching rental stations:", error.message);
        throw error;
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

            // Check if accessible_entrances is an array before mapping
            const accessibleList = Array.isArray(data?.accessible_entrances)
                ? data.accessible_entrances.map((entrance) => ({
                    latitude: entrance?._lat ?? null,  
                    longitude: entrance?._long ?? null, 
                }))
                : []; // If not an array, return an empty array

            return {
                name: doc.id,
                coordinates: data?.Coordinates ? {
                    latitude: data?.Coordinates?._lat ?? null,
                    longitude: data?.Coordinates?._long ?? null,
                } : null,
                accessible_entrances: accessibleList.length > 0 ? accessibleList : null, // Only include if accessible entrances exist
            };
        });
       
        // Get all points of interest
        const poiSnapshot = await getDocs(poiCollection);
        const poiList = poiSnapshot.docs.map(doc => {
            const data = doc.data();

            // Check if accessible_entrances is an array before mapping
            const accessibleListPOI = Array.isArray(data?.accessible_entrances)
                ? data.accessible_entrances.map((entrance) => ({
                    latitude: entrance?._lat ?? null,  
                    longitude: entrance?._long ?? null, 
                }))
                : []; // If not an array, return an empty array

            return {
                name: doc.id,
                category: data?.Category ?? "Unknown", // Provide fallback for category
                coordinates: data?.Coordinates ? {
                    latitude: data?.Coordinates?._lat ?? null,
                    longitude: data?.Coordinates?._long ?? null,
                } : null,
                accessible_entrances: accessibleListPOI.length > 0 ? accessibleListPOI : null,
            };
        });

        // Combine buildings and POIs into a single list
        const allLocations = [...buildingsList, ...poiList];

        return allLocations;
    } catch (error) {
        console.error("Error fetching locations:", error.message);
        throw error;
    }
};

export const addToFavourites = async (email, destinationName) => {
  try {
    // Reference the "users" collection to get the user document
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('email', '==', email)); // Query where email matches
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    // Retrieve the user's ID from the document (assuming uid is stored there)
    let userID;
    querySnapshot.forEach((doc) => {
      userID = doc.id; // Get the userID from the document ID
    });

    // Reference to the "preferences" collection in the database
    const preferencesRef = doc(preference_db, 'preferences', userID);

    // Check if the user's preferences document exists
    const preferencesSnapshot = await getDoc(preferencesRef);
    if (!preferencesSnapshot.exists()) {
      // Create a new document in "preferences" with favorite destinations
      await setDoc(preferencesRef, {
        userID: userID,
        favouriteDestinations: [destinationName],
      });
    } else {
      // Update the existing document by appending the destination if it's not already present
      const { favouriteDestinations } = preferencesSnapshot.data();
      if (!favouriteDestinations.includes(destinationName)) {
        await updateDoc(preferencesRef, {
          favouriteDestinations: [...favouriteDestinations, destinationName],
        });
      }
    }
    console.log("Destination added to favourites.");
  } catch (error) {
    console.error("Error saving destination:", error);
  }
};

export const getFavourites = async (email) => {
  try {
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('email', '==', email)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    let userID;
    querySnapshot.forEach((doc) => {
      userID = doc.id; // Get the userID from the document ID
    });
    const preferencesRef = doc(preference_db, 'preferences', userID);
    const preferencesSnapshot = await getDoc(preferencesRef);
    if (!preferencesSnapshot.exists()) {
      return [];
    } else {
      const { favouriteDestinations } = preferencesSnapshot.data();
      // Parse the strings back into objects
      const parsedDestinations = favouriteDestinations.map(dest => JSON.parse(dest));
      
      console.log(parsedDestinations);
      return parsedDestinations;
    }
  } catch (error) {
    console.error("Error getting destination:", error);
  }
};

