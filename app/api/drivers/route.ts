import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { addDemoDriver, getDemoStore, type Driver } from '@/lib/fleet-store';

const COLLECTION_NAME = 'drivers';

const normalizeDriver = (id: string, data: any): Driver => ({
  id,
  name: data.name || data.Name || 'Unnamed Driver',
  licenseStatus: data.licenseStatus || data.License || 'Valid',
  status: data.status || data.Status || 'Off Duty',
});

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const drivers = snapshot.docs.map((record) => normalizeDriver(record.id, record.data()));
    return NextResponse.json(drivers);
  } catch (error) {
    console.warn('Using demo driver data because Firestore is unavailable.', error);
    return NextResponse.json(getDemoStore().drivers);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const driver = {
    name: String(body.name || body.Name || '').trim(),
    licenseStatus: body.licenseStatus || body.License,
    status: body.status || body.Status,
  };

  if (!driver.name || !driver.licenseStatus || !driver.status) {
    return NextResponse.json({ error: 'Driver name, license status, and duty status are required.' }, { status: 400 });
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), driver);
    return NextResponse.json({ id: docRef.id, ...driver }, { status: 201 });
  } catch (error) {
    console.warn('Saved driver to demo store because Firestore is unavailable.', error);
    return NextResponse.json(addDemoDriver(driver as Pick<Driver, 'name' | 'licenseStatus' | 'status'>), { status: 201 });
  }
}
