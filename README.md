MoneyMind – Personal Finance Dashboard
A modern, user-friendly personal finance app for young professionals. Built with React, TypeScript, Tailwind CSS, and Supabase.

🎯 Overview
MoneyMind helps users track spending, set savings goals, and understand their financial health through a simple Financial Wellness Score — all in a friendly, jargon-free interface.

✨ Key Features
Dashboard – Balance overview, income vs. expenses, recent transactions, and category-wise spending

Transaction Management – Quick-add via floating button, search & filter, date-grouped history

Goals Tracker – Visual progress bars, deadline tracking, and completion celebrations

Financial Wellness Score – A 0–100 score based on savings rate, goal tracking, transaction habits, and spending balance, with personalized tips


## 📸 Screenshot
<img width="1894" height="890" alt="image" src="https://github.com/user-attachments/assets/d818af8c-d86d-4b38-b026-fc83a9699883" />

<img width="554" height="892" alt="image" src="https://github.com/user-attachments/assets/da0318a6-443e-47b7-bc82-8c4f7cb01d56" />


> Add your app screenshot in the `assets` folder and name it `moneymind-dashboard.png`.

---

## 🎨 Figma Design

View the design file here:  
[Finance Dashboard – Figma Community](https://www.figma.com/make/WF6OOJSgBpo8FM5XoF0Wic/Premium-Personal-Finance-App-UI?t=IH43DsmyX3Tumf4e-20&fullscreen=1&preview-route=%2Fadd-expense)

<!-- Replace the link above with your own Figma file link -->

🗂️ Navigation
Section	Purpose
Home	Monthly overview, recent activity, active goals
Transactions	Full history with search & filter
Goals	Active and completed savings goals
Insights	Wellness Score + personalized recommendations
➕ Button	Quick-add transaction (always accessible)
🛠️ Tech Stack
Frontend: React 18 + TypeScript

Styling: Tailwind CSS

Backend/Auth/DB: Supabase (PostgreSQL + Row Level Security)

Icons: Lucide React

Build: Vite

🚀 Getting Started
bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser at http://localhost:5173
The .env file is pre-configured with Supabase credentials.

bash
# Production build
npm run build

# Preview production build
npm run preview
🗄️ Database Schema
Table	Description
profiles	User name, income, onboarding status
categories	Icons, colors, transaction types
transactions	Income & expenses with amounts and dates
goals	Savings goals with progress tracking
All tables use Row Level Security (RLS) — users only access their own data.

📱 Responsive Design
Mobile (< 768px): Single column, stacked cards, bottom floating button

Tablet (768–1024px): 2-column grid

Desktop (> 1024px): 3-column grid with sidebar nav

🔮 Roadmap
Phase 2: Budget planning, recurring transactions, CSV/PDF export, dark mode
Phase 3: Shared budgets, bank integration (Plaid), bill reminders, investment tracking

📄 Credits
Icons: Lucide React

Photos: Pexels

Inspired by: Mint, YNAB, Revolut

Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase
