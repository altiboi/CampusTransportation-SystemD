Architecture Report

Objective

The Campus Transportation App is designed to enhance mobility for students, faculty, and staff by providing efficient indoor and outdoor navigation services, managing campus transportation, and integrating rental services for bikes, scooters, and skateboards.

Key Features

- Interactive Maps: Detailed maps of buildings, lecture halls, amenities, and transportation routes.

- Real-Time GPS Tracking: Track campus shuttles, buses, and other transportation services.

- Accessibility Routes: Routes accommodating individuals with disabilities.

- Transportation Schedules: Display of schedules for campus shuttles and buses.

- Route Optimization: Suggestion of the best routes based on real-time data.

- Rental Services: Management and tracking of rental stations for bikes, scooters, and skateboards.

A. System Architecture

The system architecture will utilise a distributed, cloud-based client-server model based system, leveraging Firebase for backend services, Azure Functions for serverless computing, and various APIs for specific functionalities. Below is a high-level overview of the system architecture:

UI/UX Development
- User Dashboard: A centralised interface for accessing maps, real-time tracking, schedules, and rental services.
- Navigation Interface: Turn-by-turn navigation for walking and driving within the campus.
- Accessibility Options: Enhanced features for accessibility route management.
- Transportation Schedule Interface: Display and manage transportation schedules.
- Rental Service Interface: Interface for checking rental station availability and managing rentals.

API Development
- Map Data API: Manages map data, including buildings, routes, and amenities.
- GPS Tracking API: Provides real-time location tracking for transportation services.
- Accessibility API: Manages and retrieves data on accessible routes and facilities.
- Transportation Schedule API: Manages and retrieves transportation schedules.
- Route Optimization API: Suggests optimal routes based on current conditions.
- Rental Service API: Handles bike, scooter, and skateboard rentals, including availability and reservations.

Database Management
- Map Database: Stores detailed map data, buildings, routes, and points of interest. This will be stored in a no-sql database
- Transportation Database: Stores schedules, routes, and real-time tracking data.
- Accessibility Database: Stores data on accessible routes and facilities.
- User Routes Database: Manages user-specific routes, preferences, and navigation history.
- Rental Service Database: Manages data on rental stations, availability, and rental history.

Infrastructure
- Hosting and Scaling: Firebase is used for hosting, ensuring scalability to handle real-time data, especially during peak hours. Azure Functions are used for API management.
- Security: Robust security measures are implemented, including Firebase Authentication and integration with the campus-wide UserVerification API.
- Reliability: High availability and reliability are ensured through Firebase’s infrastructure, with minimal downtime.

Integration with External Systems(by use of other groups’ API’s)
- User Verification API: Integrates with a shared authentication system managed by using the campus tutoring’s within System D.
- Emergency Alert API & Incident reporting API: Integration with the campus safety system to send real-time emergency alerts and notifications and reroute the routes based on reported obstructions

B. Deployment Strategy

Firebase Hosting
The front-end components of the Campus Transportation App, including the User Dashboard and Navigation Interface, are hosted on Firebase Hosting. This platform supports high availability and rapid content delivery.

Azure Functions
The back-end logic, including API handling for vehicle rentals, location services, and route optimization, is managed through Azure Functions. This serverless architecture ensures scalability and cost-effectiveness.

Shared Database
A shared database within System D is used to manage user information for login purposes. As this system will be used as a component to the system, Communication between all members of System D will play a part in its creation. 

Individual Database
Transportation schedules, rentals etc will be handled in a NoSql database.
This is done because the app requires a database that can easily adapt to changes in data structure without the need for extensive migrations. NoSQL benefits from its schema-less nature,which allows us to store diverse data types and structures, accommodating various APIs and features such as rental services, transportation schedules, images, pdf’s and route optimization without rigid schema constraints.

C. Security and Privacy Considerations

Data Encryption
All data transmitted between the app and the servers are encrypted using SSL/TLS protocols to protect user privacy.

Authentication
User authentication is managed via Firebase Authentication, integrated with the campus-wide UserVerification API to provide seamless and secure access to all services.

Access Control
Role-based access controls are implemented to restrict access to certain features based on user roles (e.g., student, staff, admin).

D. Scalability and Performance

Real-Time Data Handling
The system is designed to handle real-time GPS tracking, schedule updates, and rental service management efficiently. Firebase and Azure Functions provide the necessary infrastructure to scale as needed.

Load Balancing
Firebase Hosting and Azure Functions inherently support load balancing to ensure consistent performance, even during peak usage times.

E. Reliability and Maintenance

System Monitoring
Firebase provides monitoring tools to track system performance, detect issues, and ensure high availability.

Maintenance
Regular updates and maintenance are planned to ensure the app stays up-to-date with the latest campus information, security patches, and feature enhancements.