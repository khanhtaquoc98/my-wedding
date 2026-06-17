-- 1. Table for Expenses (Chi phí)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  planned_amount NUMERIC DEFAULT 0,
  actual_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table for Income / Contributions (Khoản thu)
CREATE TABLE IF NOT EXISTS income (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table for Guests (Khách mời)
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('groom', 'bride')), -- groom: Nhà trai, bride: Nhà gái
  group_name TEXT NOT NULL, -- e.g., Bạn học, Đồng nghiệp, Họ hàng...
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'uninvited' CHECK (status IN ('uninvited', 'invited', 'attending', 'declined')), -- Trạng thái
  rsvp_count INTEGER DEFAULT 0, -- Số người đi cùng
  gift_amount NUMERIC DEFAULT 0, -- Tiền mừng
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table for Checklist (Check list)
CREATE TABLE IF NOT EXISTS checklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., Trước ngày cưới, Trong ngày cưới, Sau ngày cưới
  due_date DATE,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  assigned_to TEXT, -- Chú rể, Cô dâu, Cả hai
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) or disable for testing. 
-- For simplicity in a personal dashboard, we can disable RLS or write policies:
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE income DISABLE ROW LEVEL SECURITY;
ALTER TABLE guests DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklist DISABLE ROW LEVEL SECURITY;
