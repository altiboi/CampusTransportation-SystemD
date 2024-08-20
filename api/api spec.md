Map Data API
Purpose: CRUD operations for managing map data, including buildings, routes, and amenities.
Endpoints:
GET /api/maps/buildings: Retrieve all buildings.
POST /api/maps/buildings: Add a new building.
PUT /api/maps/buildings/:id: Update building information.
DELETE /api/maps/buildings/:id: Remove a building.
GET /api/maps/routes: Retrieve all routes.
POST /api/maps/routes: Add a new route.
PUT /api/maps/routes/:id: Update route information.
DELETE /api/maps/routes/:id: Remove a route.

GPS Tracking API
Purpose: Provide real-time location tracking for campus transportation services.
Endpoints:
GET /api/transportation/locations: Retrieve real-time locations of all vehicles.
GET /api/transportation/locations/:id: Retrieve real-time location of a specific vehicle.
POST /api/transportation/locations: Update real-time location (used by the transportation system).

Accessibility API
Purpose: Manage and provide data on accessible routes and facilities.
Endpoints:
GET /api/accessibility/routes: Retrieve all accessible routes.
POST /api/accessibility/routes: Add a new accessible route.
PUT /api/accessibility/routes/:id: Update accessible route information.
DELETE /api/accessibility/routes/:id: Remove an accessible route.
GET /api/accessibility/facilities: Retrieve all accessible facilities.

Transportation Schedule API
Purpose: Manage and retrieve transportation schedules and updates.
Endpoints:
GET /api/transportation/schedules: Retrieve all transportation schedules.
POST /api/transportation/schedules: Add a new schedule.
PUT /api/transportation/schedules/:id: Update schedule information.
DELETE /api/transportation/schedules/:id: Remove a schedule.

Rental Service API
Purpose: Handle rental availability, reservations, and returns.
Endpoints:
GET /api/rentals/stations: Retrieve all rental stations.
GET /api/rentals/stations/:id: Retrieve details of a specific rental station.
GET /api/rentals/availability: Check availability of bikes, scooters, etc.
POST /api/rentals/reserve: Reserve a bike/scooter/skateboard.
POST /api/rentals/return: Return a rented item.