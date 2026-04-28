'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, Truck, Map, Users, Wrench, 
  Droplets, BarChart3, Bell, Search, LogOut, Shield, DollarSign, AlertTriangle, CheckCircle2, Clock, Plus, Menu, X
} from 'lucide-react';

type Vehicle = {
  id: string;
  vehicleId: string;
  type: 'Truck' | 'Van' | 'Bike';
  status: 'On Trip' | 'Available' | 'In Shop';
};

type Trip = {
  id: string;
  tripId: string;
  destination: string;
  status: 'In Transit' | 'Pending' | 'Loading' | 'Completed';
};

type Driver = {
  id: string;
  name: string;
  licenseStatus: 'Valid' | 'Expiring Soon' | 'Invalid';
  status: 'On Duty' | 'Off Duty';
};

type MaintenanceRecord = {
  id: string;
  vehicleId: string;
  serviceType: string;
  cost: number;
};

type FuelLog = {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
};

const formatCurrency = (value: number) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const TopHeader = ({ title, subtitle, onMenuClick }: any) => (
  <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
    <div className="flex items-center gap-4">
      <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-[var(--muted)] hover:text-white">
        <Menu size={24} />
      </button>
      <div>
        <h1 className="font-space font-bold text-2xl md:text-3xl">{title}</h1>
        <p className="text-[var(--muted)] text-sm mt-1">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
        <input type="text" placeholder="Search..." className="w-full bg-[var(--bg2)] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--accent-lime)] transition-colors" />
      </div>
      <button className="w-10 h-10 shrink-0 rounded-full bg-[var(--bg2)] border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
        <Bell size={18} />
      </button>
    </div>
  </header>
);

const KPICard = ({ title, value, subtitle, colorClass, icon: Icon }: any) => (
  <div className="bg-[var(--bg2)] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <div className="text-[var(--muted)] text-sm font-medium">{title}</div>
      {Icon && <Icon size={16} className={colorClass} />}
    </div>
    <div className="flex items-end gap-3">
      <div className={`font-space font-bold text-3xl md:text-4xl ${colorClass}`}>{value}</div>
      <div className="text-sm text-[var(--muted)] mb-1">{subtitle}</div>
    </div>
  </div>
);

