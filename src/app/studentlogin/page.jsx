'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext'; // make sure path is correct

export default function Login() {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage(); // Context usage

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadhaarNumber || !password) {
      setError(language === 'en' ? 'Please fill in all required fields' : 'कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    try {
      const res = await axios.post('/api/student/login', { aadhaarNumber, password });
      if (res.status === 200) {
        console.log("login successful");
      } else {
        alert(language === 'en' ? 'Invalid credentials. Please try again.' : 'अमान्य प्रमाण-पत्र। कृपया पुनः प्रयास करें।');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-black ">
      <Head>
        <title>{language === 'en' ? 'Student Login' : 'छात्र लॉगिन'}</title>
        <meta name="description" content="Student login page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-orange-500  text-white py-5 text-center shadow-md relative">
        <h1 className="text-2xl font-semibold">
          {language === 'en' ? 'Student Login' : 'छात्र लॉगिन'}
        </h1>
        <button
          onClick={toggleLanguage}
          className="absolute right-6 top-5 text-sm bg-white text-orange-500 font-medium px-3 py-1 rounded shadow hover:bg-orange-100 transition"
        >
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
      </header>

      <main className="flex-1 flex justify-center items-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-800 py-4 px-6 text-white">
            <h2 className="text-xl font-medium">
              {language === 'en' ? 'Welcome Back' : 'फिर से स्वागत है'}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {language === 'en'
                ? 'Please login to access your student account'
                : 'कृपया अपने छात्र खाते तक पहुँचने के लिए लॉगिन करें'}
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="aadhaarNumber" className="block mb-2 font-medium text-gray-700">
                  {language === 'en' ? 'Aadhaar Number' : 'आधार संख्या'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="aadhaarNumber"
                  placeholder="xxxx-xxxx-xxxx"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                  {language === 'en' ? 'Password' : 'पासवर्ड'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder={language === 'en' ? 'Enter your password' : 'अपना पासवर्ड दर्ज करें'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" />
                  <span className="ml-2">{language === 'en' ? 'Remember me' : 'मुझे याद रखें'}</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-800 hover:text-blue-600 font-medium">
                  {language === 'en' ? 'Forgot password?' : 'पासवर्ड भूल गए?'}
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 font-medium text-center shadow-md"
              >
                {language === 'en' ? 'Login' : 'लॉग इन करें'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                {language === 'en' ? "Don't have an account?" : 'कोई खाता नहीं है?'}{' '}
                <Link href="/studentsignup" className="text-orange-500 hover:text-orange-600 font-medium">
                  {language === 'en' ? 'Register here' : 'यहाँ पंजीकरण करें'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
