'use client';
import { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

// Translation object for English and Hindi
const translations = {
  en: {
    menu: "MENU",
    myRequests: "My Requests",
    logout: "Logout",
    studentDashboard: "Student Dashboard",
    hindi: "हिंदी",
    english: "English",
    welcome: "Welcome",
    lastLogin: "Last login",
    onlineScribes: "Online Scribes",
    available: "Available",
    inCall: "In Call",
    startCall: "Start Call",
    busy: "Busy",
    noScribesOnline: "No scribes are currently online. Check back later or search all available scribes below.",
    allAvailableScribes: "All Available Scribes",
    loadAllScribes: "Load All Scribes",
    filterScribes: "Filter Scribes",
    availableDate: "Available Date",
    resetFilters: "Reset Filters",
    bookScribe: "Book Scribe",
    qualification: "Qualification",
    institute: "Institute",
    location: "Location",
    contact: "Contact",
    email: "Email",
    viewQualification: "View Qualification Document",
    availableDates: "Available Dates",
    clickLoadAll: 'Click "Load All Scribes" to view available scribes.',
    recentSessions: "Recent Support Sessions",
    upcomingExams: "Upcoming Examinations",
    completed: "Completed",
    studentName: "Student Name",
    class: "class",
    noData: "no data"
  },
  hi: {
    menu: "मेनू",
    myRequests: "मेरी अनुरोधें",
    logout: "लॉगआउट",
    studentDashboard: "छात्र डैशबोर्ड",
    hindi: "हिंदी",
    english: "English",
    welcome: "स्वागत है",
    lastLogin: "अंतिम लॉगिन",
    onlineScribes: "ऑनलाइन स्क्राइब्स",
    available: "उपलब्ध",
    inCall: "कॉल में",
    startCall: "कॉल शुरू करें",
    busy: "व्यस्त",
    noScribesOnline: "कोई स्क्राइब्स अभी ऑनलाइन नहीं हैं। बाद में पुनः प्रयास करें या नीचे सभी उपलब्ध स्क्राइब्स खोजें।",
    allAvailableScribes: "सभी उपलब्ध स्क्राइब्स",
    loadAllScribes: "सभी स्क्राइब्स लोड करें",
    filterScribes: "स्क्राइब्स छांटें",
    availableDate: "उपलब्ध तिथि",
    resetFilters: "फिल्टर रीसेट करें",
    bookScribe: "स्क्राइब बुक करें",
    qualification: "योग्यता",
    institute: "संस्थान",
    location: "स्थान",
    contact: "संपर्क",
    email: "ईमेल",
    viewQualification: "योग्यता दस्तावेज़ देखें",
    availableDates: "उपलब्ध तिथियाँ",
    clickLoadAll: '"सभी स्क्राइब्स लोड करें" पर क्लिक करें।',
    recentSessions: "हाल की सहायता सत्र",
    upcomingExams: "आगामी परीक्षाएँ",
    completed: "पूर्ण",
    studentName: "छात्र का नाम",
    class: "कक्षा",
    noData: "कोई डेटा नहीं"
  }
};

export default function StudentDashboard() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [user, setUser] = useState(null);
  const [onlineScribes, setOnlineScribes] = useState([]);
  const [allScribes, setAllScribes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language === 'en' ? 'en' : 'hi'];
  const [filteredScribes, setFilteredScribes] = useState(onlineScribes);
  const [AllfilteredScribes, AllsetFilteredScribes] = useState(allScribes);
  const [recentSessions, setRecentSessions] = useState([
    { subject: 'Mathematics', date: '05-Apr-2025', status: t.completed },
    { subject: 'Physics Lab Report', date: '01-Apr-2025', status: t.completed }
  ]);
  const [upcomingExams, setUpcomingExams] = useState([
    { subject: 'CBSE Physics', date: '15-Apr-2025' },
    { subject: 'CBSE Chemistry', date: '20-Apr-2025' },
    { subject: 'CBSE Mathematics', date: '25-Apr-2025' }
  ]);

  // Get user data on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.post("/api/student/getdata");
        if (res) {
          setUser(res.data.data);
        } else {
          alert("Login first");
          router.push('/login');
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        router.push('/login');
      }
    };
    getUserData();
  }, []);

  // Register with socket
  useEffect(() => {
    if (socket && user) {
      socket.emit('register', {
        role: user.role,
        id: user._id,
        aadhaar: user.aadhaarNumber,
        class: user.educationLevel,
        date: "0-0-0"
      });
      socket.on('scribes-online', (scribes) => {
        setOnlineScribes(scribes);
        setFilteredScribes(scribes);
      });
    }
    return () => {
      if (socket) socket.off('scribes-online');
    };
  }, [socket, user]);

  // Fetch all scribes data
  const fetchAllScribes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/fatchallscribes");
      if (response && response.data) {
        setAllScribes(response.data);
        AllsetFilteredScribes(response.data);
      } else {
        setAllScribes([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllScribes();
  }, []);

  // Filter logic
  const toLocalDateString = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-CA");
  };

  useEffect(() => {
    if (!filterDate) {
      setFilteredScribes(onlineScribes);
    } else {
      const filtered = onlineScribes.filter((scribe) =>
        Array.isArray(scribe.date) &&
        scribe.date.some((d) => toLocalDateString(d) === filterDate)
      );
      setFilteredScribes(filtered);
    }
  }, [filterDate, onlineScribes]);

  useEffect(() => {
    if (!filterDate) {
      AllsetFilteredScribes(allScribes);
    } else {
      const filtered = allScribes.filter((scribe) =>
        Array.isArray(scribe.availableDates) &&
        scribe.availableDates.some((d) => toLocalDateString(d) === filterDate)
      );
      AllsetFilteredScribes(filtered);
    }
  }, [filterDate, allScribes]);

  // Call logic
  const startCall = (scribeId) => {
    if (!user || !scribeId) return;
    const roomId = `room_${[user._id, scribeId].sort().join('_')}`;
    socket.emit("call-request", {
      roomId,
      target: scribeId,
      from: { id: user._id, role: user.role, fullName: user.fullName }
    });
    router.push(`/call/${roomId}?target=${scribeId}`);
  };

  // Date formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');
  };

  const currentDate = new Date();
  const formattedDateTime = `${formatDate(currentDate)}, ${currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}`;

  // Reset filters
  const resetFilters = () => {
    setFilterDate("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-black flex-col">
      {/* Header */}
      <div className="bg-orange-500 fixed w-full  text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t.studentDashboard}</h1>
          <div className="flex items-center space-x-4">
          <a href='/studentProfile'>
            <div className="p-2 border rounded-lg bg-orange-100 text-black text-center">
              <div className="font-semibold">{user?.fullName || t.studentName}</div>
              <div className="text-sm">{t.class} {user?.educationLevel || t.noData}</div>
            </div>
          </a>
            <button
              onClick={toggleLanguage}
              className="text-sm bg-white text-orange-500 font-medium px-3 py-1 rounded shadow hover:bg-orange-100 transition"
            >
              {language === 'en' ? t.hindi : t.english}
            </button>
           
            <button onClick={async () => {
              try {
                await axios.post("/api/student/logout");
                router.push('/');
              } catch (error) {}
            }} className="hover:underline font-medium">{t.logout}</button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
  

        {/* Content */}
        <div className="p-6 mt-28">
          {/* Welcome message */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-900">{t.welcome}, {user?.fullName || t.studentName}!</h2>
            <p className="text-sm text-gray-600">{t.lastLogin}: {formattedDateTime}</p>
          </div>

          {/* Online Scribes Section */}
          <div className="mb-6 bg-white border rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-blue-900 mb-4">{t.onlineScribes}</h2>
            {filteredScribes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScribes.map((scribe) => (
                  <div key={scribe.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
                    <div className="flex items-center mb-2">
                      <div className={`w-3 h-3 rounded-full ${scribe.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                      <span className="font-medium">{scribe.status === 'available' ? t.available : t.inCall}</span>
                    </div>
                    <h3 className="font-medium">Scribe ID: {scribe.aadhaar}</h3>
                    <button
                      onClick={() => startCall(scribe.id)}
                      disabled={scribe.status !== 'available'}
                      className={`mt-3 w-full px-4 py-2 rounded text-white ${
                        scribe.status === 'available' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {scribe.status === 'available' ? t.startCall : t.busy}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-blue-50 rounded">
                <p>{t.noScribesOnline}</p>
              </div>
            )}
          </div>

          {/* All Scribes Section with Filters */}
          <div className="mb-6 bg-white border rounded-lg p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-900">{t.allAvailableScribes}</h2>
              <button 
                onClick={fetchAllScribes}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                {t.loadAllScribes}
              </button>
            </div>

            {/* Filters */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">{t.filterScribes}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.availableDate}</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
                  >
                    {t.resetFilters}
                  </button>
                </div>
              </div>
            </div>
            {/* Scribes List */}
            {allScribes.length > 0 ? (
              <div>
                {AllfilteredScribes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {AllfilteredScribes.map((scribe) => (
                      <div key={scribe._id} className="border rounded-lg p-4  shadow hover:shadow-md transition">
                        <h3 className="font-medium">{scribe.fullName}</h3>
                        <p className="text-sm text-gray-600">{t.qualification}: {scribe.highestQualification}</p>
                        <p className="text-sm text-gray-600">{t.institute}: {scribe.institute}</p>
                        <p className="text-sm text-gray-600 mb-3">{t.location}: {scribe.district}, {scribe.state}</p>
                        <div className='h-15'>
                        {scribe.availableDates && scribe.availableDates.length > 0 && (
                          <div className="mb-3 ">
                            <p className="text-sm font-medium">{t.availableDates}:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {scribe.availableDates.slice(0, 3).map((date, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 px-2 py-1 rounded">
                                  {formatDate(date)}
                                </span>
                              ))}
                              {scribe.availableDates.length > 3 && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  +{scribe.availableDates.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        </div>
                        <button
                          onClick={() => {
                            alert(`${t.bookScribe}: ${scribe.fullName}`);
                          }}
                          className="w-full mt-2 bg-orange-400  hover:bg-orange-500 text-white px-4 py-2 rounded"
                        >
                          {t.bookScribe}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <p>{t.noScribesOnline}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-4 bg-blue-50 rounded">
                <p>{t.clickLoadAll}</p>
              </div>
            )}
          </div>
          {/* Other Dashboard Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Sessions */}
            <div className="bg-white border rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold text-blue-900 mb-4">{t.recentSessions}</h2>
              <div className="space-y-3">
                {recentSessions.map((session, index) => (
                  <div key={index} className="p-3 border-b last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{session.subject}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        session.status === t.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{session.status}</span>
                    </div>
                    <p className="text-sm text-gray-600">{session.date}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Upcoming Exams */}
            <div className="bg-white border rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold text-blue-900 mb-4">{t.upcomingExams}</h2>
              <div className="space-y-3">
                {upcomingExams.map((exam, index) => (
                  <div key={index} className="p-3 border-b last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{exam.subject}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{exam.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}