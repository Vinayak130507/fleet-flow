import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { addDemoFuelLog, getDemoStore, parseCurrency, type FuelLog } from '@/lib/fleet-store';

const COLLECTION_NAME = 'fuelLogs';

const normalizeFuelLog = (id: string, data: any): FuelLog => ({
  id,
  vehicleId: data.vehicleId || data.Vehicle || '',
  liters: Number(data.liters ?? data.Liters ?? 0),
  cost: Number(data.cost ?? parseCurrency(data.Cost)),
  date: data.date?.toDate?.().toISOString?.() || data.date || new Date().toISOString(),
});

export async function GET() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map((record) => normalizeFuelLog(record.id, record.data()));
    return NextResponse.json(logs);
  } catch (error) {
    console.warn('Using demo fuel log data because Firestore is unavailable.', error);
    return NextResponse.json(getDemoStore().fuelLogs);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const log = {
    vehicleId: String(body.vehicleId || body.Vehicle || '').trim(),
    liters: Number(body.liters ?? body.Liters ?? 0),
    cost: parseCurrency(body.cost ?? body.Cost),
  };

  if (!log.vehicleId || !Number.isFinite(log.liters) || log.liters <= 0) {
    return NextResponse.json({ error: 'Vehicle ID and a positive liters value are required.' }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...log,
      date: serverTimestamp(),
    });
    return NextResponse.json({ id: docRef.id, ...log, date: new Date().toISOString() }, { status: 201 });
  } catch (error) {
    console.warn('Saved fuel log to demo store because Firestore is unavailable.', error);
    return NextResponse.json(addDemoFuelLog(log), { status: 201 });
  }
}
