'use client'
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

// All Indian states and union territories
const states = [
  { value: "andhra", en: "Andhra Pradesh", hi: "आंध्र प्रदेश" },
  { value: "arunachal", en: "Arunachal Pradesh", hi: "अरुणाचल प्रदेश" },
  { value: "assam", en: "Assam", hi: "असम" },
  { value: "bihar", en: "Bihar", hi: "बिहार" },
  { value: "chhattisgarh", en: "Chhattisgarh", hi: "छत्तीसगढ़" },
  { value: "goa", en: "Goa", hi: "गोवा" },
  { value: "gujarat", en: "Gujarat", hi: "गुजरात" },
  { value: "haryana", en: "Haryana", hi: "हरियाणा" },
  { value: "himachal", en: "Himachal Pradesh", hi: "हिमाचल प्रदेश" },
  { value: "jharkhand", en: "Jharkhand", hi: "झारखंड" },
  { value: "karnataka", en: "Karnataka", hi: "कर्नाटक" },
  { value: "kerala", en: "Kerala", hi: "केरल" },
  { value: "madhya", en: "Madhya Pradesh", hi: "मध्य प्रदेश" },
  { value: "maharashtra", en: "Maharashtra", hi: "महाराष्ट्र" },
  { value: "manipur", en: "Manipur", hi: "मणिपुर" },
  { value: "meghalaya", en: "Meghalaya", hi: "मेघालय" },
  { value: "mizoram", en: "Mizoram", hi: "मिज़ोरम" },
  { value: "nagaland", en: "Nagaland", hi: "नगालैंड" },
  { value: "odisha", en: "Odisha", hi: "ओडिशा" },
  { value: "punjab", en: "Punjab", hi: "पंजाब" },
  { value: "rajasthan", en: "Rajasthan", hi: "राजस्थान" },
  { value: "sikkim", en: "Sikkim", hi: "सिक्किम" },
  { value: "tamilnadu", en: "Tamil Nadu", hi: "तमिलनाडु" },
  { value: "telangana", en: "Telangana", hi: "तेलंगाना" },
  { value: "tripura", en: "Tripura", hi: "त्रिपुरा" },
  { value: "uttarpradesh", en: "Uttar Pradesh", hi: "उत्तर प्रदेश" },
  { value: "uttarakhand", en: "Uttarakhand", hi: "उत्तराखंड" },
  { value: "westbengal", en: "West Bengal", hi: "पश्चिम बंगाल" },
  // Union Territories
  { value: "andaman", en: "Andaman and Nicobar Islands", hi: "अंडमान और निकोबार द्वीपसमूह" },
  { value: "chandigarh", en: "Chandigarh", hi: "चंडीगढ़" },
  { value: "dadra", en: "Dadra and Nagar Haveli and Daman and Diu", hi: "दादरा और नगर हवेली और दमन और दीव" },
  { value: "delhi", en: "Delhi", hi: "दिल्ली" },
  { value: "jammu", en: "Jammu and Kashmir", hi: "जम्मू और कश्मीर" },
  { value: "ladakh", en: "Ladakh", hi: "लद्दाख" },
  { value: "lakshadweep", en: "Lakshadweep", hi: "लक्षद्वीप" },
  { value: "puducherry", en: "Puducherry", hi: "पुडुचेरी" },
];

// Translation object for English and Hindi
const translations = {
  en: {
    studentRegistration: "Student Registration",
    hindi: "हिंदी",
    english: "English",
    personalInfo: "Personal Information",
    aadhaar: "Aadhaar Number",
    aadhaarPlaceholder: "xxxx-xxxx-xxxx",
    fullName: "Full Name (as per Aadhaar)",
    mobile: "Mobile Number",
    mobilePlaceholder: "+91 xxxxxxxxxx",
    email: "Email Address",
    state: "State",
    selectState: "Select State",
    district: "District",
    educationalInfo: "Educational Information",
    institution: "Educational Institution",
    educationLevel: "Education Level",
    selectEducationLevel: "Select Education Level",
    primary: "Primary School",
    secondary: "Secondary School",
    higher: "Higher Secondary",
    undergraduate: "Undergraduate",
    postgraduate: "Postgraduate",
    disability: "Specify Disability (if applicable)",
    accountSecurity: "Account Security",
    password: "Password",
    confirmPassword: "Re-enter Password",
    register: "Register as Student",
    passwordMismatch: "Passwords do not match.",
    formSubmitted: "Form Submitted",
    accountCreated: "Account created",
    signupFailed: "Signup failed",
    required: "*"
  },
  hi: {
    studentRegistration: "छात्र पंजीकरण",
    hindi: "हिंदी",
    english: "English",
    personalInfo: "व्यक्तिगत जानकारी",
    aadhaar: "आधार नंबर",
    aadhaarPlaceholder: "xxxx-xxxx-xxxx",
    fullName: "पूरा नाम (आधार के अनुसार)",
    mobile: "मोबाइल नंबर",
    mobilePlaceholder: "+91 xxxxxxxxxx",
    email: "ईमेल पता",
    state: "राज्य",
    selectState: "राज्य चुनें",
    district: "जिला",
    educationalInfo: "शैक्षिक जानकारी",
    institution: "शैक्षणिक संस्थान",
    educationLevel: "शिक्षा स्तर",
    selectEducationLevel: "शिक्षा स्तर चुनें",
    primary: "प्राथमिक विद्यालय",
    secondary: "माध्यमिक विद्यालय",
    higher: "हायर सेकेंडरी",
    undergraduate: "स्नातक",
    postgraduate: "परास्नातक",
    disability: "विकलांगता निर्दिष्ट करें (यदि लागू हो)",
    accountSecurity: "खाता सुरक्षा",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड फिर से दर्ज करें",
    register: "छात्र के रूप में पंजीकरण करें",
    passwordMismatch: "पासवर्ड मेल नहीं खाते।",
    formSubmitted: "फॉर्म सबमिट किया गया।",
    accountCreated: "खाता बनाया गया।",
    signupFailed: "साइनअप विफल हुआ",
    required: "*"
  }
};

