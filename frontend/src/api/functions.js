import { auth, rentalservice_db,mapping_db , preference_db, db } from "../firebase/firebase.js";
import { Firestore,collection,getDoc, addDoc, setDoc,doc, updateDoc, getDocs, query, where } from "firebase/firestore";


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

