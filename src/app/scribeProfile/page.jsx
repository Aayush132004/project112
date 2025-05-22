'use client';
import { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

// Translation object for English and Hindi
const translations = {
  en: {
    settings: "Settings",
    helpSupport: "Help support",
    scribeProfile: "Scribe Profile",
    welcome: "Welcome",
    lastLogin: "Last login",
    yourAvailability: "Your Availability",
    status: "Status",
    onlineAvailable: "Online - Available for calls",
    offline: "Offline",
    goOffline: "Go Offline",
    goOnline: "Go Online",
    yourProfile: "Your Profile",
    name: "Name",
    aadhaar: "Aadhaar",
    mobile: "Mobile",
    email: "Email",
    notProvided: "Not provided",
    role: "Role",
    qualification: "Qualification",
    institute: "Institute",
    location: "Location",
    availableDates: "Available Dates",
    qualificationDocument: "Qualification Document",
    viewDocument: "View Document",
    notifications: "Notifications",
    studentsSeeStatus: "Students can see your online status and call you when needed. Make sure to update your status when you're available to help.",
    hindi: "हिंदी",
    english: "English"
  },
  hi: {
    settings: "सेटिंग्स",
    helpSupport: "सहायता समर्थन",
    scribeProfile: "स्क्राइब प्रोफ़ाइल",
    welcome: "स्वागत है",
    lastLogin: "अंतिम लॉगिन",
    yourAvailability: "आपकी उपलब्धता",
    status: "स्थिति",
    onlineAvailable: "ऑनलाइन - कॉल के लिए उपलब्ध",
    offline: "ऑफलाइन",
    goOffline: "ऑफलाइन जाएं",
    goOnline: "ऑनलाइन जाएं",
    yourProfile: "आपकी प्रोफ़ाइल",
    name: "नाम",
    aadhaar: "आधार",
    mobile: "मोबाइल",
    email: "ईमेल",
    notProvided: "प्रदान नहीं किया गया",
    role: "भूमिका",
    qualification: "योग्यता",
    institute: "संस्थान",
    location: "स्थान",
    availableDates: "उपलब्ध तिथियाँ",
    qualificationDocument: "योग्यता दस्तावेज़",
    viewDocument: "दस्तावेज़ देखें",
    notifications: "सूचनाएँ",
    studentsSeeStatus: "छात्र आपकी ऑनलाइन स्थिति देख सकते हैं और आवश्यकता पड़ने पर आपको कॉल कर सकते हैं। जब भी आप सहायता के लिए उपलब्ध हों, अपनी स्थिति अपडेट करें।",
    hindi: "हिंदी",
    english: "English"
  }
};

export default function ScribeDashboard() {
  const router = useRouter();
  const { socket } = useSocket();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language === 'en' ? 'en' : 'hi'];

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('offline');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.post("/api/scribe/getdata");
        if(res){
          setUser(res.data.data);
        } else {
          alert("login first");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    if (socket && user) {
      socket.emit('register', {
        role: user.role,
        id: user._id,
        aadhaar: user.aadhaarNumber,
        date : user.availableDates,
        class : user.highestQualification
      });
      setStatus('available');
      socket.on('user-joined', (userData) => {
        if (userData.role === 'Student') {
          // Could show notification
        }
      });
    }
    return () => {
      if (socket) socket.off('user-joined');
    };
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;
    const handleUserJoined = (userData) => {};
    socket.on("user-joined", handleUserJoined);
    return () => socket.off("user-joined", handleUserJoined);
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const handleCallInvite = (data) => {
        if (window.confirm(`Student ${data.from.fullName} is calling. Join call?`)) {
          router.push(`/call/${data.roomId}?target=${data.from.id}`);
        }
      };
      socket.on("call-invite", handleCallInvite);
      return () => socket.off("call-invite", handleCallInvite);
    }
  }, [socket, router]);
  
  const toggleStatus = () => {
    const newStatus = status === 'available' ? 'offline' : 'available';
    setStatus(newStatus);
    if (socket && user) {
      socket.emit('status-update', {
        id: user._id,
        status: newStatus
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">{language === 'en' ? "Loading..." : "लोड हो रहा है..."}</div>;
  }

  const formatDate = (date) => {
    return date.toLocaleDateString(language === "en" ? 'en-GB' : 'hi-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');
  };

  const currentDate = new Date();
  const formattedDate = `${formatDate(currentDate)}, ${currentDate.toLocaleTimeString(language === "en" ? 'en-US' : 'hi-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}`;

  const formatAvailableDates = () => {
    if (!user?.availableDates || user.availableDates.length === 0) {
      return language === "en" ? "No dates set" : "कोई तिथि निर्धारित नहीं";
    }
    return user.availableDates.slice(0, 2).map(date => 
      new Date(date).toLocaleDateString(language === "en" ? 'en-GB' : 'hi-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    ).join(", ") + (user.availableDates.length > 2 ? (language === "en" ? " and more..." : " और भी...") : "");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-green-500 text-white flex items-center justify-between px-8 py-4 shadow">
        <div className="flex items-center space-x-8">
          <span className="font-bold text-xl">{t.scribeProfile}</span>
          <nav className="flex space-x-6 font-medium">
          
          </nav>
        </div>
        {/* Profile Avatar and Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 text-lg font-bold">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div className="text-right">
            <div className="font-semibold">{user?.fullName || 'Scribe Name'}</div>  
            <div className="text-xs">{t.scribeProfile}</div>
          </div>
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="ml-4 text-sm bg-white text-green-600 font-medium px-3 py-1 rounded shadow hover:bg-green-100 transition"
          >
            {language === 'en' ? t.hindi : t.english}
          </button>
        </div>
      </header>

      {/* Main content with top padding to offset fixed header */}
      <main className="flex-1 pt-28 px-4">
        {/* Welcome message */}
        <div className="mb-4">
          <h2 className="text-lg font-bold">{t.welcome}, {user?.fullName || 'Scribe'}!</h2>
          <p className="text-sm text-gray-600">{t.lastLogin}: {formattedDate}</p>
        </div>

        {/* Status Toggle */}
        <div className="mb-4 border rounded p-4">
          <h2 className="text-lg font-bold text-green-800 mb-2">{t.yourAvailability}</h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${status === 'available' ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></div>
              <p>{t.status}: <span className="font-medium">{status === 'available' ? t.onlineAvailable : t.offline}</span></p>
            </div>
            <button 
              onClick={toggleStatus}
              className={`px-4 py-2 rounded text-white ${status === 'available' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {status === 'available' ? t.goOffline : t.goOnline}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mb-4 border rounded p-4">
          <h2 className="text-lg font-bold text-green-800 mb-2">{t.yourProfile}</h2>
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><span className="font-medium">{t.name}:</span> {user.fullName}</p>
                <p><span className="font-medium">{t.aadhaar}:</span> {user.aadhaarNumber}</p>
                <p><span className="font-medium">{t.mobile}:</span> {user.mobileNumber}</p>
                <p><span className="font-medium">{t.email}:</span> {user.email || t.notProvided}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">{t.role}:</span> {user.role}</p>
                <p><span className="font-medium">{t.qualification}:</span> {user.highestQualification}</p>
                <p><span className="font-medium">{t.institute}:</span> {user.institute}</p>
                <p><span className="font-medium">{t.location}:</span> {user.district}, {user.state}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <p><span className="font-medium">{t.availableDates}:</span> {formatAvailableDates()}</p>
                <p className="mt-2"><span className="font-medium">{t.qualificationDocument}:</span> 
                  <a href={user.qualificationPdfLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">{t.viewDocument}</a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Area */}
        <div className="mb-4 border rounded p-4">
          <h2 className="text-lg font-bold text-green-800 mb-2">{t.notifications}</h2>
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-sm">{t.studentsSeeStatus}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
