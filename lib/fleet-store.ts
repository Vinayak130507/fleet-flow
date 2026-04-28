export type Vehicle = {
  id: string;
  vehicleId: string;
  type: 'Truck' | 'Van' | 'Bike';
  status: 'On Trip' | 'Available' | 'In Shop';
  lastUpdated: string;
};

export type Trip = {
  id: string;
  tripId: string;
  destination: string;
  status: 'In Transit' | 'Pending' | 'Loading' | 'Completed';
  createdAt: string;
};

export type Driver = {
  id: string;
  name: string;
  licenseStatus: 'Valid' | 'Expiring Soon' | 'Invalid';
  status: 'On Duty' | 'Off Duty';
};

export type MaintenanceRecord = {
  id: string;
  vehicleId: string;
  serviceType: string;
  cost: number;
  date: string;
};

export type FuelLog = {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  date: string;
};

type DemoStore = {
  vehicles: Vehicle[];
  trips: Trip[];
  drivers: Driver[];
  maintenance: MaintenanceRecord[];
  fuelLogs: FuelLog[];
};

const now = () => new Date().toISOString();

const seedData = (): DemoStore => ({
  vehicles: [
    { id: 'TRK-001', vehicleId: 'TRK-001', type: 'Truck', status: 'On Trip', lastUpdated: now() },
    { id: 'VAN-042', vehicleId: 'VAN-042', type: 'Van', status: 'Available', lastUpdated: now() },
    { id: 'TRK-005', vehicleId: 'TRK-005', type: 'Truck', status: 'In Shop', lastUpdated: now() },
    { id: 'BKE-012', vehicleId: 'BKE-012', type: 'Bike', status: 'Available', lastUpdated: now() },
    { id: 'TRK-009', vehicleId: 'TRK-009', type: 'Truck', status: 'On Trip', lastUpdated: now() },
  ],
  trips: [
    { id: 'TRP-101', tripId: 'TRP-101', destination: 'Mumbai', status: 'In Transit', createdAt: now() },
    { id: 'TRP-102', tripId: 'TRP-102', destination: 'Delhi', status: 'Pending', createdAt: now() },
    { id: 'TRP-103', tripId: 'TRP-103', destination: 'Bangalore', status: 'Loading', createdAt: now() },
    { id: 'TRP-104', tripId: 'TRP-104', destination: 'Pune', status: 'Completed', createdAt: now() },
  ],
  drivers: [
    { id: 'DRV-001', name: 'Amit K.', licenseStatus: 'Valid', status: 'On Duty' },
    { id: 'DRV-002', name: 'Rahul S.', licenseStatus: 'Expiring Soon', status: 'Off Duty' },
    { id: 'DRV-003', name: 'Sarah J.', licenseStatus: 'Valid', status: 'On Duty' },
    { id: 'DRV-004', name: 'Neha P.', licenseStatus: 'Valid', status: 'On Duty' },
  ],
  maintenance: [
    { id: 'MNT-001', vehicleId: 'TRK-001', serviceType: 'Oil Change', cost: 12500, date: now() },
    { id: 'MNT-002', vehicleId: 'TRK-005', serviceType: 'Brake Inspection', cost: 18500, date: now() },
  ],
  fuelLogs: [
    { id: 'FUL-001', vehicleId: 'VAN-042', liters: 45, cost: 4200, date: now() },
    { id: 'FUL-002', vehicleId: 'TRK-009', liters: 120, cost: 11250, date: now() },
  ],
});

const globalStore = globalThis as typeof globalThis & { __fleetFlowDemoStore?: DemoStore };

export function getDemoStore() {
  if (!globalStore.__fleetFlowDemoStore) {
    globalStore.__fleetFlowDemoStore = seedData();
  }
  return globalStore.__fleetFlowDemoStore;
}

export function seedDemoStore() {
  const store = getDemoStore();
  if (store.vehicles.length > 0) {
    return store;
  }
  globalStore.__fleetFlowDemoStore = seedData();
  return globalStore.__fleetFlowDemoStore;
}

export function upsertDemoVehicle(input: Pick<Vehicle, 'vehicleId' | 'type' | 'status'>) {
  const store = getDemoStore();
  const record: Vehicle = { id: input.vehicleId, ...input, lastUpdated: now() };
  const index = store.vehicles.findIndex((vehicle) => vehicle.vehicleId === input.vehicleId);
  if (index >= 0) store.vehicles[index] = record;
  else store.vehicles.unshift(record);
  return record;
}

export function upsertDemoTrip(input: Pick<Trip, 'tripId' | 'destination' | 'status'>) {
  const store = getDemoStore();
  const record: Trip = { id: input.tripId, ...input, createdAt: now() };
  const index = store.trips.findIndex((trip) => trip.tripId === input.tripId);
  if (index >= 0) store.trips[index] = record;
  else store.trips.unshift(record);
  return record;
}

export function addDemoDriver(input: Pick<Driver, 'name' | 'licenseStatus' | 'status'>) {
  const store = getDemoStore();
  const record: Driver = { id: `DRV-${Date.now()}`, ...input };
  store.drivers.unshift(record);
  return record;
}

export function addDemoMaintenance(input: Pick<MaintenanceRecord, 'vehicleId' | 'serviceType' | 'cost'>) {
  const store = getDemoStore();
  const record: MaintenanceRecord = { id: `MNT-${Date.now()}`, ...input, date: now() };
  store.maintenance.unshift(record);
  return record;
}

export function addDemoFuelLog(input: Pick<FuelLog, 'vehicleId' | 'liters' | 'cost'>) {
  const store = getDemoStore();
  const record: FuelLog = { id: `FUL-${Date.now()}`, ...input, date: now() };
  store.fuelLogs.unshift(record);
  return record;
}

export function parseCurrency(value: unknown) {
  const parsed = Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}
