import i18n from "i18next";
// import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationAR from "./locales/ar.json";
import translationUK from "./locales/uk.json";

// the translations
const resources = {
    ar: {
        translation: translationAR,
    },
    uk: {
        translation: translationUK,
    },
};


const language = localStorage.getItem("I18N_LANGUAGE") || "en";
// localStorage.setItem("I18N_LANGUAGE", language);
document.documentElement.lang = language;

i18n
    // .use(detector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: localStorage.getItem("I18N_LANGUAGE") || "en",
        fallbackLng: "en", // use en if detected lng is not available

        // defaultNS: "translation",    // ✅
        // fallbackNS: "translation",   // ✅

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        detection: {
            // We disable browser language detection since we're handling language persistence ourselves
            order: [],
        },
    });

export default i18n;
