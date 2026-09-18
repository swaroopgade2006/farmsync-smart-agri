-- =====================================================================
-- FarmSync AI - Complete PostgreSQL Database Schema (Supabase)
-- Smart India Hackathon 2026 Prototype
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & USER ROLES TABLE
-- Links with Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'investor', 'logistics', 'admin')),
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. FARMERS TABLE
CREATE TABLE IF NOT EXISTS public.farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    land_size NUMERIC(10,2) NOT NULL, -- in acres
    soil_type TEXT NOT NULL,
    farming_experience INTEGER NOT NULL, -- in years
    farmer_type TEXT NOT NULL CHECK (farmer_type IN ('Self-Funded', 'Funded', 'Free-Support')),
    upi_id TEXT,
    bank_account_last4 TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BUYERS TABLE
CREATE TABLE IF NOT EXISTS public.buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL, -- Wholesale, Retail, Processing, Restaurant, Exporter
    gst_number TEXT,
    trade_license TEXT,
    operating_city TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. INVESTORS / SPONSORS TABLE
CREATE TABLE IF NOT EXISTS public.investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    investor_type TEXT NOT NULL, -- Angel/Impact Investor, CSR Foundation, Agri NGO, Govt Scheme
    preferred_support_type TEXT NOT NULL, -- Funded (Equity/Profit Share), Free-Support (Grants/CSR)
    allocated_budget NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. LOGISTICS PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS public.logistics_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    fleet_size INTEGER DEFAULT 1,
    vehicle_types TEXT[], -- Mini Truck, Heavy Truck, Reefer Cold Chain, Tractor Trolley
    operating_districts TEXT[],
    license_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. FARMS TABLE
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    location_name TEXT NOT NULL,
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    total_area NUMERIC(10,2) NOT NULL,
    soil_ph NUMERIC(4,2),
    water_source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CROPS TABLE
CREATE TABLE IF NOT EXISTS public.crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    crop_variety TEXT NOT NULL,
    land_area NUMERIC(10,2) NOT NULL, -- in acres
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE NOT NULL,
    estimated_quantity NUMERIC(12,2) NOT NULL, -- in kg
    available_quantity NUMERIC(12,2) NOT NULL, -- in kg remaining
    price_per_kg NUMERIC(10,2) NOT NULL, -- in INR
    cultivation_cost NUMERIC(12,2) NOT NULL, -- in INR
    farming_method TEXT NOT NULL, -- Organic, Conventional, Natural, Hydroponic, Zero Budget Natural
    location TEXT NOT NULL,
    image_url TEXT,
    growth_stage TEXT NOT NULL DEFAULT 'Vegetative', -- Sowing, Germination, Vegetative, Flowering, Fruiting, Maturing, Harvest Ready
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'HARVESTING', 'SOLD_OUT', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CROP UPDATES TABLE (Chronological Timeline)
CREATE TABLE IF NOT EXISTS public.crop_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    update_date DATE DEFAULT CURRENT_DATE NOT NULL,
    photo_url TEXT,
    growth_stage TEXT NOT NULL,
    irrigation_status TEXT NOT NULL, -- Drip Irrigation, Canal Water, Rainfed, Sprinkler, Needs Irrigation
    pest_observations TEXT,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. BUYER REQUIREMENTS TABLE
CREATE TABLE IF NOT EXISTS public.buyer_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
    crop_type TEXT NOT NULL,
    required_quantity NUMERIC(12,2) NOT NULL, -- in kg
    max_price_per_kg NUMERIC(10,2) NOT NULL, -- in INR
    required_by_date DATE NOT NULL,
    delivery_location TEXT NOT NULL,
    delivery_state TEXT NOT NULL,
    delivery_district TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'MATCHED', 'FULFILLED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. AI MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.ai_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_requirement_id UUID NOT NULL REFERENCES public.buyer_requirements(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
    overall_score NUMERIC(5,2) NOT NULL, -- 0 to 100
    crop_match_score NUMERIC(5,2) NOT NULL, -- 30% weight
    quantity_match_score NUMERIC(5,2) NOT NULL, -- 20% weight
    location_match_score NUMERIC(5,2) NOT NULL, -- 15% weight
    price_match_score NUMERIC(5,2) NOT NULL, -- 15% weight
    date_match_score NUMERIC(5,2) NOT NULL, -- 20% weight
    match_factors JSONB NOT NULL,
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. FUNDING AGREEMENTS TABLE (Funded Farmer Model)
CREATE TABLE IF NOT EXISTS public.funding_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL,
    agreement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    terms TEXT NOT NULL,
    expected_return_percentage NUMERIC(5,2),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. SUPPORT RECORDS TABLE (Free-Support Farmer Model - Non-repayable CSR/Grants)
