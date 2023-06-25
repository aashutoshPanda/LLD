class Location {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  calculateDistance(otherLocation) {
    const dx = this.x - otherLocation.x;
    const dy = this.y - otherLocation.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }
}

class Rider {
  constructor(name) {
    this.name = name;
    this.history = [];
  }

  bookCab(location, maxDistance) {
    // Find an available cab within the maximum distance
    const availableCab = CabRegistry.findNearestAvailableCab(
      location,
      maxDistance
    );

    if (availableCab) {
      const trip = new Trip(this, availableCab, location);
      availableCab.setAvailability(false);
      this.history.push(trip);
      return trip;
    } else {
      console.log("No available cabs found.");
      return null;
    }
  }

  getRideHistory() {
    return this.history;
  }
}

class Driver {
  constructor(name) {
    this.name = name;
    this.available = false;
    this.currentLocation = null;
  }

  setAvailability(available) {
    this.available = available;
  }

  updateLocation(location) {
    this.currentLocation = location;
  }
}

class Cab {
  constructor(driver) {
    this.driver = driver;
    this.available = true;
    this.currentLocation = null;
  }

  setAvailability(available) {
    this.available = available;
  }

  updateLocation(location) {
    this.currentLocation = location;
  }
}

class Trip {
  constructor(rider, cab, destination) {
    this.rider = rider;
    this.cab = cab;
    this.destination = destination;
    this.startTime = new Date();
    this.endTime = null;
  }

  endTrip() {
    this.endTime = new Date();
    this.cab.setAvailability(true);
  }
}

class CabRegistry {
  static cabs = [];

  static registerCab(cab) {
    this.cabs.push(cab);
  }

  static findNearestAvailableCab(location, maxDistance) {
    let nearestCab = null;
    let minDistance = Infinity;

    for (const cab of this.cabs) {
      if (cab.available && cab.currentLocation) {
        const distance = location.calculateDistance(cab.currentLocation);
        if (distance < minDistance && distance <= maxDistance) {
          nearestCab = cab;
          minDistance = distance;
        }
      }
    }

    return nearestCab;
  }
}

function main() {
  // Create riders
  const rider1 = new Rider("John");
  const rider2 = new Rider("Emily");

  // Create drivers and register cabs
  const driver1 = new Driver("Mike");
  const cab1 = new Cab(driver1);
  CabRegistry.registerCab(cab1);

  const driver2 = new Driver("Sarah");
  const cab2 = new Cab(driver2);
  CabRegistry.registerCab(cab2);

  // Update cab locations
  cab1.updateLocation(new Location(10, 10));
  cab2.updateLocation(new Location(5, 5));

  // Set driver availability
  driver1.setAvailability(true);
  driver2.setAvailability(true);

  // Rider1 books a cab
  const destination1 = new Location(20, 20);
  const trip1 = rider1.bookCab(destination1, 15);

  if (trip1) {
    console.log(`Trip 1 booked by ${rider1.name}`);
    console.log(`Driver: ${trip1.cab.driver.name}`);
    console.log(
      `Destination: (${trip1.destination.x}, ${trip1.destination.y})`
    );

    // End the trip
    trip1.endTrip();
    console.log(`Trip 1 ended at ${trip1.endTime}`);

    // Get rider1's ride history
    const rider1History = rider1.getRideHistory();
    console.log(`Rider1's Ride History:`);
    for (const trip of rider1History) {
      console.log(`Start Time: ${trip.startTime}, End Time: ${trip.endTime}`);
    }
  }

  // Rider2 books a cab
  const destination2 = new Location(30, 30);
  const trip2 = rider2.bookCab(destination2, 10);

  if (trip2) {
    console.log(`Trip 2 booked by ${rider2.name}`);
    console.log(`Driver: ${trip2.cab.driver.name}`);
    console.log(
      `Destination: (${trip2.destination.x}, ${trip2.destination.y})`
    );

    // End the trip
    trip2.endTrip();
    console.log(`Trip 2 ended at ${trip2.endTime}`);

    // Get rider2's ride history
    const rider2History = rider2.getRideHistory();
    console.log(`Rider2's Ride History:`);
    for (const trip of rider2History) {
      console.log(`Start Time: ${trip.startTime}, End Time: ${trip.endTime}`);
    }
  }
}

// Call the main function to run the application
main();
