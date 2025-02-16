'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Plus, Check, Clock, X, CalendarDays, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchDoctors, fetchAppointments, updateAppointmentStatus } from '../app/services/api';
import AddAppointmentModal from '@/components/appointmentmodel';

const DashboardContent = () => {
   const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'time', direction: 'asc' });
  const [viewMode, setViewMode] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 25;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctorsData = async () => {
      try {
        const data = await fetchDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctorsData();
  }, []);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointmentsData = async () => {
      try {
        setLoading(true);
        const data = await fetchAppointments();
        
        const transformedData = data.map(apt => ({
          ...apt,
          patientName: apt.patientId.name || 'Unknown Patient',
          doctorName: apt.doctorId.name || 'Unknown Doctor',
          category: apt.doctorId.specialty || 'General',
          location: apt.patientId.location || 'Main Clinic'
        }));
        
        setAppointments(transformedData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsData();
  }, []);

  // Sort function
  const sortData = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort appointments
  const filteredAndSortedAppointments = useMemo(() => {
    return appointments
      .filter(appointment => {
        const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDate = viewMode === 'all' ? true : 
                           viewMode === 'today' ? appointment.date === selectedDate : 
                           appointment.date === selectedDate;
        
        const matchesDoctor = selectedDoctor === 'all' ? true : 
                             appointment.doctorId._id === selectedDoctor;
        
        return matchesSearch && matchesDate && matchesDoctor;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'time') {
          const timeA = new Date(`2000/01/01 ${a.time}`);
          const timeB = new Date(`2000/01/01 ${b.time}`);
          return sortConfig.direction === 'asc' ? timeA - timeB : timeB - timeA;
        }
        
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
        
        if (sortConfig.direction === 'asc') {
          return valueA > valueB ? 1 : -1;
        }
        return valueA < valueB ? 1 : -1;
      });
  }, [appointments, searchTerm, selectedDate, selectedDoctor, sortConfig, viewMode]);

  // Status update handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment._id === id ? { ...appointment, status: newStatus } : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedAppointments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && <PaginationEllipsis />}
            </>
          )}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };


  // New function to render mobile card view
  const MobileAppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
          <p className="text-sm text-gray-500">{appointment.location}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
          appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {appointment.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">Date</p>
          <p>{appointment.date}</p>
        </div>
        <div>
          <p className="text-gray-500">Time</p>
          <p>{appointment.time}</p>
        </div>
        <div>
          <p className="text-gray-500">Doctor</p>
          <p>{appointment.doctorName}</p>
        </div>
        <div>
          <p className="text-gray-500">Category</p>
          <p>{appointment.category}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleStatusChange(appointment._id, 'Scheduled')}
          className={appointment.status === 'Scheduled' ? 'text-orange-600' : ''}
        >
          <Clock className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleStatusChange(appointment._id, 'Completed')}
          className={appointment.status === 'Completed' ? 'text-green-600' : ''}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleStatusChange(appointment._id, 'Cancelled')}
          className={appointment.status === 'Cancelled' ? 'text-red-600' : ''}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
      {isModalOpen && <AddAppointmentModal onClose={closeModal} />}

      {/* Header Section - Now more responsive */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Appointment Management</h1>
          <p className="text-sm md:text-base text-gray-600">Dashboard / Appointments</p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <div className="flex items-center gap-4 self-end md:self-auto">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - More compact on mobile */}
      <div className="space-y-4 mb-6">
        <Tabs defaultValue="today" onValueChange={setViewMode} className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex gap-2">
            <TabsTrigger value="today" className="flex items-center justify-center">
              <Clock className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Today's Appointments</span>
              <span className="md:hidden">Today</span>
            </TabsTrigger>
            <TabsTrigger value="date" className="flex items-center justify-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">By Date</span>
              <span className="md:hidden">Date</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center justify-center">
              <User className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">All Appointments</span>
              <span className="md:hidden">All</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {viewMode !== 'all' && (
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          )}
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map(doctor => (
                <SelectItem key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={sortData} defaultValue="time">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="patientName">Patient Name</SelectItem>
              <SelectItem value="doctorName">Doctor Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 w-full"
            onClick={openModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Add Appointment</span>
            <span className="md:hidden">Add Appointment</span>
          </Button>
        </div>
      </div>

      {/* Content Section - Responsive table/card switch */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewMode === 'today' ? "Today's Appointments" :
             viewMode === 'date' ? `Appointments for ${selectedDate}` :
             "All Appointments"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block relative overflow-x-auto" style={{ maxHeight: '350px' }}>
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No appointments found</TableCell>
                  </TableRow>
                ) : currentItems.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell className="font-medium">{appointment.patientName}</TableCell>
                    <TableCell>{appointment.location}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.category}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusChange(appointment._id, 'Scheduled')}
                          className={appointment.status === 'Scheduled' ? 'text-orange-600' : ''}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusChange(appointment._id, 'Completed')}
                          className={appointment.status === 'Completed' ? 'text-green-600' : ''}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusChange(appointment._id, 'Cancelled')}
                          className={appointment.status === 'Cancelled' ? 'text-red-600' : ''}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-4">No appointments found</div>
            ) : (
              <div className="space-y-4">
                {currentItems.map((appointment) => (
                  <MobileAppointmentCard key={appointment._id} appointment={appointment} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
            <div className="text-sm text-gray-500 w-full md:w-auto text-center md:text-left">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAndSortedAppointments.length)} of {filteredAndSortedAppointments.length} appointments
            </div>
            <PaginationControls />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;