"use client";

import { createContext, useContext, useState } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  toggleLanguage: (lang?: Language) => void; // Optional parameter
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language") as Language;
      return storedLang || "en";
    }
    return "en";
  });

 const toggleLanguage = (lang?: Language) => {
  const newLang = lang ?? (language === "en" ? "hi" : "en");
  setLanguage(newLang);
  if (typeof window !== "undefined") {
    localStorage.setItem("language", newLang);
  }
};


  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
