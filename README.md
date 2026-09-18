# 🌾 FarmSync AI

### **"Connect. Grow. Sell. Smarter."**
*An AI-powered agricultural digital ecosystem connecting farmers directly with institutional buyers, sponsors/investors, and logistics providers.*  
**Smart India Hackathon 2026 Prototype**

---

## 🌟 Executive Summary

**FarmSync AI** eliminates intermediary exploitation in Indian agricultural supply chains by digitizing the end-to-end lifecycle:

$$\text{Register} \longrightarrow \text{Add Farm} \longrightarrow \text{Add Crop} \longrightarrow \text{Monitor Crop} \longrightarrow \text{AI Matching} \longrightarrow \text{Buyer Order} \longrightarrow \text{Harvest} \longrightarrow \text{Logistics} \longrightarrow \text{Delivery} \longrightarrow \text{Payment}$$

---

## 🚀 Key Features by User Role

### 1. 👨‍🌾 Farmer Portal
- **Dashboard & KPIs**: Active Crops, Upcoming Harvest countdowns, Buyer Inquiries, Total Sales, Funding/Support value, Alerts.
- **My Farm & Verified Profile**: Land acreage, soil classification (Black Clay Loam, Red Sandy Loam, Alluvial), experience, and **Admin Verified Badge**.
- **Add Crop Listing**: Instant listing with land area, sowing date, target harvest date, estimated yield (kg), expected price (₹/kg), cultivation cost, and farming methods.
- **Crop Details & AI Harvest Estimation**:
  - Dynamic AI countdown: *"Approximately X days remaining"* with confidence level and factor analysis.
  - **Chronological Crop Progress Timeline**: Upload on-ground field photos, growth stage transitions, irrigation telemetry, and pest observations.
- **Order Management Workflow**: Receive purchase orders $\to$ Accept/Reject $\to$ Mark as Harvesting $\to$ Mark Ready for Logistics Pickup.
- **Funding & Free-Support Grants**: View active capital agreements and apply for 100% non-repayable CSR agricultural input grants.

### 2. 🛒 Buyer Portal
- **Agricultural Marketplace**: Live search and multi-parameter filters (Commodity, District, Maximum Price slider, Farming Method, Verified Farmers).
- **Post Buyer Requirements**: Submit commodity inquiries (e.g. *Tomato, 2,000 kg, Max ₹30/kg, Required by 20 October, Vijayawada Hub*).
- **AI Recommendation Engine**:
  - **Transparent 5-Factor Weighted Scoring**:
    - 🌾 **Crop Variety Match (30%)**
    - ⚖️ **Quantity Fulfillment (20%)**
    - 📍 **Location & Logistics Proximity (15%)**
    - 💰 **Price Competitiveness (15%)**
    - 📅 **Harvest Date Readiness (20%)**
  - Factor-by-factor score breakdown and plain-English evaluation (*Excellent / Good / Fair*).
- **Order Lifecycle & Tracking**: Visual 6-stage tracker (*REQUESTED $\to$ ACCEPTED $\to$ HARVESTING $\to$ PICKUP $\to$ IN TRANSIT $\to$ DELIVERED $\to$ COMPLETED*).
- **Simulated Escrow Payment Gateway**: Razorpay/Stripe-ready escrow checkout supporting UPI, Agri Escrow, NetBanking with digital receipts.

### 3. 💼 Investor / Sponsor Portal
- **Two Financial Inclusivity Models**:
  1. **Funded Farmer Model**: Transparent revenue/profit-share agreements providing capital for micro-drip automation and inputs.
  2. **Free-Support Model (Zero Debt)**: 100% non-repayable CSR grants (certified seeds, bio-fertilizers, soil health cards) sponsored by CSR trusts and NGOs.
- **Farmer Projects Catalog**: Browse rural farm projects seeking capital or input grants.
- **Verifiable Public Ledger**: Audit trail of all active investment agreements and disbursed CSR grants.

### 4. 🚚 Logistics Provider Portal
- **Cold-Chain Fleet Overview**: Refrigerated mini-trucks, tractor trolleys, and transport telemetry.
- **Step-by-Step Dispatch Advancement**:
  $$\text{Assigned} \longrightarrow \text{Pickup Scheduled} \longrightarrow \text{Picked Up} \longrightarrow \text{In Transit} \longrightarrow \text{Delivered}$$
- **Live Dispatch Telemetry**: Driver assignment, temperature monitoring, and GPS origin/destination tracking.

### 5. 🛡️ Master Admin Panel
- **Comprehensive Platform Metrics**: Total Farmers, Total Buyers, Active Crops, Active Orders, Completed Orders, Total Funding, Platform GMV.
- **1-Click Verification Center**: Inspect farmer land records and buyer GST licenses to issue or revoke verification badges.
- **Crop & Order Moderation**: Global oversight of all listings and trade escrow disputes.
- **Macro Supply-Demand Analytics**: Recharts-powered commodity deficit graphs and farmer inclusion distributions.

---

## 🧠 AI Matching & Harvest Estimation Engines

### 1. Transparent 5-Factor Matching Equation
$$\text{Score} = (0.30 \times S_{\text{crop}}) + (0.20 \times S_{\text{qty}}) + (0.15 \times S_{\text{loc}}) + (0.15 \times S_{\text{price}}) + (0.20 \times S_{\text{date}})$$

