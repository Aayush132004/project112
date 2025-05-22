'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext'; // ✅ Update the path if needed

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLanguageSelect = (lang: 'en' | 'hi') => {
    toggleLanguage(lang);
    setDropdownOpen(false);
  };

  const t = {
    home: language === 'en' ? 'Home' : 'मुख्य पृष्ठ',
    about: language === 'en' ? 'About' : 'हमारे बारे में',
    schemes: language === 'en' ? 'Schemes' : 'योजनाएं',
    contact: language === 'en' ? 'Contact' : 'संपर्क करें',
    login: language === 'en' ? 'Login' : 'लॉगिन',
    register: language === 'en' ? 'Register' : 'रजिस्टर',
    student: language === 'en' ? 'Student' : 'विद्यार्थी',
    scribe: language === 'en' ? 'Scribe' : 'लेखक',
    studentDesc: language === 'en' ? 'Access educational support' : 'शैक्षिक सहायता प्राप्त करें',
    scribeDesc: language === 'en' ? 'Provide educational support' : 'शैक्षिक सहायता प्रदान करें',
    bannerTitle: language === 'en'
      ? 'Digital India Educational Initiative'
      : 'डिजिटल इंडिया शैक्षिक पहल',
    bannerLine1: language === 'en'
      ? 'Connecting students with qualified scribes across India for enhanced educational support'
      : 'छात्रों को बेहतर शैक्षिक सहायता के लिए भारत भर में योग्य लेखकों से जोड़ना',
    bannerLine2: language === 'en'
      ? 'A Ministry of Education initiative under the National Education Policy 2020'
      : 'राष्ट्रीय शिक्षा नीति 2020 के तहत शिक्षा मंत्रालय की एक पहल',
    languageLabel: language === 'en' ? 'Language:' : 'भाषा:',
    english: 'English',
    hindi: 'हिन्दी',
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-orange-400 py-3 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-900 rounded-full w-14 h-14 flex items-center justify-center mr-3">
              <div className="bg-white rounded-full w-8 h-8"></div>
            </div>
            <span className="text-white text-2xl font-bold">VidyaSetu</span>
          </div>

          <nav className="flex items-center space-x-8">
            <a href="/studentlogin">
              <button className="bg-white text-blue-900 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition">
                {t.login}
              </button>
            </a>
            <a href="/studentsignup">
              <button className="bg-blue-900 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-800 transition">
                {t.register}
              </button>
            </a>
          </nav>
        </div>
      </header>

      {/* Green divider */}
      <div className="h-3 bg-green-600"></div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">
        {/* Banner */}
        <div className="bg-blue-50 py-10 px-8 rounded-lg text-center mb-10 max-w-4xl mx-auto shadow-sm">
          <h1 className="text-4xl text-blue-900 font-bold mb-8">{t.bannerTitle}</h1>
          <p className="text-gray-700 text-lg mb-4">{t.bannerLine1}</p>
          <p className="text-gray-700 text-lg">{t.bannerLine2}</p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-10 max-w-4xl mx-auto">
          <a href="/studentlogin">
            <div className="border-2 border-orange-300 bg-orange-50 rounded-lg p-8 text-center hover:shadow-lg transition cursor-pointer transform hover:scale-105">
              <h2 className="text-xl mb-3 font-bold text-2xl">{t.student}</h2>
              <p className="text-gray-600 text-lg">{t.studentDesc}</p>
            </div>
          </a>
          <a href="/scribelogin">
            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-8 text-center hover:shadow-lg transition cursor-pointer transform hover:scale-105">
              <h2 className="text-xl mb-3 font-bold text-2xl">{t.scribe}</h2>
              <p className="text-gray-600 text-lg">{t.scribeDesc}</p>
            </div>
          </a>
        </div>

        {/* Language Selector - List Style */}
        <div className="flex justify-center relative">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="border border-gray-300 rounded-md px-4 py-2 flex items-center cursor-pointer hover:bg-gray-50"
          >
            <span className="mr-2">🌐</span>
            <span className="mr-1 font-medium">{t.languageLabel}</span>
            <span className="mr-1">{language === 'en' ? t.english : t.hindi}</span>
            {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {dropdownOpen && (
            <div className="absolute top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 w-48">
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLanguageSelect('en')}
              >
                {t.english}
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLanguageSelect('hi')}
              >
                {t.hindi}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gray-100 border-t mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center border-t border-gray-200 pt-6">
              <p className="text-gray-600 mb-2">© 2024 VidyaSetu - Ministry of Education, Government of India</p>
              <p className="text-sm text-gray-500">Developed by Students of IIIT Bhopal</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
