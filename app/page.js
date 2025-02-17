'use client'
import { useState,useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import DashboardContent from "@/components/dashboardappointments";
import useAuth from '../app/middleware/authMiddleware';
import Sidebar from "@/components/sidebar";
import  Doctors  from '@/components/doctors';
import { useRouter } from 'next/navigation';
import { Patients } from '@/components/patients';
import { Docanalytics } from '@/components/docanalytics';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  // State to manage the active component
  const [activeComponent, setActiveComponent] = useState('appointments');

  if (loading) {
    return <div className="flex flex-1 items-center justify-center h-screen">
    <RotateCw className="w-8 h-8 animate-spin text-indigo-600" />
  </div>; // Prevent unnecessary redirects
  }
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'appointments':
        return <DashboardContent />;
      case 'doctors':
        return <Doctors/>;
      case 'patients':
        return <Patients />;
      case 'analytics':
        return <Docanalytics/>  
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with button handlers and activeComponent state */}
      <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      {/* Render the active component */}
      {renderActiveComponent()}
    </div>
  );
}