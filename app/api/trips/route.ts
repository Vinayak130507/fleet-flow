import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDemoStore, upsertDemoTrip, type Trip } from '@/lib/fleet-store';

const COLLECTION_NAME = 'trips';

const normalizeTrip = (id: string, data: any): Trip => ({
  id,
  tripId: data.tripId || data['Trip ID'] || id,
  destination: data.destination || data.Destination || 'Unassigned',
  status: data.status || data.Status || 'Pending',
  createdAt: data.createdAt?.toDate?.().toISOString?.() || data.createdAt || new Date().toISOString(),
});

export async function GET() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const trips = snapshot.docs.map((record) => normalizeTrip(record.id, record.data()));
    return NextResponse.json(trips);
  } catch (error) {
    console.warn('Using demo trip data because Firestore is unavailable.', error);
    return NextResponse.json(getDemoStore().trips);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const trip = {
    tripId: String(body.tripId || body['Trip ID'] || '').trim(),
    destination: String(body.destination || body.Destination || '').trim(),
    status: body.status || body.Status,
  };

  if (!trip.tripId || !trip.destination || !trip.status) {
    return NextResponse.json({ error: 'Trip ID, destination, and status are required.' }, { status: 400 });
  }

  try {
    await setDoc(doc(db, COLLECTION_NAME, trip.tripId), {
      ...trip,
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({ id: trip.tripId, ...trip, createdAt: new Date().toISOString() }, { status: 201 });
  } catch (error) {
    console.warn('Saved trip to demo store because Firestore is unavailable.', error);
    return NextResponse.json(upsertDemoTrip(trip as Pick<Trip, 'tripId' | 'destination' | 'status'>), { status: 201 });
  }
}