const AddModal = ({ isOpen, onClose, title, fields, onAdd }: any) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg2)] border border-white/10 rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--muted)] hover:text-white"><X size={20}/></button>
        <h2 className="font-space font-bold text-xl mb-6">{title}</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setIsSubmitting(true);
          const formData = new FormData(e.currentTarget as HTMLFormElement);
          try {
            await onAdd(Object.fromEntries(formData.entries()));
            onClose();
          } catch (err: any) {
            setError(err.message || 'Could not save this record. Please try again.');
          } finally {
            setIsSubmitting(false);
          }
        }} className="space-y-4">
          {fields.map((f: any) => (
            <div key={f.name}>
              <label className="block text-sm text-[var(--muted)] mb-1">{f.label}</label>
              <input name={f.name} type={f.type || 'text'} required className="w-full bg-[var(--bg)] border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-lime)] text-white" />
            </div>
          ))}
          {error && <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-md p-2">{error}</p>}
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[var(--muted)] hover:text-white">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm bg-[var(--accent-lime)] text-black font-medium rounded-md hover:bg-[#d4eb33] transition-colors disabled:opacity-60">
              {isSubmitting ? 'Saving...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FleetManagerDashboard = ({ vehicles, onMenuClick }: any) => {
  const [filter, setFilter] = useState('All');
  const filteredVehicles = filter === 'All' ? vehicles : vehicles.filter((v: Vehicle) => `${v.type}s` === filter || v.type === filter);

  return (
    <div>
      <TopHeader title="Command Center" subtitle="Welcome back. Here's what's happening today." onMenuClick={onMenuClick} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <KPICard title="Active Fleet" value={vehicles.filter((v: Vehicle)=>v.status==='On Trip').length.toString()} subtitle="On Trip now" colorClass="text-[var(--accent-teal)]" />
        <KPICard title="Maintenance Alerts" value={vehicles.filter((v: Vehicle)=>v.status==='In Shop').length.toString()} subtitle="In Shop" colorClass="text-[var(--accent-orange)]" />
        <div className="bg-[var(--bg2)] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors flex justify-between items-center">
          <div>
            <div className="text-[var(--muted)] text-sm font-medium mb-2">Utilization Rate</div>
            <div className="font-space font-bold text-3xl md:text-4xl text-[var(--accent-lime)]">78%</div>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white/5 border-t-[var(--accent-lime)] border-r-[var(--accent-lime)] transform rotate-45" />
        </div>
        <KPICard title="Pending Cargo" value="5" subtitle="Awaiting assignment" colorClass="text-white" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-8">
        <div className="lg:col-span-6 bg-[var(--bg2)] border border-white/5 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-space font-bold text-lg">Vehicle Status</h2>
            <div className="flex flex-wrap gap-2">
              {['All', 'Trucks', 'Vans', 'Bikes'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-[var(--muted)] hover:text-white hover:bg-white/5'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/[0.02] text-[var(--muted)]">
                <tr><th className="p-4 font-medium">Vehicle</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredVehicles.slice(0, 6).map((v:any, i:number) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium">{v.vehicleId}</td>
                    <td className="p-4">{v.type}</td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${v.status === 'On Trip' ? 'bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]' : v.status === 'Available' ? 'bg-[var(--accent-lime)]/10 text-[var(--accent-lime)]' : 'bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]'}`}>{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-4 bg-[var(--bg2)] border border-white/5 rounded-xl p-6">
          <h2 className="font-space font-bold text-lg mb-6">Activity Feed</h2>
          <div className="space-y-6">
            {[
              { text: "Van-03 completed trip", time: "2 min ago", color: "border-[var(--accent-teal)]" },
              { text: "Driver Alex license expires in 7 days", time: "15 min ago", color: "border-[var(--accent-orange)]" },
              { text: "Truck-01 sent to maintenance", time: "1 hr ago", color: "border-red-500" },
            ].map((item, i) => (
              <div key={i} className={`pl-4 border-l-2 ${item.color} hover:opacity-80 transition-opacity cursor-pointer`}>
                <div className="text-sm font-medium mb-1">{item.text}</div>
                <div className="text-xs text-[var(--muted)]">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DispatcherDashboard = ({ trips, onMenuClick }: any) => (
  <div>
    <TopHeader title="Dispatch Hub" subtitle="Manage trips, drivers, and cargo loads." onMenuClick={onMenuClick} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <KPICard title="Active Trips" value={trips.filter((t: Trip)=>t.status==='In Transit').length.toString()} subtitle="In transit" colorClass="text-[var(--accent-teal)]" icon={Map} />
      <KPICard title="Pending Dispatch" value={trips.filter((t: Trip)=>t.status==='Pending').length.toString()} subtitle="Requires assignment" colorClass="text-[var(--accent-orange)]" icon={AlertTriangle} />
      <KPICard title="Available Drivers" value="8" subtitle="Ready for duty" colorClass="text-[var(--accent-lime)]" icon={Users} />
      <KPICard title="Delayed Trips" value="2" subtitle="ETA > 30m late" colorClass="text-red-500" icon={Clock} />
    </div>
    <div className="bg-[var(--bg2)] border border-white/5 rounded-xl overflow-hidden overflow-x-auto">
      <div className="p-4 border-b border-white/5"><h2 className="font-space font-bold text-lg">Live Trips</h2></div>
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-white/[0.02] text-[var(--muted)]">
          <tr><th className="p-4">Trip ID</th><th className="p-4">Destination</th><th className="p-4">Status</th></tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {trips.slice(0, 5).map((t:any, i:number) => (
            <tr key={i} className="hover:bg-white/[0.02]">
              <td className="p-4 font-mono">{t.tripId}</td><td className="p-4">{t.destination}</td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${t.status === 'In Transit' ? 'bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]' : t.status === 'Loading' ? 'bg-[var(--accent-lime)]/10 text-[var(--accent-lime)]' : 'bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]'}`}>{t.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SafetyOfficerDashboard = ({ drivers, onMenuClick }: any) => (
  <div>
    <TopHeader title="Safety & Compliance" subtitle="Monitor driver safety scores and compliance." onMenuClick={onMenuClick} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <KPICard title="Fleet Safety Score" value="94/100" subtitle="Top 10% industry" colorClass="text-[var(--accent-lime)]" icon={Shield} />
      <KPICard title="Incidents (30d)" value="0" subtitle="Zero preventable" colorClass="text-[var(--accent-teal)]" icon={CheckCircle2} />
      <KPICard title="Expiring Licenses" value="3" subtitle="Within 30 days" colorClass="text-[var(--accent-orange)]" icon={AlertTriangle} />
      <KPICard title="Speeding Alerts" value="12" subtitle="Minor infractions" colorClass="text-red-400" icon={AlertTriangle} />
    </div>
    <div className="bg-[var(--bg2)] border border-white/5 rounded-xl overflow-hidden overflow-x-auto">
      <div className="p-4 border-b border-white/5"><h2 className="font-space font-bold text-lg">Driver Safety Watchlist</h2></div>
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-white/[0.02] text-[var(--muted)]">
          <tr><th className="p-4">Driver</th><th className="p-4">License Status</th><th className="p-4">Status</th></tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {drivers.slice(0, 5).map((d:any, i:number) => (
            <tr key={i} className="hover:bg-white/[0.02]">
              <td className="p-4 font-medium">{d.name}</td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${d.licenseStatus === 'Valid' ? 'bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]' : 'bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]'}`}>{d.licenseStatus}</span></td>
              <td className="p-4 text-[var(--muted)]">{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const FinancialAnalystDashboard = ({ maintenance, fuelLogs, vehicles, onMenuClick }: any) => {
  const totalFuel = fuelLogs.reduce((acc: number, log: FuelLog) => acc + Number(log.cost || 0), 0);
  const totalMaint = maintenance.reduce((acc: number, log: MaintenanceRecord) => acc + Number(log.cost || 0), 0);

  return (
    <div>
      <TopHeader title="Financial Overview" subtitle="Audit fuel spend, maintenance ROI, and costs." onMenuClick={onMenuClick} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <KPICard title="Total Fuel Spend" value={formatCurrency(totalFuel)} subtitle="All time" colorClass="text-[var(--accent-orange)]" icon={DollarSign} />
        <KPICard title="Maintenance Costs" value={formatCurrency(totalMaint)} subtitle="All time" colorClass="text-[var(--accent-lime)]" icon={Wrench} />
        <KPICard title="Cost per Vehicle" value={formatCurrency(vehicles.length ? (totalFuel + totalMaint) / vehicles.length : 0)} subtitle="Average across fleet" colorClass="text-[var(--accent-teal)]" icon={BarChart3} />
        <KPICard title="Total Expense" value={formatCurrency(totalFuel + totalMaint)} subtitle="Combined" colorClass="text-white" icon={BarChart3} />
      </div>
      <div className="bg-[var(--bg2)] border border-white/5 rounded-xl p-6 overflow-x-auto">
        <h2 className="font-space font-bold text-lg mb-6">Recent Expense Records</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 text-xs text-[var(--muted)] border-b border-white/5 pb-2">
            <div>Type</div>
            <div>Vehicle</div>
            <div className="text-right">Cost</div>
          </div>
          {[...maintenance.map((m: MaintenanceRecord) => ({ type: 'Maintenance', vehicleId: m.vehicleId, cost: m.cost })), ...fuelLogs.map((f: FuelLog) => ({ type: 'Fuel', vehicleId: f.vehicleId, cost: f.cost }))].slice(0, 5).map((item, i) => (
            <div key={i} className="grid grid-cols-3 text-sm py-1">
              <div className={item.type === 'Maintenance' ? 'text-[var(--accent-lime)]' : 'text-[var(--accent-orange)]'}>{item.type}</div>
              <div className="font-mono">{item.vehicleId}</div>
              <div className="text-right">{formatCurrency(item.cost)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GenericTable = ({ title, columns, data, onAdd, addFields, onMenuClick, notice }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-[var(--muted)] hover:text-white">
            <Menu size={24} />
          </button>
          <div>
            <h1 className="font-space font-bold text-2xl md:text-3xl">{title}</h1>
            <p className="text-[var(--muted)] text-sm mt-1">Manage {title.toLowerCase()} records.</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent-lime)] text-black font-medium rounded-md text-sm hover:bg-[#d4eb33] transition-colors w-full md:w-auto shrink-0">
          <Plus size={16} /> Add {title}
        </button>
      </div>
      {notice && <div className="mb-4 rounded-md border border-[var(--accent-lime)]/20 bg-[var(--accent-lime)]/10 px-4 py-3 text-sm text-[var(--accent-lime)]">{notice}</div>}
      <div className="bg-[var(--bg2)] border border-white/5 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/[0.02] text-[var(--muted)]">
            <tr>{columns.map((c: string) => <th key={c} className="p-4 font-medium">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="p-8 text-center text-[var(--muted)]">No records found.</td></tr>
            ) : (
              data.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  {columns.map((c: string) => <td key={c} className="p-4">{row[c]}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add ${title}`} fields={addFields} onAdd={onAdd} />
    </div>
  );
};

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
  { name: 'Vehicles', icon: Truck, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'] },
  { name: 'Trips', icon: Map, roles: ['Fleet Manager', 'Dispatcher'] },
  { name: 'Drivers', icon: Users, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'] },
  { name: 'Maintenance', icon: Wrench, roles: ['Fleet Manager', 'Financial Analyst'] },
  { name: 'Fuel Logs', icon: Droplets, roles: ['Fleet Manager', 'Financial Analyst'] },
  { name: 'Analytics', icon: BarChart3, roles: ['Fleet Manager', 'Financial Analyst'] },
];

export default function DashboardPage({ role, onLogout }: { role: string, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      onLogout();
    }
  };

  // State for data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      // Parallel fetch for initial load
      const [vRes, tRes, dRes, mRes, fRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/trips'),
        fetch('/api/drivers'),
        fetch('/api/maintenance'),
        fetch('/api/fuel-logs')
      ]);

      const [vData, tData, dData, mData, fData] = await Promise.all([
        vRes.json(), tRes.json(), dRes.json(), mRes.json(), fRes.json()
      ]);

      if (![vRes, tRes, dRes, mRes, fRes].every((res) => res.ok)) {
        throw new Error('One or more fleet modules could not be loaded.');
      }

      setVehicles(Array.isArray(vData) ? vData : []);
      setTrips(Array.isArray(tData) ? tData : []);
      setDrivers(Array.isArray(dData) ? dData : []);
      setMaintenance(Array.isArray(mData) ? mData : []);
      setFuelLogs(Array.isArray(fData) ? fData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoadError('Fleet data could not be loaded. Please refresh the demo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Seed data on first load
  useEffect(() => {
    const init = async () => {
      try {
        await fetch('/api/seed');
        await fetchData();
      } catch (error) {
        console.error('Seed error:', error);
      }
    };
    init();
  }, [fetchData]);

  const handleAdd = async (endpoint: string, data: any) => {
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Could not save this record.');
      }
      await fetchData();
      setNotice('Record saved and dashboard refreshed.');
      setTimeout(() => setNotice(null), 3000);
    } catch (error) {
      console.error(`Error adding to ${endpoint}:`, error);
      throw error;
    }
  };

  const allowedNavItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  const handleNavClick = (name: string) => {
    setActiveTab(name);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-lime)]"></div>
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
          <h2 className="font-space font-bold text-xl mb-2">Data connection needs attention</h2>
          <p className="text-sm">{loadError}</p>
        </div>
      );
    }

    if (activeTab === 'Dashboard') {
      switch (role) {
        case 'Fleet Manager': return <FleetManagerDashboard vehicles={vehicles} onMenuClick={() => setIsMobileMenuOpen(true)} />;
        case 'Dispatcher': return <DispatcherDashboard trips={trips} onMenuClick={() => setIsMobileMenuOpen(true)} />;
        case 'Safety Officer': return <SafetyOfficerDashboard drivers={drivers} onMenuClick={() => setIsMobileMenuOpen(true)} />;
        case 'Financial Analyst': return <FinancialAnalystDashboard maintenance={maintenance} fuelLogs={fuelLogs} vehicles={vehicles} onMenuClick={() => setIsMobileMenuOpen(true)} />;
        default: return <FleetManagerDashboard vehicles={vehicles} onMenuClick={() => setIsMobileMenuOpen(true)} />;
      }
    }
    
    switch (activeTab) {
      case 'Vehicles':
        return <GenericTable title="Vehicles" columns={['ID', 'Type', 'Status']} data={vehicles.map((v) => ({ ID: v.vehicleId, Type: v.type, Status: v.status }))} notice={notice} onMenuClick={() => setIsMobileMenuOpen(true)}
          addFields={[{name: 'vehicleId', label: 'Vehicle ID'}, {name: 'type', label: 'Type (Truck/Van/Bike)'}, {name: 'status', label: 'Status'}]}
          onAdd={(data:any) => handleAdd('vehicles', data)} />;
      case 'Trips':
        return <GenericTable title="Trips" columns={['Trip ID', 'Destination', 'Status']} data={trips.map((t) => ({ 'Trip ID': t.tripId, Destination: t.destination, Status: t.status }))} notice={notice} onMenuClick={() => setIsMobileMenuOpen(true)}
          addFields={[{name: 'tripId', label: 'Trip ID'}, {name: 'destination', label: 'Destination'}, {name: 'status', label: 'Status'}]}
          onAdd={(data:any) => handleAdd('trips', data)} />;
      case 'Drivers':
        return <GenericTable title="Drivers" columns={['Name', 'License', 'Status']} data={drivers.map((d) => ({ Name: d.name, License: d.licenseStatus, Status: d.status }))} notice={notice} onMenuClick={() => setIsMobileMenuOpen(true)}
          addFields={[{name: 'name', label: 'Driver Name'}, {name: 'licenseStatus', label: 'License Status (Valid/Expiring Soon)'}, {name: 'status', label: 'Current Status (On Duty/Off Duty)'}]}
          onAdd={(data:any) => handleAdd('drivers', data)} />;
      case 'Maintenance':
        return <GenericTable title="Maintenance Logs" columns={['Vehicle', 'Service', 'Cost']} data={maintenance.map((m) => ({ Vehicle: m.vehicleId, Service: m.serviceType, Cost: formatCurrency(m.cost) }))} notice={notice} onMenuClick={() => setIsMobileMenuOpen(true)}
          addFields={[{name: 'vehicleId', label: 'Vehicle ID'}, {name: 'serviceType', label: 'Service Type'}, {name: 'cost', label: 'Cost (₹)', type: 'number'}]}
          onAdd={(data:any) => handleAdd('maintenance', data)} />;
      case 'Fuel Logs':
        return <GenericTable title="Fuel Logs" columns={['Vehicle', 'Liters', 'Cost']} data={fuelLogs.map((f) => ({ Vehicle: f.vehicleId, Liters: f.liters, Cost: formatCurrency(f.cost) }))} notice={notice} onMenuClick={() => setIsMobileMenuOpen(true)}
          addFields={[{name: 'vehicleId', label: 'Vehicle ID'}, {name: 'liters', label: 'Liters', type: 'number'}, {name: 'cost', label: 'Cost (₹)', type: 'number'}]}
          onAdd={(data:any) => handleAdd('fuel-logs', data)} />;
      case 'Analytics':
        return <GenericTable title="Analytics Reports" columns={['Report Name', 'Date Generated']} data={[{'Report Name': 'Monthly Efficiency', 'Date Generated': '2026-04-01'}]} onMenuClick={() => setIsMobileMenuOpen(true)}
          addFields={[{name: 'Report Name', label: 'Report Name'}, {name: 'Date Generated', label: 'Date (YYYY-MM-DD)', type: 'date'}]}
          onAdd={() => {}} />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex font-inter">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`w-[240px] lg:w-[200px] fixed inset-y-0 left-0 bg-[var(--bg2)] border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-space font-extrabold text-xl tracking-tight">FleetFlow</span>
            <div className="w-2 h-2 rounded-full bg-[var(--accent-lime)] animate-pulse" />
          </div>
          <button className="lg:hidden text-[var(--muted)] hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {allowedNavItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => handleNavClick(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === item.name ? 'bg-[var(--accent-lime)]/10 text-[var(--accent-lime)]' : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5'}`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-space font-bold text-lg shrink-0">
              {role.charAt(0)}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium truncate">Current User</div>
              <div className="text-xs text-[var(--muted)] truncate">{role}</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[var(--muted)] hover:text-white hover:bg-white/5 rounded-md transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-[200px] p-4 md:p-8 w-full overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
