import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { addDoc, collection, doc, getDocs, limit, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { seedDemoStore } from '@/lib/fleet-store';

export async function GET() {
  const demoStore = seedDemoStore();

  try {
    const vehiclesSnapshot = await getDocs(query(collection(db, 'vehicles'), limit(1)));
    if (!vehiclesSnapshot.empty) {
      return NextResponse.json({ message: 'Database already seeded', mode: 'firestore' });
    }

    for (const vehicle of demoStore.vehicles) {
      await setDoc(doc(db, 'vehicles', vehicle.vehicleId), {
        vehicleId: vehicle.vehicleId,
        type: vehicle.type,
        status: vehicle.status,
        lastUpdated: serverTimestamp(),
      });
    }

    for (const trip of demoStore.trips) {
      await setDoc(doc(db, 'trips', trip.tripId), {
        tripId: trip.tripId,
        destination: trip.destination,
        status: trip.status,
        createdAt: serverTimestamp(),
      });
    }

    for (const driver of demoStore.drivers) {
      await addDoc(collection(db, 'drivers'), {
        name: driver.name,
        licenseStatus: driver.licenseStatus,
        status: driver.status,
      });
    }

    for (const record of demoStore.maintenance) {
      await addDoc(collection(db, 'maintenance'), {
        vehicleId: record.vehicleId,
        serviceType: record.serviceType,
        cost: record.cost,
        date: serverTimestamp(),
      });
    }

    for (const log of demoStore.fuelLogs) {
      await addDoc(collection(db, 'fuelLogs'), {
        vehicleId: log.vehicleId,
        liters: log.liters,
        cost: log.cost,
        date: serverTimestamp(),
      });
    }

    return NextResponse.json({ message: 'Database seeded successfully', mode: 'firestore' });
  } catch (error) {
    console.warn('Seeded demo store because Firestore is unavailable.', error);
    return NextResponse.json({ message: 'Demo data ready', mode: 'demo' });
  }
}
