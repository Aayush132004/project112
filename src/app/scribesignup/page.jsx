'use client';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useLanguage } from "../contexts/LanguageContext";

// Translation object for English and Hindi
const translations = {
  en: {
    title: "Scribe Registration",
    aadhaar: "Aadhaar Number",
    aadhaarPlaceholder: "xxxx-xxxx-xxxx",
    fullName: "Full Name",
    mobile: "Mobile Number",
    email: "Email",
    state: "State",
    district: "District",
    qualification: "Qualification",
    selectQualification: "Select Qualification",
    class1: "Class 1",
    class2: "Class 2",
    class10: "Class 10",
    class12: "Class 12",
    diploma: "Diploma",
    graduate: "Graduate",
    postGraduate: "Post Graduate",
    institute: "Institute",
    subjects: "Subjects",
    subjectsPlaceholder: "Subjects (comma-separated)",
    password: "Password",
    confirmPassword: "Confirm Password",
    uploadQualification: "Upload Qualification PDF",
    register: "Register",
    passwordsNoMatch: "Passwords do not match.",
    uploadRequired: "Please upload your qualification PDF.",
    fileUploadFailed: "File upload failed.",
    registrationSuccess: "Scribe registered successfully!",
    registrationError: "Error registering scribe.",
    required: "*",
    hindi: "हिंदी",
    english: "English"
  },
  hi: {
    title: "स्क्राइब पंजीकरण",
    aadhaar: "आधार नंबर",
    aadhaarPlaceholder: "xxxx-xxxx-xxxx",
    fullName: "पूरा नाम",
    mobile: "मोबाइल नंबर",
    email: "ईमेल",
    state: "राज्य",
    district: "जिला",
    qualification: "योग्यता",
    selectQualification: "योग्यता चुनें",
    class1: "कक्षा 1",
    class2: "कक्षा 2",
    class10: "कक्षा 10",
    class12: "कक्षा 12",
    diploma: "डिप्लोमा",
    graduate: "स्नातक",
    postGraduate: "परास्नातक",
    institute: "संस्थान",
    subjects: "विषय",
    subjectsPlaceholder: "विषय (कॉमा से अलग करें)",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    uploadQualification: "योग्यता PDF अपलोड करें",
    register: "पंजीकरण करें",
    passwordsNoMatch: "पासवर्ड मेल नहीं खाते।",
    uploadRequired: "कृपया अपनी योग्यता PDF अपलोड करें।",
    fileUploadFailed: "फ़ाइल अपलोड विफल।",
    registrationSuccess: "स्क्राइब सफलतापूर्वक पंजीकृत!",
    registrationError: "पंजीकरण में त्रुटि।",
    required: "*",
    hindi: "हिंदी",
    english: "English"
  }
};

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ScribeRegistration() {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language === "en" ? "en" : "hi"];

  const [formData, setFormData] = useState({
    aadhaar: "",
    fullName: "",
    mobile: "",
    email: "",
    state: "",
    district: "",
    qualification: "",
    institute: "",
    subjects: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsNoMatch);
      return;
    }

    if (!image) {
      setError(t.uploadRequired);
      return;
    }

    setLoading(true);
    try {
      const { data, error: uploadError } = await supabase.storage
        .from("hiiiiii")
        .upload(`public/${image.name}`, image);

      if (uploadError) {
        setError(t.fileUploadFailed);
        setLoading(false);
        return;
      }

      const encoded = encodeURIComponent(image.name);
      const url = `https://mmqsuosezwbhwkeirjds.supabase.co/storage/v1/object/public/hiiiiii/public/${encoded}`;

      await axios.post("/api/scribe/signup", {
        url,
        formData,
      });

      alert(t.registrationSuccess);
      router.push("/");
    } catch (err) {
      setError(t.registrationError);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      <header className="bg-green-600 text-white py-5 text-center shadow-md fixed w-full">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <button
          onClick={toggleLanguage}
          className="absolute right-6 top-5 text-sm bg-white text-green-600 font-medium px-3 py-1 rounded shadow hover:bg-green-100 transition"
        >
          {language === "en" ? t.hindi : t.english}
        </button>
      </header>

      <main className="flex-1 flex justify-center mt-20 `items-center py-8 px-2">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-2 text-green-700">{t.title}</h2>
            <p className="text-gray-500 mb-4">
              {language === "en"
                ? "Fill in your details to register as a scribe."
                : "स्क्राइब के रूप में पंजीकरण के लिए अपनी जानकारी भरें।"}
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t.aadhaar} <span className="text-green-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="aadhaar"
              required
              placeholder={t.aadhaarPlaceholder}
              value={formData.aadhaar}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t.fullName} <span className="text-green-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t.mobile} <span className="text-green-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="mobile"
              required
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">{t.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t.state} <span className="text-green-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t.district} <span className="text-green-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="district"
              required
              value={formData.district}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t.qualification} <span className="text-green-500">{t.required}</span>
            </label>
            <select
              name="qualification"
              required
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t.selectQualification}</option>
              <option value="1">{t.class1}</option>
              <option value="2">{t.class2}</option>
              <option value="10">{t.class10}</option>
              <option value="12">{t.class12}</option>
              <option value="15">{t.diploma}</option>
              <option value="16">{t.graduate}</option>
              <option value="17">{t.postGraduate}</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t.institute} <span className="text-green-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="institute"
              required
              value={formData.institute}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">
              {t.subjects} <span className="text-green-500">{t.required}</span>
            </label>
            <input
              type="text"
              name="subjects"
              required
              placeholder={t.subjectsPlaceholder}
              value={formData.subjects}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t.password} <span className="text-green-500">{t.required}</span>
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t.confirmPassword} <span className="text-green-500">{t.required}</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">
              {t.uploadQualification} <span className="text-green-500">{t.required}</span>
            </label>
            <input accept="image/*" required class="w-full" type="file">
          </div>

          {error && (
            <div className="md:col-span-2">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (language === "en" ? "Registering..." : "पंजीकरण हो रहा है...") : t.register}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
