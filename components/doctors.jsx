import React, { useState } from 'react';
import { PlusCircle, Search, Calendar, Users, Clock, X, Edit, ChevronRight,Plus  } from 'lucide-react';

export const Doctors = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newDoctor, setNewDoctor] = useState({
      name: '',
      category: '',
      availability: {
        Monday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
        Tuesday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
        Wednesday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
        Thursday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
        Friday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
        Saturday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
        Sunday: { isAvailable: false, startTime: '09:00', endTime: '17:00' }
      },
      slotsPerHour: 2,
      languages: [],
      education: '',
      experience: ''
    });

    const handleAddDoctor = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('New Doctor Data:', newDoctor);
        setShowAddModal(false);
      };
    
      const categories = [
        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
        'Dermatology', 'Oncology', 'Psychiatry', 'General Medicine'
      ];

      const AddDoctorModal = () => {
        // Ensure handleAddDoctor does not cause re-renders
        
      
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-white">Add New Doctor</h2>
                  <p className="text-gray-200 mt-1">Enter the doctor's details and schedule</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Form */}
              <form onSubmit={handleAddDoctor} className="p-6">
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
                      <input
                        type="text"
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 text-gray-800 placeholder-gray-400"
                        placeholder="Dr. John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                      <select
                        value={newDoctor.category}
                        onChange={(e) => setNewDoctor((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 text-gray-800"
                        required
                      >
                        <option value="" className="text-gray-400">Select Specialty</option>
                        {categories.map((category) => (
                          <option key={category} value={category} className="text-gray-800">{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
      
                  {/* Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Availability</h3>
                    <div className="space-y-3">
                      {Object.entries(newDoctor.availability).map(([day, schedule], index) => (
                        <div key={day + index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm">
                          <div className="w-24">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={schedule.isAvailable}
                                onChange={(e) => setNewDoctor((prev) => ({
                                  ...prev,
                                  availability: {
                                    ...prev.availability,
                                    [day]: { ...schedule, isAvailable: e.target.checked }
                                  }
                                }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              <span className="ml-3 text-sm font-medium text-gray-700">{day}</span>
                            </label>
                          </div>
                          {schedule.isAvailable && (
                            <div className="flex items-center gap-4 flex-1">
                              <input
                                type="time"
                                value={schedule.startTime}
                                onChange={(e) => setNewDoctor((prev) => ({
                                  ...prev,
                                  availability: {
                                    ...prev.availability,
                                    [day]: { ...schedule, startTime: e.target.value }
                                  }
                                }))}
                                className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 text-gray-800"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={schedule.endTime}
                                onChange={(e) => setNewDoctor((prev) => ({
                                  ...prev,
                                  availability: {
                                    ...prev.availability,
                                    [day]: { ...schedule, endTime: e.target.value }
                                  }
                                }))}
                                className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 text-gray-800"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
      
                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Appointments Per Hour</label>
                      <input
                        type="number"
                        value={newDoctor.slotsPerHour}
                        onChange={(e) => setNewDoctor((prev) => ({ ...prev, slotsPerHour: parseInt(e.target.value) }))}
                        min="1"
                        max="6"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      <input
                        type="text"
                        value={newDoctor.experience}
                        onChange={(e) => setNewDoctor((prev) => ({ ...prev, experience: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 text-gray-800 placeholder-gray-400"
                        placeholder="e.g. 10 years"
                      />
                    </div>
                  </div>
      
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education & Certifications</label>
                    <textarea
                      value={newDoctor.education}
                      onChange={(e) => setNewDoctor((prev) => ({ ...prev, education: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 text-gray-800 placeholder-gray-400"
                      rows="3"
                      placeholder="e.g. MD - Cardiology, MBBS"
                    />
                  </div>
      
                  {/* Form Actions */}
                  <div className="flex gap-4 pt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5" />
                      Add Doctor
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
      };
  const doctors = [
    {
      id: 1,
      name: "Dr. Michael Chen",
      category: "Cardiology",
      availability: {
        Monday: "9:00 AM - 5:00 PM",
        Tuesday: "10:00 AM - 6:00 PM",
        Wednesday: "9:00 AM - 5:00 PM",
        Thursday: "10:00 AM - 6:00 PM",
        Friday: "9:00 AM - 5:00 PM",
        Saturday: "Not Available",
        Sunday: "Not Available"
      },
      slotsPerHour: 2,
      patients: 124,
      experience: "15 years",
      education: "MD - Cardiology, MBBS",
      languages: ["English", "Mandarin"]
    },
    {
      id: 2,
      name: "Dr. Emily Parker",
      category: "Neurology",
      availability: {
        Monday: "8:00 AM - 4:00 PM",
        Tuesday: "8:00 AM - 4:00 PM",
        Wednesday: "8:00 AM - 4:00 PM",
        Thursday: "8:00 AM - 4:00 PM",
        Friday: "8:00 AM - 4:00 PM",
        Saturday: "9:00 AM - 1:00 PM",
        Sunday: "Not Available"
      },
      slotsPerHour: 3,
      patients: 98
    },
    {
      id: 3,
      name: "Dr. Sarah Wilson",
      category: "Orthopedics",
      availability: {
        Monday: "10:00 AM - 6:00 PM",
        Tuesday: "10:00 AM - 6:00 PM",
        Wednesday: "10:00 AM - 6:00 PM",
        Thursday: "10:00 AM - 6:00 PM",
        Friday: "10:00 AM - 6:00 PM",
        Saturday: "Not Available",
        Sunday: "Not Available"
      },
      slotsPerHour: 4,
      patients: 156
    },
    {
      id: 4,
      name: "Dr. John Miller",
      category: "Pediatrics",
      availability: {
        Monday: "9:00 AM - 5:00 PM",
        Tuesday: "9:00 AM - 5:00 PM",
        Wednesday: "9:00 AM - 5:00 PM",
        Thursday: "9:00 AM - 5:00 PM",
        Friday: "9:00 AM - 5:00 PM",
        Saturday: "10:00 AM - 2:00 PM",
        Sunday: "Not Available"
      },
      slotsPerHour: 3,
      patients: 142
    }
  ];

  const getInitials = (name) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const getRandomColor = (name) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600'
    ];
    return colors[name.length % colors.length];
  };

  const getDayBackground = (day) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return day === today ? 'bg-blue-50' : 'bg-gray-50';
  };

  const closeModal = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Doctors Management
            </h1>
            <p className="text-gray-600">Dashboard / Manage your clinic's medical staff</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Doctor
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors by name or specialty..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-md shadow-sm"
          />
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id}>
              <div 
                className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer border border-gray-100 p-6"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${getRandomColor(doctor.name)} flex items-center justify-center text-white text-lg font-semibold shadow-md`}>
                    {getInitials(doctor.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{doctor.name}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                      {doctor.category}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getRandomColor(selectedDoctor.name)} flex items-center justify-center text-white text-xl font-semibold shadow-md`}>
                    {getInitials(selectedDoctor.name)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedDoctor.name}</h2>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100 mt-1">
                      {selectedDoctor.category}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="text-lg font-medium">Weekly Schedule</span>
                    </div>
                    <div className="grid gap-2">
                      {Object.entries(selectedDoctor.availability).map(([day, time]) => (
                        <div 
                          key={day} 
                          className={`rounded-lg p-3 ${getDayBackground(day)} transition-colors duration-200`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700 w-24">{day}</span>
                            <span className={`text-sm ${time === "Not Available" ? "text-red-500" : "text-green-600"}`}>
                              {time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium">{selectedDoctor.slotsPerHour} appointments/hour</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium">{selectedDoctor.patients} total patients</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                    <Edit className="w-4 h-4" />
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}{showAddModal && <AddDoctorModal />}
      </div>
    </div>
  );
};

export default Doctors;