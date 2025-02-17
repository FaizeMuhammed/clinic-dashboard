'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, Users, RotateCw } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const Docanalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

  const COLORS = ['#818cf8', '#34d399', '#f472b6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const selectedDate = format(date, 'yyyy-MM-dd');
        
        const doctorsResponse = await axios.get('https://clinic-backend-f42a.onrender.com/doctors');
        const appointmentsResponse = await axios.get('https://clinic-backend-f42a.onrender.com/appointments');
        
        const doctors = doctorsResponse.data;
        const appointments = appointmentsResponse.data;

        // Process individual doctor data
        const processedData = doctors.map(doctor => {
          const doctorAppointments = appointments.filter(
            app => app.doctorId === doctor._id && app.date === selectedDate
          );

          const stats = {
            newPatient: doctorAppointments.filter(app => app.type === 'New Patient').length,
            followup: doctorAppointments.filter(app => app.type === 'Follow-up').length,
            revisit: doctorAppointments.filter(app => app.type === 'Revisit').length,
          };

          return {
            name: doctor.name,
            specialty: doctor.specialty,
            total: doctorAppointments.length,
            stats,
            chartData: [
              { name: 'New', value: stats.newPatient },
              { name: 'Follow-up', value: stats.followup },
              { name: 'Revisit', value: stats.revisit }
            ]
          };
        });

        // Calculate summary
        const summary = {
          totalAppointments: processedData.reduce((sum, doc) => sum + doc.total, 0),
          newPatients: processedData.reduce((sum, doc) => sum + doc.stats.newPatient, 0),
          followups: processedData.reduce((sum, doc) => sum + doc.stats.followup, 0),
          revisits: processedData.reduce((sum, doc) => sum + doc.stats.revisit, 0),
        };

        setAnalyticsData(processedData);
        setSummaryData(summary);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <RotateCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Daily Analytics
        </h2>
        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900">
              <CalendarIcon className="h-4 w-4" />
              {format(date, "MMMM d, yyyy")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Summary Cards */}
      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-100 dark:bg-gray-950 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <Users className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
                {summaryData.totalAppointments}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-100 dark:bg-gray-950 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New</p>
                <div className="h-4 w-4 rounded-full bg-[#818cf8]" />
              </div>
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
                {summaryData.newPatients}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-100 dark:bg-gray-950 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Follow-up</p>
                <div className="h-4 w-4 rounded-full bg-[#34d399]" />
              </div>
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
                {summaryData.followups}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-100 dark:bg-gray-950 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revisit</p>
                <div className="h-4 w-4 rounded-full bg-[#f472b6]" />
              </div>
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
                {summaryData.revisits}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Doctor Cards Grid */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyticsData.map((doctor, index) => (
            <Card key={index} className="bg-blue-50 dark:bg-gray-950 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {doctor.specialty}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {doctor.total}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-semibold text-[#818cf8]">
                      {doctor.stats.newPatient}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">New</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-[#34d399]">
                      {doctor.stats.followup}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Follow-up</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-[#f472b6]">
                      {doctor.stats.revisit}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Revisit</p>
                  </div>
                </div>

                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={doctor.chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={35}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {doctor.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};