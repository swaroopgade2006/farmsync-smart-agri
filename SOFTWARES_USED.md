# 🛠️ FarmSync AI — Complete Software & Technology Stack

This document lists all the software, frameworks, libraries, tools, and native APIs used to build the **FarmSync AI** digital agricultural platform.

---

## 1. ⚡ Core Framework & Runtime
| Software / Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `19.2` | Component-based modern user interface architecture |
| **TypeScript** | `6.0` | Strongly-typed language for type safety across all data models, states, and translations |
| **Node.js & npm** | `v20+` | JavaScript runtime environment and package manager |

---

## 2. 🚀 Build Tools & Bundlers
| Tool / Package | Purpose |
| :--- | :--- |
| **Vite** (`8.3`) | Next-generation ultra-fast frontend build tool and local development server |
| **@vitejs/plugin-react** | Fast Refresh and JSX transformation support for React in Vite |
| **Oxlint** | High-performance Rust-based code linter |
| **TypeScript Compiler (`tsc`)** | Type-checking and compilation verification (`tsc -b`) |

---

## 3. 🎨 Styling & Design System
| Tool / Package | Purpose |
| :--- | :--- |
| **Tailwind CSS v4** (`@tailwindcss/vite`, `@tailwindcss/postcss`) | Utility-first CSS framework for custom responsive design, glassmorphism, and color themes |
| **PostCSS & Autoprefixer** | CSS processing and cross-browser vendor prefixing |
| **`clsx` & `tailwind-merge`** | Dynamic conditional class merging and conflict resolution |
| **Google Fonts (Inter / Outfit)** | Modern typography across 10 Indian regional scripts |

---

## 4. 🧭 Navigation & Routing
| Package | Purpose |
| :--- | :--- |
| **React Router v7** (`react-router-dom`) | Single Page Application (SPA) client-side routing, protected role-based routes, and redirects |
| **React Context API** | Global application state management for `AuthContext`, `DataContext`, and `LanguageContext` |
| **HTML5 LocalStorage** | Instant state persistence for offline-capable demo data and user language preferences |

---

## 5. 📊 Data Visualization & Micro-Animations
| Library | Purpose |
| :--- | :--- |
| **Recharts** (`3.10`) | SVG charting library for APMC Mandi price trends, Soil NPK nutrition, and Cold-Chain IoT telemetry |
| **Lucide React** (`1.46`) | Crisp, lightweight icon set (weather, crops, escrow, logistics, chatbot) |
| **Canvas Confetti** (`1.9`) | Celebration micro-animations for order placements, escrow releases, and certificate downloads |

---

## 6. 🌐 Native Browser Web APIs & AI Features
| Web API / Feature | Purpose |
| :--- | :--- |
| **Web Speech API** (`SpeechSynthesis` & `webkitSpeechRecognition`) | Powers the **KisanMitra AI** multilingual voice assistant |
| **HTML5 Geolocation API & Reverse Geocoding** | Automatic farm coordinates and warehouse yard detection |
| **HTML5 Canvas & File Reader API** | In-browser crop photo scanning, quality grading analysis, and digital certificate downloads |
| **5-Factor AI Match Engine** | Client-side algorithmic ranking for crop compatibility with buyer requirements |

---

## 7. ☁️ Backend & Cloud Storage
| Technology | Purpose |
| :--- | :--- |
| **Supabase Client (`@supabase/supabase-js`)** | Cloud PostgreSQL database and auth connector |
| **Pre-Seeded Mock Engine** | Complete simulation for 5 distinct roles (Farmer, Buyer, Sponsor, Logistics, Admin) |

---

## 8. 🗣️ Multilingual Internationalization (i18n)
| Feature | Details |
| :--- | :--- |
| **Supported Languages (10)** | English (`en`), Hindi (`hi`), Telugu (`te`), Malayalam (`ml`), Tamil (`ta`), Kannada (`kn`), Marathi (`mr`), Gujarati (`gu`), Punjabi (`pa`), Bengali (`bn`) |
| **Dynamic Commodity Dictionary** | Real-time translation of 30+ crop commodities, growth stages, farming methods, and farmer financing categories |
