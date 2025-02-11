'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, UserRound, LogOut } from 'lucide-react';

const Sidebar = ({activeComponent, setActiveComponent}) => {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="h-screen w-62 bg-gradient-to-b from-indigo-600 via-indigo-900 to-indigo-900 text-white shadow-xl flex flex-col">
      {/* Logo Section with better padding and centering */}
      <div className="py-8 px-6 border-b border-indigo-700/50 flex justify-center items-center">
        <div className="relative w-full flex justify-center">
          <Image
            src="/Screenshot_2025-02-11_080236-removebg-preview.png"
            alt="Brandname"
            width={200}
            height={100}
            style={{
              maxWidth: "85%",
              height: "auto",
              objectFit: "contain"
            }}
            className="drop-shadow-lg"
          />
        </div>
      </div>

      {/* Navigation Section with improved spacing */}
      <nav className="flex-1 px-6 py-8">
        <ul className="space-y-4">
          <li>
            <button
               onClick={() => setActiveComponent('appointments')}
              className="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
            >
              <Calendar className="group-hover:text-indigo-300 transition-colors w-5 h-5" />
              <span className="group-hover:text-indigo-300 transition-colors font-medium">
                Appointments
              </span>
              </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveComponent('doctors')}
              className="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
            >
              <UserRound className="group-hover:text-indigo-300 transition-colors w-5 h-5" />
              <span className="group-hover:text-indigo-300 transition-colors font-medium">
                Doctors
              </span>
              </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveComponent('patients')}
              className="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
            >
              <Users className="group-hover:text-indigo-300 transition-colors w-5 h-5" />
              <span className="group-hover:text-indigo-300 transition-colors font-medium">
                Patients
              </span>
              </button>
          </li>
        </ul>
      </nav>

      {/* Footer Section with improved styling */}
      <div className="px-6 py-6 border-t border-indigo-700/50">
        <button 
          onClick={handleLogout} 
          className="flex items-center space-x-4 px-4 py-3 w-full rounded-xl hover:bg-white/10 transition-all duration-300 group mb-6"
        >
          <LogOut className="group-hover:text-red-300 transition-colors w-5 h-5" />
          <span className="group-hover:text-red-300 transition-colors font-medium">
            Logout
          </span>
        </button>

        {/* Powered By Section with enhanced typography */}
        <div className="text-center">
          <p className="text-sm font-light text-indigo-300/70 tracking-wide">
            Powered by
            <span className="font-medium text-indigo-300 ml-1">
              Brandname
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;