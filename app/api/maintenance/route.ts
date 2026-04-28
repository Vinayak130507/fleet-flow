import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { addDemoMaintenance, getDemoStore, parseCurrency, type MaintenanceRecord } from '@/lib/fleet-store';

const COLLECTION_NAME = 'maintenance';

const normalizeMaintenance = (id: string, data: any): MaintenanceRecord => ({
  id,
  vehicleId: data.vehicleId || data.Vehicle || '',
  serviceType: data.serviceType || data.Service || '',
  cost: Number(data.cost ?? parseCurrency(data.Cost)),
  date: data.date?.toDate?.().toISOString?.() || data.date || new Date().toISOString(),
});

export async function GET() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const maintenance = snapshot.docs.map((record) => normalizeMaintenance(record.id, record.data()));
    return NextResponse.json(maintenance);
  } catch (error) {
    console.warn('Using demo maintenance data because Firestore is unavailable.', error);
    return NextResponse.json(getDemoStore().maintenance);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const record = {
    vehicleId: String(body.vehicleId || body.Vehicle || '').trim(),
    serviceType: String(body.serviceType || body.Service || '').trim(),
    cost: parseCurrency(body.cost ?? body.Cost),
  };

  if (!record.vehicleId || !record.serviceType) {
    return NextResponse.json({ error: 'Vehicle ID and service type are required.' }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...record,
      date: serverTimestamp(),
    });
    return NextResponse.json({ id: docRef.id, ...record, date: new Date().toISOString() }, { status: 201 });
  } catch (error) {
    console.warn('Saved maintenance record to demo store because Firestore is unavailable.', error);
    return NextResponse.json(addDemoMaintenance(record), { status: 201 });
  }
}
