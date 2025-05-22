'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

// Translation object for English and Hindi
const translations = {
  en: {
    title: "Scribe Login",
    welcomeBack: "Welcome Back",
    loginToAccount: "Please login to access your scribe account",
    aadhaarLabel: "Aadhaar Number",
    aadhaarPlaceholder: "xxxx-xxxx-xxxx",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    login: "Login",
    dontHaveAccount: "Don't have an account?",
    registerHere: "Register here",
    requiredFields: "Please fill in all required fields",
    loginSuccessful: "Login successful",
    invalidCredentials: "Invalid credentials. Please try again.",
    copyright: "Student Portal. All rights reserved.",
    hindi: "हिंदी",
    english: "English"
  },
  hi: {
    title: "स्क्राइब लॉगिन",
    welcomeBack: "वापसी पर स्वागत है",
    loginToAccount: "कृपया अपने स्क्राइब खाते में लॉगिन करें",
    aadhaarLabel: "आधार नंबर",
    aadhaarPlaceholder: "xxxx-xxxx-xxxx",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    rememberMe: "मुझे याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    login: "लॉगिन",
    dontHaveAccount: "क्या आपका खाता नहीं है?",
    registerHere: "यहाँ पंजीकरण करें",
    requiredFields: "कृपया सभी आवश्यक फ़ील्ड भरें",
    loginSuccessful: "लॉगिन सफल",
    invalidCredentials: "अमान्य विवरण। कृपया पुनः प्रयास करें।",
    copyright: "स्टूडेंट पोर्टल। सर्वाधिकार सुरक्षित।",
    hindi: "हिंदी",
    english: "English"
  }
};

export default function Login() {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language === 'en' ? 'en' : 'hi'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadhaarNumber || !password) {
      setError(t.requiredFields);
      return;
    }
    try {
      const res = await axios.post("/api/scribe/login", { aadhaarNumber, password });
      if (res.status === 200) {
        router.push('/scribedashboard');
      } else {
        setError(t.invalidCredentials);
      }
    } catch (error) {
      setError(t.invalidCredentials);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-black">
      <Head>
        <title>{t.title}</title>
        <meta name="description" content="Student login page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-green-600 text-white py-5 text-center shadow-md relative">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <button
          onClick={toggleLanguage}
          className="absolute right-6 top-5 text-sm bg-white text-green-600 font-medium px-3 py-1 rounded shadow hover:bg-green-100 transition"
        >
          {language === 'en' ? t.hindi : t.english}
        </button>
      </header>

      <main className="flex-1 flex justify-center items-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-800 py-4 px-6 text-white">
            <h2 className="text-xl font-medium">{t.welcomeBack}</h2>
            <p className="text-blue-100 text-sm mt-1">{t.loginToAccount}</p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-green-500 text-green-700 rounded">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="aadhaarNumber" className="block mb-2 font-medium text-gray-700">
                  {t.aadhaarLabel}<span className="text-green-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="aadhaarNumber"
                    placeholder={t.aadhaarPlaceholder}
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                  {t.passwordLabel}<span className="text-green-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    {t.rememberMe}
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" className="text-blue-800 hover:text-blue-600 font-medium">
                    {t.forgotPassword}
                  </Link>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium text-center shadow-md"
              >
                {t.login}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                {t.dontHaveAccount}{' '}
                <Link href="/scribesignup" className="text-green-500 hover:text-green-600 font-medium">
                  {t.registerHere}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

     
    </div>
  );
}
