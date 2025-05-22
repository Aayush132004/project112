'use client';
import { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

// Translation object for all UI text
const translations = {
  en: {
    menu: "MENU",
    mySchedule: "My Schedule",
    sessions: "Sessions",
    notes: "Notes",
    settings: "Settings",
    helpSupport: "Help support",
    studentName: "Student Name",
    student: "Student",
    studentProfile: "Student Profile",
    hindi: "हिंदी",
    english: "English",
    welcome: "Welcome",
    lastLogin: "Last login",
    yourAvailability: "Your Availability",
    status: "Status",
    onlineAvailable: "Online - Available for sessions",
    offline: "Offline",
    goOffline: "Go Offline",
    goOnline: "Go Online",
    requestScribe: "Request Scribe",
    yourProfile: "Your Profile",
    name: "Name",
    aadhaar: "Aadhaar",
    mobile: "Mobile",
    email: "Email",
    notProvided: "Not provided",
    role: "Role",
    educationLevel: "Education Level",
    institution: "Institution",
    location: "Location",
    disability: "Disability",
    recentSupportSessions: "Recent Support Sessions",
    subject: "Subject",
    scribe: "Scribe",
    date: "Date",
    time: "Time",
    statusCol: "Status",
    upcomingSchedule: "Upcoming Schedule",
    noUpcoming: "No upcoming sessions scheduled.",
    needHelp: "Need Help?",
    helpInfo: "Click on \"Request Scribe\" to find available scribes who can assist you. Make sure you're online to receive assistance.",
    completed: "Completed",
    loading: "Loading..."
  },
  hi: {
    menu: "मेनू",
    mySchedule: "मेरा शेड्यूल",
    sessions: "सत्र",
    notes: "नोट्स",
    settings: "सेटिंग्स",
    helpSupport: "सहायता समर्थन",
    studentName: "छात्र का नाम",
    student: "छात्र",
    studentProfile: "छात्र प्रोफ़ाइल",
    hindi: "हिंदी",
    english: "English",
    welcome: "स्वागत है",
    lastLogin: "अंतिम लॉगिन",
    yourAvailability: "आपकी उपलब्धता",
    status: "स्थिति",
    onlineAvailable: "ऑनलाइन - सत्र के लिए उपलब्ध",
    offline: "ऑफलाइन",
    goOffline: "ऑफलाइन जाएं",
    goOnline: "ऑनलाइन जाएं",
    requestScribe: "स्क्राइब अनुरोध करें",
    yourProfile: "आपकी प्रोफ़ाइल",
    name: "नाम",
    aadhaar: "आधार",
    mobile: "मोबाइल",
    email: "ईमेल",
    notProvided: "प्रदान नहीं किया गया",
    role: "भूमिका",
    educationLevel: "शिक्षा स्तर",
    institution: "संस्थान",
    location: "स्थान",
    disability: "विकलांगता",
    recentSupportSessions: "हाल की सहायता सत्र",
    subject: "विषय",
    scribe: "स्क्राइब",
    date: "तिथि",
    time: "समय",
    statusCol: "स्थिति",
    upcomingSchedule: "आगामी शेड्यूल",
    noUpcoming: "कोई आगामी सत्र निर्धारित नहीं है।",
    needHelp: "मदद चाहिए?",
    helpInfo: "उपलब्ध स्क्राइब्स खोजने के लिए \"स्क्राइब अनुरोध करें\" पर क्लिक करें। सहायता प्राप्त करने के लिए सुनिश्चित करें कि आप ऑनलाइन हैं।",
    completed: "पूर्ण",
    loading: "लोड हो रहा है..."
  }
};

// Subject translations
const subjectTranslations = {
  "Mathematics Exam": { en: "Mathematics Exam", hi: "गणित परीक्षा" },
  "Physics Lab Report": { en: "Physics Lab Report", hi: "भौतिक विज्ञान प्रयोगशाला रिपोर्ट" },
  "Chemistry Support": { en: "Chemistry Support", hi: "रसायन विज्ञान सहायता" },
  "Mathematics Help": { en: "Mathematics Help", hi: "गणित सहायता" },
  "Mathematics": { en: "Mathematics", hi: "गणित" },
  "Physics": { en: "Physics", hi: "भौतिक विज्ञान" },
  "Chemistry": { en: "Chemistry", hi: "रसायन विज्ञान" },
  "Biology": { en: "Biology", hi: "जीव विज्ञान" },
  "English": { en: "English", hi: "अंग्रेज़ी" },
  "Hindi": { en: "Hindi", hi: "हिंदी" },
  "Social Science": { en: "Social Science", hi: "सामाजिक विज्ञान" },
  "Computer Science": { en: "Computer Science", hi: "कंप्यूटर विज्ञान" }
  // Add more as needed
};

function getSubjectLabel(subject, lang) {
  return subjectTranslations[subject]?.[lang] || subject;
}

export default function StudentDashboard() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('offline');
  const [loading, setLoading] = useState(true);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language === 'en' ? 'en' : 'hi'];
  const [recentSessions, setRecentSessions] = useState([
    { subject: 'Mathematics Exam', scribe: 'Abhay Jadon', date: '05-Apr-2025', status: 'Completed' },
    { subject: 'Physics Lab Report', scribe: 'Priya Patel', date: '01-Apr-2025', status: 'Completed' }
  ]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([
    { subject: 'Chemistry Support', scribe: 'Raj Sharma', date: '17-Apr-2025', time: '10:00 AM' },
    { subject: 'Mathematics Help', scribe: 'Meera Gupta', date: '22-Apr-2025', time: '2:30 PM' }
  ]);
  
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.post("/api/student/getdata");
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
        class : user.educationLevel,
        date : "0-0-0"
      });
      setStatus('available');
      socket.on('user-joined', (userData) => {
        if (userData.role === 'Scribe') {
          // Scribe joined
        }
      });
    }
    return () => {
      if (socket) {
        socket.off('user-joined');
      }
    };
  }, [socket, user]);

  useEffect(() => {
    if (socket) {
      const handleCallResponse = (data) => {
        if (data.accepted) {
          router.push(`/call/${data.roomId}?target=${data.from.id}`);
        } else {
          alert(`Scribe ${data.from.fullName} declined your call request.`);
        }
      };
      socket.on("call-response", handleCallResponse);
      return () => {
        socket.off("call-response", handleCallResponse);
      };
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

  const requestScribe = () => {
    router.push('/find-scribe');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">{t.loading}</div>;
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
  
  return (
    <div className="flex flex-col min-h-screen bg-orange-50 text-black">
      {/* Fixed Header with Menu Items */}
      <header className="fixed top-0 left-0 w-full z-50 bg-orange-500 text-white flex items-center justify-between px-8 py-4 shadow">
        <div className="flex items-center space-x-8">
          <span className="font-bold text-xl">{t.menu}</span>
         
        </div>
        {/* Profile Avatar and Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 text-lg font-bold">
            {user?.fullName?.charAt(0) || t.studentName.charAt(0)}
          </div>
          <div className="text-right">
            <div className="font-semibold">{user?.fullName || t.studentName}</div>
            <div className="text-xs">{t.student}</div>
          </div>
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="ml-4 text-sm bg-white text-orange-500 font-medium px-3 py-1 rounded shadow hover:bg-orange-100 transition"
          >
            {language === 'en' ? t.hindi : t.english}
          </button>
        </div>
      </header>
  
      {/* Main content with top padding to offset fixed header */}
      <main className="flex-1 pt-28 px-4">
        {/* Welcome message */}
        <div className="mb-4">
          <h2 className="text-lg font-bold">{t.welcome}, {user?.fullName || t.studentName}!</h2>
          <p className="text-sm text-gray-600">{t.lastLogin}: {formattedDate}</p>
        </div>
  
        {/* Status Toggle */}
        <div className="mb-4 border rounded p-4">
          <h2 className="text-lg font-bold text-orange-800 mb-2">{t.yourAvailability}</h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${status === 'available' ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></div>
              <p>{t.status}: <span className="font-medium">{status === 'available' ? t.onlineAvailable : t.offline}</span></p>
            </div>
            <div className="space-x-2">
              <button 
                onClick={toggleStatus}
                className={`px-4 py-2 rounded text-white ${status === 'available' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {status === 'available' ? t.goOffline : t.goOnline}
              </button>
              <button 
                onClick={requestScribe}
                className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 text-white"
              >
                {t.requestScribe}
              </button>
            </div>
          </div>
        </div>
  
        {/* Profile Information */}
        <div className="mb-4 border rounded p-4">
          <h2 className="text-lg font-bold text-orange-800 mb-2">{t.yourProfile}</h2>
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
                <p><span className="font-medium">{t.educationLevel}:</span> {user.educationLevel}</p>
                <p><span className="font-medium">{t.institution}:</span> {user.educationalInstitution}</p>
                <p><span className="font-medium">{t.location}:</span> {user.district}, {user.state}</p>
                {user.disability && <p><span className="font-medium">{t.disability}:</span> {user.disability}</p>}
              </div>
            </div>
          )}
        </div>
  
        {/* Recent Sessions */}
        <div className="mb-4 border rounded p-4">
          <h2 className="text-lg font-bold text-orange-800 mb-2">{t.recentSupportSessions}</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">{t.subject}</th>
                <th className="text-left py-2">{t.scribe}</th>
                <th className="text-left py-2">{t.date}</th>
                <th className="text-left py-2">{t.statusCol}</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{getSubjectLabel(session.subject, language)}</td>
                  <td className="py-2">{session.scribe}</td>
                  <td className="py-2">{session.date}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                      {language === "en" ? t.completed : t.completed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Upcoming Schedule */}
        <div className="mb-4 border rounded p-4">
          <h2 className="text-lg font-bold text-orange-800 mb-2">{t.upcomingSchedule}</h2>
          {upcomingSchedule.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">{t.subject}</th>
                  <th className="text-left py-2">{t.scribe}</th>
                  <th className="text-left py-2">{t.date}</th>
                  <th className="text-left py-2">{t.time}</th>
                </tr>
              </thead>
              <tbody>
                {upcomingSchedule.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{getSubjectLabel(item.subject, language)}</td>
                    <td className="py-2">{item.scribe}</td>
                    <td className="py-2">{item.date}</td>
                    <td className="py-2">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">{t.noUpcoming}</p>
          )}
        </div>
  
        {/* Help Info Area */}
        <div className="mb-4 border rounded p-4">
          <h2 className="text-lg font-bold text-orange-800 mb-2">{t.needHelp}</h2>
          <div className="bg-orange-50 p-3 rounded border border-orange-200">
            <p className="text-sm">{t.helpInfo}</p>
          </div>
        </div>
      </main>
    </div>
  );
  
}
