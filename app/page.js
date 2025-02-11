'use client'
import { useState } from 'react';
import DashboardContent from "@/components/dashboardappointments";
 // Create this component
import Sidebar from "@/components/sidebar";
import { Doctors } from '@/components/doctors';
import { Patients } from '@/components/patients';

export default function Home() {
  // State to manage the active component
  const [activeComponent, setActiveComponent] = useState('appointments');

  // Function to render the active component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'appointments':
        return <DashboardContent />;
      case 'doctors':
        return <Doctors/>;
      case 'patients':
        return <Patients />;
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