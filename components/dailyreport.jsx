import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X } from 'lucide-react';
import { format, addDays } from 'date-fns';
import axios from 'axios';

const DailyReport = ({ isOpen, onClose, currentDate, analyticsData }) => {
  const [tomorrowData, setTomorrowData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTomorrowData = async () => {
      try {
        const tomorrow = format(addDays(currentDate, 1), 'yyyy-MM-dd');
        const appointmentsResponse = await axios.get('https://clinic-backend-f42a.onrender.com/appointments');
        const appointments = appointmentsResponse.data;

        const tomorrowAppointments = appointments.filter(app => app.date === tomorrow);
        
        const doctorAppointments = {};
        tomorrowAppointments.forEach(app => {
          if (!doctorAppointments[app.doctorId]) {
            doctorAppointments[app.doctorId] = 0;
          }
          doctorAppointments[app.doctorId]++;
        });

        setTomorrowData(doctorAppointments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tomorrow data:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTomorrowData();
    }
  }, [isOpen, currentDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[500px] bg-white dark:bg-gray-950 relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardHeader>
          <CardTitle className="text-lg">
            Daily Summary - {format(currentDate, 'MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Today's Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold">
                  {analyticsData.reduce((sum, doc) => sum + doc.total, 0)}
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">New</p>
                <p className="text-xl font-bold text-[#818cf8]">
                  {analyticsData.reduce((sum, doc) => sum + doc.stats.newPatient, 0)}
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Follow-up</p>
                <p className="text-xl font-bold text-[#34d399]">
                  {analyticsData.reduce((sum, doc) => sum + doc.stats.followup, 0)}
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <p className="text-sm text-gray-500 dark:text-gray-400">Revisit</p>
                <p className="text-xl font-bold text-[#f472b6]">
                  {analyticsData.reduce((sum, doc) => sum + doc.stats.revisit, 0)}
                </p>
              </div>
            </div>

            {/* Doctor Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="text-right">Today</TableHead>
                  <TableHead className="text-right">Tomorrow</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.map((doctor, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell className="text-right">{doctor.total}</TableCell>
                    <TableCell className="text-right">
                      {loading ? '...' : (tomorrowData[doctor._id] || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyReport;