'use client';

import React, { useState } from 'react';
import { Search, Bell, Plus, Check, Clock, X } from 'lucide-react';

const DashboardContent = () => {
  // Appointments data with status field
  const initialAppointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      location: "New York Clinic",
      referredBy: "Dr. Smith",
      time: "09:00 AM",
      date: "2025-02-11",
      doctorName: "Dr. Michael Chen",
      category: "Cardiology",
      status: "Scheduled" // Initial status
    },
    {
      id: 2,
      patientName: "Robert Williams",
      location: "Downtown Clinic",
      referredBy: "Dr. Brown",
      time: "10:30 AM",
      date: "2025-02-11",
      doctorName: "Dr. Emily Parker",
      category: "Neurology",
      status: "Completed" // Initial status
    },
    {
      id: 3,
      patientName: "James Anderson",
      location: "Central Hospital",
      referredBy: "Dr. Davis",
      time: "11:45 AM",
      date: "2025-02-11",
      doctorName: "Dr. Sarah Wilson",
      category: "Orthopedics",
      status: "Canceled" // Initial status
    },
    {
      id: 4,
      patientName: "Maria Garcia",
      location: "West End Clinic",
      referredBy: "Dr. Taylor",
      time: "02:15 PM",
      date: "2025-02-11",
      doctorName: "Dr. John Miller",
      category: "Pediatrics",
      status: "Scheduled" // Initial status
    }
  ];

  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-02-11');

  // Filter appointments based on search term and selected date
  const filteredAppointments = appointments.filter(appointment => 
    (appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    appointment.date === selectedDate
  );

  // Function to handle status change
  const handleStatusChange = (id, newStatus) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === id ? { ...appointment, status: newStatus } : appointment
      )
    );
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
          <p className="text-gray-600">Dashboard / Appointments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Bell size={20} className="text-gray-600" />
          </button>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-medium">JD</span>
          </div>
        </div>
      </div>

      {/* Date Selection and Add Appointment Button */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={() => console.log('Add appointment clicked')}
        >
          <Plus size={20} />
          Add Appointment
        </button>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Today's Appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">Referred By</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-800 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{appointment.patientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.referredBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {/* Scheduled Button */}
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Scheduled')}
                          className={`p-1.5 rounded-lg ${
                            appointment.status === 'Scheduled' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                          } hover:bg-orange-100 hover:text-orange-600 transition-colors`}
                        >
                          <Clock size={16} />
                        </button>
                        {/* Completed Button */}
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Completed')}
                          className={`p-1.5 rounded-lg ${
                            appointment.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                          } hover:bg-green-100 hover:text-green-600 transition-colors`}
                        >
                          <Check size={16} />
                        </button>
                        {/* Canceled Button */}
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Canceled')}
                          className={`p-1.5 rounded-lg ${
                            appointment.status === 'Canceled' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                          } hover:bg-red-100 hover:text-red-600 transition-colors`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;