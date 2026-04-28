import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDemoStore, upsertDemoVehicle, type Vehicle } from '@/lib/fleet-store';

const COLLECTION_NAME = 'vehicles';

const normalizeVehicle = (id: string, data: any): Vehicle => ({
  id,
  vehicleId: data.vehicleId || data.ID || id,
  type: data.type || data.Type || 'Truck',
  status: data.status || data.Status || 'Available',
  lastUpdated: data.lastUpdated?.toDate?.().toISOString?.() || data.lastUpdated || new Date().toISOString(),
});

export async function GET() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('lastUpdated', 'desc'));
    const snapshot = await getDocs(q);
    const vehicles = snapshot.docs.map((record) => normalizeVehicle(record.id, record.data()));
    return NextResponse.json(vehicles);
  } catch (error) {
    console.warn('Using demo vehicle data because Firestore is unavailable.', error);
    return NextResponse.json(getDemoStore().vehicles);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const vehicle = {
    vehicleId: String(body.vehicleId || body.ID || '').trim(),
    type: body.type || body.Type,
    status: body.status || body.Status,
  };

  if (!vehicle.vehicleId || !vehicle.type || !vehicle.status) {
    return NextResponse.json({ error: 'Vehicle ID, type, and status are required.' }, { status: 400 });
  }

  try {
    await setDoc(doc(db, COLLECTION_NAME, vehicle.vehicleId), {
      ...vehicle,
      lastUpdated: serverTimestamp(),
    });
    return NextResponse.json({ id: vehicle.vehicleId, ...vehicle, lastUpdated: new Date().toISOString() }, { status: 201 });
  } catch (error) {
    console.warn('Saved vehicle to demo store because Firestore is unavailable.', error);
    return NextResponse.json(upsertDemoVehicle(vehicle as Pick<Vehicle, 'vehicleId' | 'type' | 'status'>), { status: 201 });
  }
}