Every recommendation provides a clear explanation breakdown:
- **Crop**: 30/30 (Excellent variety match)
- **Quantity**: 20/20 (Exact demand volume fulfilled)
- **Location**: 15/15 (Intra-district low freight cost)
- **Price**: 15/15 (Within buyer maximum budget)
- **Harvest Date**: 20/20 (Harvest ready on target delivery date)

### 2. AI Harvest Estimation
Calculates dynamic remaining days based on baseline duration, observed growth stage velocity, irrigation condition, and pest severity logs.

---

## 🗄️ Database Architecture (Supabase PostgreSQL)

Full DDL migration script is located in [`supabase/schema.sql`](file:///supabase/schema.sql).

### Tables:
1. `profiles`: Linked to `auth.users` with role, verification status, and contact details.
2. `farmers`: Village, district, state, acreage, soil classification, experience, farmer type.
3. `buyers`: Company name, business category, GST number, delivery address.
4. `investors`: Organization, investor classification, impact budget.
5. `logistics_providers`: Fleet count, vehicle types, operational regions.
6. `farms`: Farm acreage, location, soil pH, irrigation source.
7. `crops`: Crop variety, land area, sowing date, harvest date, estimated/available quantity, price/kg, cultivation cost, growth stage, status.
8. `crop_updates`: Chronological field photo updates, growth stage, irrigation status, pest logs, farmer notes.
9. `buyer_requirements`: Crop commodity, required volume, maximum budget, target date, delivery location.
10. `ai_matches`: 5-factor weighted scores and match factor explanations.
11. `funding_agreements`: Capital amount, terms, expected profit share percentage, status.
12. `support_records`: Non-repayable CSR grant records, input valuation, status.
13. `orders`: Order number, buyer/farmer reference, volume, unit price, total amount, delivery location, status.
14. `payments`: Payment ID, order ID, amount, method (UPI, Escrow, NetBanking), transaction ID, status.
15. `deliveries`: Delivery ID, order ID, carrier, pickup/delivery origin/destination, status stages, driver info.
16. `notifications`: User notification alerts with real-time badges.

### Storage Buckets:
- `crop-images`: Public bucket for crop listing photos.
- `crop-updates`: Public bucket for chronological field observation logs.
- `profile-images`: User avatar and verification document uploads.

---

## 👥 Seed Demo Personas (SIH 2026 Evaluation)

| Persona | Role | Entity Name | Key Data / Focus |
| :--- | :--- | :--- | :--- |
| **Ravi Kumar** | Farmer | Gudivada Farm Depot | Tomato (*Arka Rakshak*), Funded Model |
| **Suresh Reddy** | Farmer | Miryalaguda Farms | Paddy / Rice (*Sona Masoori*), Self-Funded |
| **Lakshmi Devi** | Farmer | Guntur Rural | Green Chilli (*Guntur Teja*), Free-Support Grant |
| **Anitha Krishna** | Farmer | Nuzvid Orchards | Mango (*Banganapalli Choice*), Self-Funded |
| **FreshMart** | Buyer | FreshMart Wholesale Hub | Supermarket & wholesale buyer, Vijayawada |
| **Local Culinary**| Buyer | Local Restaurant Group | Restaurant & catering network, Hyderabad |
| **AgriFund & KisanMitra**| Sponsor | AgriFund India & KisanMitra NGO | Revenue-share capital & 100% Free CSR grants |
| **SwiftAgri** | Logistics| SwiftAgri Logistics Network | Reefer cold-chain & mini-truck fleet |
| **Platform Admin**| Admin | Central Administration | Verification & Macro Supply Analytics |

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "Agriculture SIH"
npm install
```

### 2. Environment Configuration
Copy the template `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: Supabase URL and Key are optional for local demonstration. FarmSync AI features an integrated reactive seed engine that works out of the box with zero configuration).*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🧪 Testing User Flows (Step-by-Step Guide)

1. **Top Bar Role Switcher**: Click on any of the 5 quick-switch persona pills (*Farmer, Buyer, Sponsor, Logistics, Admin*) in the top bar to evaluate distinct portals instantly.
2. **Farmer Flow**:
   - Navigate to **Dashboard** $\to$ inspect the 6 metric cards and weather telemetry.
   - Click **View Details** on Tomato crop $\to$ inspect **AI Harvest Estimate** and **Crop Progress Timeline**.
   - Click **Add Crop** $\to$ submit a new crop with sample photo $\to$ observe success banner and listing.
3. **Buyer Flow**:
   - Switch to **FreshMart (Buyer)** $\to$ explore **Marketplace** with search and filters.
   - Click **AI Matches** $\to$ view transparent 5-factor weighted scoring breakdown for your requirements.
   - Click **Place Order** $\to$ click **Pay (Simulated)** in Escrow modal $\to$ inspect transaction receipt and celebration confetti!
4. **Logistics Flow**:
   - Switch to **SwiftAgri (Logistics)** $\to$ open **Deliveries** $\to$ advance stage from *Pickup Scheduled* $\to$ *In Transit* $\to$ *Delivered*.
5. **Investor Flow**:
   - Switch to **AgriFund (Sponsor)** $\to$ view **Farmer Projects** $\to$ execute funded agreement or disburse free CSR grant.
6. **Admin Flow**:
   - Switch to **Admin** $\to$ open **Verification Center** $\to$ approve unverified farmer $\to$ inspect **Demand-Supply Analytics** charts.
