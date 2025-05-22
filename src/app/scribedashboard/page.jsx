'use client';
import { useState, useEffect } from 'react';
import { Calendar, MessageSquare, Clock, CheckCircle, ArrowLeft, ArrowRight, Phone, PhoneOff } from 'lucide-react';
import useSocket from '../hooks/useSocket';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

// Translation object for English and Hindi
const translations = {
  en: {
    menu: "MENU",
    mySchedule: "My Schedule",
    sessions: "Sessions",
    progressReport: "Progress Report",
    settings: "Settings",
    helpSupport: "Help Support",
    logout: "Logout",
    scribeDashboard: "Scribe Dashboard",
    welcome: "Welcome",
    lastLogin: "Last login",
    availabilityStatus: "Availability Status",
    availableForCalls: "Available for Calls",
    offline: "Offline",
    goOffline: "Go Offline",
    goOnline: "Go Online",
    webRTCConnected: "WebRTC Connected",
    connectingWebRTC: "Connecting to WebRTC service...",
    profileVisible: "Your profile is visible to students who need assistance",
    pendingRequests: "Pending Requests",
    accept: "Accept",
    decline: "Decline",
    chat: "Chat",
    noPendingRequests: "No pending requests",
    markAvailability: "Mark Your Availability",
    today: "Today",
    available: "Available",
    saveAvailability: "Save Availability",
    upcomingSchedules: "Upcoming Schedules",
    completedSessions: "Completed Sessions",
    profileSummary: "Profile Summary",
    aadhaar: "Aadhaar",
    mobile: "Mobile",
    email: "Email",
    location: "Location",
    notProvided: "Not provided",
    qualification: "Qualification",
    institute: "Institute",
    class: "Class",
    student: "Student",
    subject: "Subject",
    requestOn: "Requested on",
    hindi: "हिंदी",
    english: "English"
  },
  hi: {
    menu: "मेनू",
    mySchedule: "मेरा शेड्यूल",
    sessions: "सत्र",
    progressReport: "प्रगति रिपोर्ट",
    settings: "सेटिंग्स",
    helpSupport: "सहायता समर्थन",
    logout: "लॉगआउट",
    scribeDashboard: "स्क्राइब डैशबोर्ड",
    welcome: "स्वागत है",
    lastLogin: "अंतिम लॉगिन",
    availabilityStatus: "उपलब्धता स्थिति",
    availableForCalls: "कॉल के लिए उपलब्ध",
    offline: "ऑफलाइन",
    goOffline: "ऑफलाइन जाएं",
    goOnline: "ऑनलाइन जाएं",
    webRTCConnected: "WebRTC कनेक्टेड",
    connectingWebRTC: "WebRTC सेवा से कनेक्ट हो रहा है...",
    profileVisible: "आपकी प्रोफ़ाइल सहायता चाहने वाले छात्रों को दिख रही है",
    pendingRequests: "लंबित अनुरोध",
    accept: "स्वीकारें",
    decline: "अस्वीकारें",
    chat: "चैट",
    noPendingRequests: "कोई लंबित अनुरोध नहीं",
    markAvailability: "अपनी उपलब्धता चिह्नित करें",
    today: "आज",
    available: "उपलब्ध",
    saveAvailability: "उपलब्धता सहेजें",
    upcomingSchedules: "आगामी शेड्यूल",
    completedSessions: "पूर्ण सत्र",
    profileSummary: "प्रोफ़ाइल सारांश",
    aadhaar: "आधार",
    mobile: "मोबाइल",
    email: "ईमेल",
    location: "स्थान",
    notProvided: "प्रदान नहीं किया गया",
    qualification: "योग्यता",
    institute: "संस्थान",
    class: "कक्षा",
    student: "छात्र",
    subject: "विषय",
    requestOn: "अनुरोध तिथि",
    hindi: "हिंदी",
    english: "English"
  }
};