export default function StudentRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    aadhaar: '',
    fullName: '',
    mobile: '',
    email: '',
    state: '',
    district: '',
    institution: '',
    educationLevel: '',
    disability: '',
    password: '',
    confirmPassword: '',
  });
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language === 'en' ? 'en' : 'hi'];
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }
    try {
      const res = await axios.post("/api/student/signup", formData);
      alert(t.accountCreated);
      router.push("/");
    } catch (error) {
      console.error("Signup failed", error);
      alert(t.signupFailed);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-orange-500 z-30  py-4 fixed w-full">
        <h1 className="text-white text-2xl font-bold text-center">
          {t.studentRegistration}
        </h1>
        <button
          onClick={toggleLanguage}
          className="absolute right-6 top-5 text-sm bg-white text-orange-500 font-medium px-3 py-1 rounded shadow hover:bg-orange-100 transition"
        >
          {language === 'en' ? t.hindi : t.english}
        </button>
      </header>
      {/* Form Container */}
      <div className="container mt-20 px-4 py-20">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-blue-900 text-xl font-bold mb-6">{t.personalInfo}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Aadhaar */}
                <div>
                  <label className="block mb-2">
                    {t.aadhaar}<span className="text-red-500">{t.required}</span>
                  </label>
                  <input
                    type="text"
                    name="aadhaar"
                    required
                    value={formData.aadhaar}
                    onChange={handleChange}
                    placeholder={t.aadhaarPlaceholder}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block mb-2">
                    {t.fullName}<span className="text-red-500">{t.required}</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block mb-2">
                    {t.mobile}<span className="text-red-500">{t.required}</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder={t.mobilePlaceholder}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2">{t.email}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block mb-2">
                    {t.state}<span className="text-red-500">{t.required}</span>
                  </label>
                  <div className="relative">
                    <select
                      name="state"
                      value={formData.state}
                      required
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t.selectState}</option>
                      {states.map((state) => (
                        <option key={state.value} value={state.value}>
                          {language === 'en' ? state.en : state.hi}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown className="text-gray-500" size={20} />
                    </div>
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="block mb-2">
                    {t.district}<span className="text-red-500">{t.required}</span>
                  </label>
                  <input
                    name="district"
                    value={formData.district}
                    required
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Educational Information Section */}
              <div className="mt-10">
                <h2 className="text-blue-900 text-xl font-bold mb-6">{t.educationalInfo}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Institution */}
                  <div>
                    <label className="block mb-2">
                      {t.institution}<span className="text-red-500">{t.required}</span>
                    </label>
                    <input
                      type="text"
                      name="institution"
                      required
                      value={formData.institution}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Education Level */}
                  <div>
                    <label className="block mb-2">
                      {t.educationLevel}<span className="text-red-500">{t.required}</span>
                    </label>
                    <div className="relative">
                      <select
                        name="educationLevel"
                        value={formData.educationLevel}
                        required
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t.selectEducationLevel}</option>
                        <option value="primary">{t.primary}</option>
                        <option value="secondary">{t.secondary}</option>
                        <option value="higher">{t.higher}</option>
                        <option value="undergraduate">{t.undergraduate}</option>
                        <option value="postgraduate">{t.postgraduate}</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown className="text-gray-500" size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Disability */}
                  <div className="md:col-span-2">
                    <label className="block mb-2">{t.disability}</label>
                    <input
                      type="text"
                      name="disability"
                      required
                      value={formData.disability}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="mt-10">
                <h2 className="text-blue-900 text-xl font-bold mb-6">{t.accountSecurity}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">
                      {t.password}<span className="text-red-500">{t.required}</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">
                      {t.confirmPassword}<span className="text-red-500">{t.required}</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {error && <p className="text-red-600 mt-4">{error}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 px-8 rounded-md transition-colors"
                >
                  {t.register}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