CREATE TABLE IF NOT EXISTS public.support_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
    sponsor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
    support_type TEXT NOT NULL, -- Organic Fertilizers, Hybrid Seeds Kit, Solar Drip Irrigation, Weather Sensor, Soil Testing
    support_value NUMERIC(12,2) NOT NULL,
    description TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'DISBURSED' CHECK (status IN ('PENDING', 'APPROVED', 'DISBURSED', 'UTILIZED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE RESTRICT,
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE RESTRICT,
    crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE RESTRICT,
    quantity NUMERIC(12,2) NOT NULL, -- in kg
    unit_price NUMERIC(10,2) NOT NULL, -- in INR
    total_amount NUMERIC(14,2) NOT NULL, -- in INR
    delivery_location TEXT NOT NULL,
    expected_delivery_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (
        status IN ('REQUESTED', 'ACCEPTED', 'REJECTED', 'HARVESTING', 'PICKUP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. PAYMENTS TABLE (Simulated Gateway Ready)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id TEXT UNIQUE NOT NULL,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(14,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'NetBanking', 'Escrow', 'Card', 'Bank Transfer')),
    transaction_id TEXT UNIQUE NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded'))
);

-- 15. DELIVERIES TABLE
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id TEXT UNIQUE NOT NULL,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    logistics_id UUID REFERENCES public.logistics_providers(id) ON DELETE SET NULL,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    quantity NUMERIC(12,2) NOT NULL,
    pickup_date DATE,
    delivery_date DATE,
    status TEXT NOT NULL DEFAULT 'Assigned' CHECK (
        status IN ('Assigned', 'Pickup Scheduled', 'Picked Up', 'In Transit', 'Delivered')
    ),
    vehicle_info TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    tracking_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ORDER', 'MATCH', 'PAYMENT', 'HARVEST', 'FUNDING', 'DELIVERY', 'SYSTEM')),
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_crops_farmer_id ON public.crops(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crops_name ON public.crops(crop_name);
CREATE INDEX IF NOT EXISTS idx_buyer_requirements_crop ON public.buyer_requirements(crop_type);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer ON public.orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_logistics ON public.deliveries(logistics_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all verified profiles, update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Crops: Anyone can view active crops, farmers can insert/update their own
CREATE POLICY "Crops are viewable by everyone" ON public.crops FOR SELECT USING (true);
CREATE POLICY "Farmers can insert their own crops" ON public.crops FOR INSERT WITH CHECK (
    farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid())
);
CREATE POLICY "Farmers can update their own crops" ON public.crops FOR UPDATE USING (
    farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid())
);

-- Crop Updates: Anyone can view timeline, farmer can add updates
CREATE POLICY "Crop updates viewable by everyone" ON public.crop_updates FOR SELECT USING (true);
CREATE POLICY "Farmers can insert crop updates" ON public.crop_updates FOR INSERT WITH CHECK (
    crop_id IN (
        SELECT c.id FROM public.crops c
        JOIN public.farmers f ON c.farmer_id = f.id
        WHERE f.user_id = auth.uid()
    )
);

-- Buyer Requirements: Publicly viewable, buyer can modify own
CREATE POLICY "Buyer requirements viewable by all" ON public.buyer_requirements FOR SELECT USING (true);
CREATE POLICY "Buyers can insert requirements" ON public.buyer_requirements FOR INSERT WITH CHECK (
    buyer_id IN (SELECT id FROM public.buyers WHERE user_id = auth.uid())
);

-- Orders: Buyer and Farmer associated with order can view and update
CREATE POLICY "Orders viewable by parties" ON public.orders FOR SELECT USING (
    buyer_id IN (SELECT id FROM public.buyers WHERE user_id = auth.uid()) OR
    farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid())
);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (
    buyer_id IN (SELECT id FROM public.buyers WHERE user_id = auth.uid())
);
CREATE POLICY "Parties can update orders" ON public.orders FOR UPDATE USING (
    buyer_id IN (SELECT id FROM public.buyers WHERE user_id = auth.uid()) OR
    farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid())
);

-- Notifications: Users only see their own
CREATE POLICY "Users view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- =====================================================================
-- STORAGE BUCKETS SETUP (Run in Supabase SQL editor)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('crop-images', 'crop-images', true),
    ('crop-updates', 'crop-updates', true),
    ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access crop-images" ON storage.objects FOR SELECT USING (bucket_id = 'crop-images');
CREATE POLICY "Authenticated users upload crop-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'crop-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access crop-updates" ON storage.objects FOR SELECT USING (bucket_id = 'crop-updates');
CREATE POLICY "Authenticated users upload crop-updates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'crop-updates' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access profile-images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Authenticated users upload profile-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