export default function ScribeDashboard() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language === 'en' ? 'en' : 'hi'];

  // User and status state
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('offline');
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [viewMonth, setViewMonth] = useState(new Date());

  // Sample data (replace with API in production)
  const pendingRequests = [
    {
      id: 1,
      studentName: 'Ramesh Kumar',
      subject: 'Math assistance',
      class: 'Class 10',
      requestDate: new Date(2025, 3, 15)
    },
    {
      id: 2,
      studentName: 'Priya Sharma',
      subject: 'English essay review',
      class: 'Class 12',
      requestDate: new Date(2025, 3, 16)
    }
  ];

  const upcomingSchedules = [
    {
      id: 1,
      studentName: 'Akash Patel',
      subject: 'Science tutoring',
      class: 'Class 9',
      scheduleDate: new Date(2025, 3, 18, 16, 0),
      endTime: new Date(2025, 3, 18, 17, 30)
    },
    {
      id: 2,
      studentName: 'Meera Singh',
      subject: 'History concepts',
      class: 'Class 11',
      scheduleDate: new Date(2025, 3, 20, 10, 0),
      endTime: new Date(2025, 3, 20, 11, 30)
    }
  ];

  const completedSessions = [
    {
      id: 1,
      studentName: 'Rahul Verma',
      subject: 'Mathematics',
      class: 'Class 8',
      sessionDate: new Date(2025, 3, 12, 15, 0),
      endTime: new Date(2025, 3, 12, 16, 30),
      hasFeedback: true
    },
    {
      id: 2,
      studentName: 'Ananya Gupta',
      subject: 'Physics',
      class: 'Class 12',
      sessionDate: new Date(2025, 3, 10, 17, 0),
      endTime: new Date(2025, 3, 10, 18, 30),
      hasFeedback: true
    }
  ];

  // Fetch user data
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.post("/api/scribe/getdata");
        if (res && res.data && res.status === 200) {
          let userData = res.data.data || res.data;
          setUser(userData);
          if (userData.availableDates && Array.isArray(userData.availableDates)) {
            const formattedDates = userData.availableDates.map(date => new Date(date));
            setSelectedDates(formattedDates);
          }
          setLoading(false);
          return;
        }
        setLoading(false);
        router.push('/login');
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
      }
    };
    getUserData();
  }, [router]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('register', {
        role: user.role,
        id: user._id || user.id,
        aadhaar: user.aadhaarNumber,
        date: user.availableDates,
        class: user.highestQualification
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
        id: user._id || user.id,
        status: newStatus
      });
    }
    if (newStatus === 'offline' && socket) {
      socket.emit('scribe-unavailable', { id: user._id || user.id });
    }
  };

  const handleDateClick = (day, month, year) => {
    const clickedDate = new Date(year, month, day, 12, 0, 0);
    const dateString = clickedDate.toDateString();
    const isSelected = selectedDates.some(d => d.toDateString() === dateString);
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => d.toDateString() !== dateString));
    } else {
      setSelectedDates([...selectedDates, clickedDate]);
    }
  };

  const saveAvailability = async () => {
    try {
      const response = await axios.post('/api/scribe/updateavailability', {
        availableDates: selectedDates,
        userId: user._id || user.id
      });
      if (response.status === 200) {
        alert(language === 'en' ? 'Availability saved successfully!' : 'उपलब्धता सफलतापूर्वक सहेजी गई!');
      } else {
        alert(language === 'en' ? 'Failed to save availability' : 'उपलब्धता सहेजने में विफल');
      }
    } catch (error) {
      alert(language === 'en' ? 'Error saving availability' : 'उपलब्धता सहेजने में त्रुटि');
    }
  };

  const prevMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  };

  const generateCalendarDays = () => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    const days = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({ day, month: month - 1, year, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month, year, isCurrentMonth: true });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, month: month + 1, year, isCurrentMonth: false });
    }
    return days;
  };

  const isDateAvailable = (day, month, year) => {
    const dateToCheck = new Date(year, month, day, 12, 0, 0);
    return selectedDates.some(d => d.toDateString() === dateToCheck.toDateString());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "en" ? 'en-GB' : 'hi-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(language === "en" ? 'en-US' : 'hi-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (day, month, year) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const now = new Date();
  const formattedDateTime = `${formatDate(now)}, ${now.toLocaleTimeString(language === "en" ? 'en-US' : 'hi-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}`;

  const calendarDays = generateCalendarDays();
  const monthYearString = viewMonth.toLocaleDateString(language === "en" ? 'en-US' : 'hi-IN', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        <span className="ml-3">{language === "en" ? "Loading..." : "लोड हो रहा है..."}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      {/* Header with Menu */}
      <header className="fixed top-0 left-0 w-full z-50 bg-orange-400 text-white flex items-center justify-between px-8 py-4 shadow">
        <div className="flex items-center space-x-8">
          <span className="font-bold text-xl">{t.scribeDashboard}</span>
         
        </div>
        {/* Profile Avatar and Name */}
        <div className="flex items-center space-x-3">
          <a href='/scribeProfile'>
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 text-lg font-bold">
              {user?.fullName?.charAt(0) || t.student.charAt(0)}
            </div>
          </a>
          <div className="text-right">
            <div className="font-semibold">{user?.fullName || t.student}</div>
            <div className="text-xs">{t.class} {user?.highestQualification || t.qualification}</div>
          </div>
          {/* Language Toggle */}
          
          <button
            onClick={toggleLanguage}
            className="ml-4 text-sm bg-white text-orange-500 font-medium px-3 py-1 rounded shadow hover:bg-orange-100 transition"
          >
            {language === 'en' ? t.hindi : t.english}
          </button>
          <nav className="flex space-x-6 font-medium">
           
           <button className="hover:underline" onClick={async () => {
             try {
               await axios.post("/api/student/logout");
               router.push('/');
             } catch (error) {
               console.error("Logout failed:", error);
             }
           }}>{t.logout}</button>
         </nav>
        </div>
      </header>

      {/* Main content with top padding to offset fixed header */}
      <main className="flex-1 pt-28 px-4">
        {/* Welcome message */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-900">{t.welcome}, {user?.fullName || t.student}!</h2>
          <p className="text-sm text-gray-600">{t.lastLogin}: {formattedDateTime}</p>
        </div>

        {/* Availability Status Section */}
        <div className="mb-6 bg-white border rounded-lg p-6 shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-900 mb-4">{t.availabilityStatus}</h2>
            <div className={`flex items-center px-4 py-2 rounded-lg ${status === 'available' ? 'bg-green-100' : 'bg-gray-200'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${status === 'available' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="mr-4">{status === 'available' ? t.availableForCalls : t.offline}</span>
              <button 
                onClick={toggleStatus}
                className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${status === 'available' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {status === 'available' ? (
                  <>
                    <PhoneOff size={16} />
                    {t.goOffline}
                  </>
                ) : (
                  <>
                    <Phone size={16} />
                    {t.goOnline}
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="font-medium">
                {isConnected ? t.webRTCConnected : t.connectingWebRTC}
              </span>
              {status === 'available' && isConnected && (
                <span className="ml-2 text-green-600">
                  {t.profileVisible}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pending Requests Section */}
        <div className="mb-6 bg-white border rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Clock size={22} />
            {t.pendingRequests}
          </h2>
          {pendingRequests.length === 0 ? (
            <div className="text-gray-500">{t.noPendingRequests}</div>
          ) : (
            <ul className="space-y-4">
              {pendingRequests.map(req => (
                <li key={req.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold">{req.studentName}</div>
                    <div className="text-sm">{t.subject}: {req.subject}</div>
                    <div className="text-xs text-gray-500">{t.class}: {req.class}</div>
                    <div className="text-xs text-gray-500">{t.requestOn}: {formatDate(req.requestDate)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">{t.accept}</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">{t.decline}</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"><MessageSquare size={16} />{t.chat}</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Calendar Section */}
        <div className="mb-6 bg-white border rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Calendar size={22} />
            {t.markAvailability}
          </h2>
          <div className="flex justify-between items-center mb-2">
            <button onClick={prevMonth}><ArrowLeft /></button>
            <span className="font-semibold">{monthYearString}</span>
            <button onClick={nextMonth}><ArrowRight /></button>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, idx) => (
              <div key={idx} className="text-center font-semibold">{d}</div>
            ))}
            {calendarDays.map((dayObj, idx) => (
              <button
                key={idx}
                className={`h-10 w-10 rounded-full text-center ${dayObj.isCurrentMonth ? 'bg-blue-50' : 'bg-gray-100'} ${isDateAvailable(dayObj.day, dayObj.month, dayObj.year) ? 'border-2 border-blue-500' : ''} ${isToday(dayObj.day, dayObj.month, dayObj.year) ? 'ring-2 ring-orange-400' : ''}`}
                onClick={() => dayObj.isCurrentMonth && handleDateClick(dayObj.day, dayObj.month, dayObj.year)}
                disabled={!dayObj.isCurrentMonth}
              >
                {dayObj.day}
              </button>
            ))}
          </div>
          <button
            onClick={saveAvailability}
            className="mt-4 bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded"
          >
            {t.saveAvailability}
          </button>
        </div>

        {/* Upcoming Schedules Section */}
        <div className="mb-6 bg-white border rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Clock size={22} />
            {t.upcomingSchedules}
          </h2>
          {upcomingSchedules.length === 0 ? (
            <div className="text-gray-500">{t.noPendingRequests}</div>
          ) : (
            <ul className="space-y-4">
              {upcomingSchedules.map(sch => (
                <li key={sch.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold">{sch.studentName}</div>
                    <div className="text-sm">{t.subject}: {sch.subject}</div>
                    <div className="text-xs text-gray-500">{t.class}: {sch.class}</div>
                    <div className="text-xs text-gray-500">{formatDate(sch.scheduleDate)} {formatTime(sch.scheduleDate)} - {formatTime(sch.endTime)}</div>
                  </div>
                  <div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">{t.chat}</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Completed Sessions Section */}
        <div className="mb-6 bg-white border rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <CheckCircle size={22} />
            {t.completedSessions}
          </h2>
          {completedSessions.length === 0 ? (
            <div className="text-gray-500">{t.noPendingRequests}</div>
          ) : (
            <ul className="space-y-4">
              {completedSessions.map(sess => (
                <li key={sess.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold">{sess.studentName}</div>
                    <div className="text-sm">{t.subject}: {sess.subject}</div>
                    <div className="text-xs text-gray-500">{t.class}: {sess.class}</div>
                    <div className="text-xs text-gray-500">{formatDate(sess.sessionDate)} {formatTime(sess.sessionDate)} - {formatTime(sess.endTime)}</div>
                  </div>
                  <div>
                    {sess.hasFeedback && <span className="text-green-600 font-bold">{t.completedSessions}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile Summary Section */}
        <div className="mb-6 bg-white border rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            {t.profileSummary}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2"><span className="font-semibold">{t.aadhaar}:</span> {user?.aadhaarNumber}</div>
              <div className="mb-2"><span className="font-semibold">{t.mobile}:</span> {user?.mobileNumber}</div>
              <div className="mb-2"><span className="font-semibold">{t.email}:</span> {user?.email || t.notProvided}</div>
              <div className="mb-2"><span className="font-semibold">{t.location}:</span> {user?.district}, {user?.state}</div>
            </div>
            <div>
              <div className="mb-2"><span className="font-semibold">{t.qualification}:</span> {user?.highestQualification}</div>
              <div className="mb-2"><span className="font-semibold">{t.institute}:</span> {user?.educationalInstitution}</div>
              <div className="mb-2"><span className="font-semibold">{t.class}:</span> {user?.className || t.notProvided}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
