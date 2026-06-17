"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Users,
  CheckSquare,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  Calendar,
  User,
  Filter,
  Info,
  RefreshCw,
  Database,
  Heart
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './budget.css';

// TypeScript Interfaces
interface Expense {
  id: string;
  category: string;
  name: string;
  planned_amount: number;
  actual_amount: number;
  paid_amount: number;
  notes: string;
  created_at?: string;
}

interface Income {
  id: string;
  source: string;
  name: string;
  amount: number;
  notes: string;
  created_at?: string;
}

interface Guest {
  id: string;
  name: string;
  side: 'groom' | 'bride';
  group_name: string;
  phone: string;
  status: 'uninvited' | 'invited' | 'attending' | 'declined';
  rsvp_count: number;
  gift_amount: number;
  notes: string;
  created_at?: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  due_date: string;
  is_completed: boolean;
  assigned_to: string;
  notes: string;
  created_at?: string;
}

// Sample Data for Demo / Offline Mode
const defaultExpenses: Expense[] = [
  { id: 'exp-1', category: 'Tiệc cưới', name: 'Đặt cọc tiệc cưới nhà hàng', planned_amount: 150000000, actual_amount: 160000000, paid_amount: 50000000, notes: 'Đã thanh toán đợt 1' },
  { id: 'exp-2', category: 'Trang phục', name: 'Thuê váy cưới & comple chú rể', planned_amount: 15000000, actual_amount: 12000000, paid_amount: 12000000, notes: 'Lấy đồ trước lễ 2 ngày' },
  { id: 'exp-3', category: 'Trang trí', name: 'Trang trí gia tiên & tiệc cưới', planned_amount: 25000000, actual_amount: 25000000, paid_amount: 10000000, notes: 'Hợp đồng hoa tươi' },
  { id: 'exp-4', category: 'Mâm quả', name: 'Tráp lễ ăn hỏi (7 tráp)', planned_amount: 8000000, actual_amount: 9000000, paid_amount: 9000000, notes: 'Bao gồm cả chi phí vận chuyển' },
  { id: 'exp-5', category: 'Quay phim/Chụp ảnh', name: 'Gói chụp phóng sự cưới & pre-wedding', planned_amount: 20000000, actual_amount: 18000000, paid_amount: 18000000, notes: 'Đã hoàn thành album prewedding' },
  { id: 'exp-6', category: 'Khác', name: 'In thiệp cưới (400 thiệp)', planned_amount: 3000000, actual_amount: 3200000, paid_amount: 3200000, notes: 'Thiệp thiết kế riêng' }
];

const defaultIncome: Income[] = [
  { id: 'inc-1', source: 'Bố mẹ chú rể', name: 'Bố mẹ nhà trai hỗ trợ tiệc', amount: 60000000, notes: 'Hỗ trợ trực tiếp' },
  { id: 'inc-2', source: 'Bố mẹ cô dâu', name: 'Bố mẹ nhà gái hỗ trợ trang sức', amount: 40000000, notes: 'Hỗ trợ mua vàng cưới' },
  { id: 'inc-3', source: 'Tự túc', name: 'Quỹ tiết kiệm của hai vợ chồng', amount: 80000000, notes: 'Tài khoản tiết kiệm chung' }
];

const defaultGuests: Guest[] = [
  { id: 'gst-1', name: 'Nguyễn Văn A', side: 'groom', group_name: 'Bạn đại học', phone: '0901234567', status: 'attending', rsvp_count: 2, gift_amount: 1000000, notes: 'Đi cùng vợ' },
  { id: 'gst-2', name: 'Trần Thị B', side: 'bride', group_name: 'Đồng nghiệp', phone: '0912345678', status: 'invited', rsvp_count: 1, gift_amount: 0, notes: 'Đã gửi thiệp giấy' },
  { id: 'gst-3', name: 'Phạm Văn C', side: 'groom', group_name: 'Họ hàng', phone: '0987654321', status: 'attending', rsvp_count: 4, gift_amount: 2000000, notes: 'Cả gia đình tham gia' },
  { id: 'gst-4', name: 'Lê Thị D', side: 'bride', group_name: 'Bạn cấp 3', phone: '0934567890', status: 'declined', rsvp_count: 0, gift_amount: 0, notes: 'Bận đi công tác' },
  { id: 'gst-5', name: 'Hoàng Văn E', side: 'groom', group_name: 'Họ hàng', phone: '0945678901', status: 'uninvited', rsvp_count: 0, gift_amount: 0, notes: 'Chuẩn bị viết thiệp' }
];

const defaultChecklist: ChecklistItem[] = [
  { id: 'chk-1', task: 'Đặt nhà hàng tiệc cưới', category: 'Trước ngày cưới', due_date: '2026-07-01', is_completed: true, assigned_to: 'Cả hai', notes: 'Đã ký hợp đồng với Adora' },
  { id: 'chk-2', task: 'Chụp ảnh cưới pre-wedding', category: 'Trước ngày cưới', due_date: '2026-08-15', is_completed: true, assigned_to: 'Cả hai', notes: 'Chụp tại Đà Lạt' },
  { id: 'chk-3', task: 'Đặt tráp lễ ăn hỏi', category: 'Trước ngày cưới', due_date: '2026-10-10', is_completed: true, assigned_to: 'Chú rể', notes: '7 tráp rồng phượng' },
  { id: 'chk-4', task: 'Gửi thiệp mời cho khách', category: 'Trước ngày cưới', due_date: '2026-10-25', is_completed: false, assigned_to: 'Cả hai', notes: 'Thiệp cưới online và thiệp giấy' },
  { id: 'chk-5', task: 'Chuẩn bị lì xì cho đội bê tráp', category: 'Trong ngày cưới', due_date: '2026-11-19', is_completed: false, assigned_to: 'Chú rể', notes: '14 phong bao' },
  { id: 'chk-6', task: 'Dọn dẹp phòng tân hôn', category: 'Trước ngày cưới', due_date: '2026-11-15', is_completed: false, assigned_to: 'Cả hai', notes: 'Mua thêm ga gối mới' },
  { id: 'chk-7', task: 'Thanh toán chi phí nhà hàng còn lại', category: 'Sau ngày cưới', due_date: '2026-11-21', is_completed: false, assigned_to: 'Chú rể', notes: 'Thanh toán sau tiệc' }
];

export default function WeddingPlanner() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'income' | 'guests' | 'checklist'>('dashboard');
  
  // App States
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  
  // Database connection & loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [dbSetupRequired, setDbSetupRequired] = useState(false);
  const [dbErrorMessage, setDbErrorMessage] = useState('');
  
  // Modals & UI states
  const [showModal, setShowModal] = useState<'expense' | 'income' | 'guest' | 'checklist' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Filter States
  const [expenseFilter, setExpenseFilter] = useState('All');
  const [incomeFilter, setIncomeFilter] = useState('All');
  const [guestSearch, setGuestSearch] = useState('');
  const [guestSideFilter, setGuestSideFilter] = useState('All');
  const [guestStatusFilter, setGuestStatusFilter] = useState('All');
  const [checklistFilter, setChecklistFilter] = useState('All');

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (forceOffline = false) => {
    setIsLoading(true);
    setDbSetupRequired(false);
    
    // Check if offline mode is explicitly requested or saved
    const offlineSaved = localStorage.getItem('wedding_planner_offline') === 'true';
    if (forceOffline || offlineSaved) {
      loadOfflineData();
      setIsOfflineMode(true);
      setIsLoading(false);
      showToast('Đang chạy ở chế độ Demo (Offline)');
      return;
    }

    try {
      // Test querying expenses table
      const { error: testError } = await supabase.from('expenses').select('id').limit(1);
      
      if (testError) {
        // Table doesn't exist or permissions error
        if (testError.message.includes('does not exist') || testError.code === '42P01') {
          setDbSetupRequired(true);
          setDbErrorMessage('Bảng dữ liệu chưa được tạo trong Supabase. Vui lòng chạy đoạn mã SQL khởi tạo.');
          loadOfflineData(); // Fallback to offline data for display
          setIsOfflineMode(true);
          setIsLoading(false);
          return;
        }
        throw testError;
      }

      // If test passes, fetch all tables
      const [
        { data: expData, error: expErr },
        { data: incData, error: incErr },
        { data: gstData, error: gstErr },
        { data: chkData, error: chkErr }
      ] = await Promise.all([
        supabase.from('expenses').select('*').order('created_at', { ascending: false }),
        supabase.from('income').select('*').order('created_at', { ascending: false }),
        supabase.from('guests').select('*').order('name', { ascending: true }),
        supabase.from('checklist').select('*').order('created_at', { ascending: true })
      ]);

      if (expErr) throw expErr;
      if (incErr) throw incErr;
      if (gstErr) throw gstErr;
      if (chkErr) throw chkErr;

      setExpenses(expData || []);
      setIncome(incData || []);
      setGuests(gstData || []);
      setChecklist(chkData || []);
      setIsOfflineMode(false);
      localStorage.setItem('wedding_planner_offline', 'false');
    } catch (err: any) {
      console.error('Supabase error, falling back to offline mode:', err);
      loadOfflineData();
      setIsOfflineMode(true);
      localStorage.setItem('wedding_planner_offline', 'true');
      showToast('Không thể kết nối Supabase, tự động chuyển sang chế độ Offline.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOfflineData = () => {
    // Check localStorage for offline items, otherwise use defaults
    const localExp = localStorage.getItem('offline_expenses');
    const localInc = localStorage.getItem('offline_income');
    const localGst = localStorage.getItem('offline_guests');
    const localChk = localStorage.getItem('offline_checklist');

    setExpenses(localExp ? JSON.parse(localExp) : defaultExpenses);
    setIncome(localInc ? JSON.parse(localInc) : defaultIncome);
    setGuests(localGst ? JSON.parse(localGst) : defaultGuests);
    setChecklist(localChk ? JSON.parse(localChk) : defaultChecklist);
  };

  const syncOfflineStorage = (
    updatedExp?: Expense[],
    updatedInc?: Income[],
    updatedGst?: Guest[],
    updatedChk?: ChecklistItem[]
  ) => {
    if (updatedExp) localStorage.setItem('offline_expenses', JSON.stringify(updatedExp));
    if (updatedInc) localStorage.setItem('offline_income', JSON.stringify(updatedInc));
    if (updatedGst) localStorage.setItem('offline_guests', JSON.stringify(updatedGst));
    if (updatedChk) localStorage.setItem('offline_checklist', JSON.stringify(updatedChk));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const switchMode = (toOffline: boolean) => {
    localStorage.setItem('wedding_planner_offline', toOffline ? 'true' : 'false');
    loadData(toOffline);
  };

  // Helper formatting function
  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // ----------------------------------------------------
  // Core calculations
  // ----------------------------------------------------
  const totals = useMemo(() => {
    const totalPlannedCost = expenses.reduce((sum, item) => sum + (Number(item.planned_amount) || 0), 0);
    const totalActualCost = expenses.reduce((sum, item) => sum + (Number(item.actual_amount) || 0), 0);
    const totalPaidCost = expenses.reduce((sum, item) => sum + (Number(item.paid_amount) || 0), 0);
    
    const totalIncome = income.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    
    // Total wedding gifts from guests (Tiền mừng cưới từ khách mời đã tham dự / mừng)
    const totalGifts = guests.reduce((sum, guest) => sum + (Number(guest.gift_amount) || 0), 0);

    const totalBudget = totalIncome + totalGifts;
    const balance = totalBudget - totalActualCost;
    const remainingToPay = totalActualCost - totalPaidCost;

    return {
      plannedCost: totalPlannedCost,
      actualCost: totalActualCost,
      paidCost: totalPaidCost,
      income: totalIncome,
      gifts: totalGifts,
      totalBudget: totalBudget,
      balance: balance,
      remainingToPay: remainingToPay
    };
  }, [expenses, income, guests]);

  const guestStats = useMemo(() => {
    const total = guests.length;
    const attending = guests.filter(g => g.status === 'attending').length;
    const attendingTotalPeople = guests.filter(g => g.status === 'attending').reduce((sum, g) => sum + 1 + (g.rsvp_count || 0), 0);
    const invited = guests.filter(g => g.status === 'invited').length;
    const uninvited = guests.filter(g => g.status === 'uninvited').length;
    const declined = guests.filter(g => g.status === 'declined').length;
    const groomSide = guests.filter(g => g.side === 'groom').length;
    const brideSide = guests.filter(g => g.side === 'bride').length;

    return {
      total,
      attending,
      attendingTotalPeople,
      invited,
      uninvited,
      declined,
      groomSide,
      brideSide
    };
  }, [guests]);

  const checklistStats = useMemo(() => {
    const total = checklist.length;
    const completed = checklist.filter(c => c.is_completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [checklist]);

  // ----------------------------------------------------
  // Database / State Modifications
  // ----------------------------------------------------

  // Expenses CRUD
  const handleSaveExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as string;
    const name = formData.get('name') as string;
    const planned_amount = Number(formData.get('planned_amount')) || 0;
    const actual_amount = Number(formData.get('actual_amount')) || 0;
    const paid_amount = Number(formData.get('paid_amount')) || 0;
    const notes = formData.get('notes') as string;

    if (!name.trim()) {
      showToast('Vui lòng nhập tên chi phí');
      return;
    }

    if (isOfflineMode) {
      let updated: Expense[];
      if (editingItem) {
        updated = expenses.map(item => item.id === editingItem.id ? { ...item, category, name, planned_amount, actual_amount, paid_amount, notes } : item);
        showToast('Cập nhật chi phí thành công');
      } else {
        const newItem: Expense = { id: 'exp-' + Date.now(), category, name, planned_amount, actual_amount, paid_amount, notes };
        updated = [newItem, ...expenses];
        showToast('Thêm chi phí thành công');
      }
      setExpenses(updated);
      syncOfflineStorage(updated);
    } else {
      try {
        if (editingItem) {
          const { error } = await supabase.from('expenses').update({ category, name, planned_amount, actual_amount, paid_amount, notes }).eq('id', editingItem.id);
          if (error) throw error;
          showToast('Cập nhật chi phí thành công');
        } else {
          const { error } = await supabase.from('expenses').insert([{ category, name, planned_amount, actual_amount, paid_amount, notes }]);
          if (error) throw error;
          showToast('Thêm chi phí thành công');
        }
        loadData();
      } catch (err: any) {
        showToast('Lỗi: ' + err.message);
      }
    }
    setShowModal(null);
    setEditingItem(null);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chi phí này?')) return;

    if (isOfflineMode) {
      const updated = expenses.filter(item => item.id !== id);
      setExpenses(updated);
      syncOfflineStorage(updated);
      showToast('Xóa chi phí thành công');
    } else {
      try {
        const { error } = await supabase.from('expenses').delete().eq('id', id);
        if (error) throw error;
        showToast('Xóa chi phí thành công');
        loadData();
      } catch (err: any) {
        showToast('Lỗi: ' + err.message);
      }
    }
  };

  // Income CRUD
  const handleSaveIncome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const source = formData.get('source') as string;
    const name = formData.get('name') as string;
    const amount = Number(formData.get('amount')) || 0;
    const notes = formData.get('notes') as string;

    if (!name.trim()) {
      showToast('Vui lòng nhập nguồn thu');
      return;
    }

    if (isOfflineMode) {
      let updated: Income[];
      if (editingItem) {
        updated = income.map(item => item.id === editingItem.id ? { ...item, source, name, amount, notes } : item);
        showToast('Cập nhật khoản thu thành công');
      } else {
        const newItem: Income = { id: 'inc-' + Date.now(), source, name, amount, notes };
        updated = [newItem, ...income];
        showToast('Thêm khoản thu thành công');
      }
      setIncome(updated);
      syncOfflineStorage(undefined, updated);
    } else {
      try {
        if (editingItem) {
          const { error } = await supabase.from('income').update({ source, name, amount, notes }).eq('id', editingItem.id);
          if (error) throw error;
          showToast('Cập nhật khoản thu thành công');
        } else {
          const { error } = await supabase.from('income').insert([{ source, name, amount, notes }]);
          if (error) throw error;
          showToast('Thêm khoản thu thành công');
        }
        loadData();
      } catch (err: any) {
        showToast('Lỗi: ' + err.message);
      }
    }
    setShowModal(null);
    setEditingItem(null);
  };

  const handleDeleteIncome = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khoản thu này?')) return;

    if (isOfflineMode) {
      const updated = income.filter(item => item.id !== id);
      setIncome(updated);
      syncOfflineStorage(undefined, updated);
      showToast('Xóa khoản thu thành công');
    } else {
      try {
        const { error } = await supabase.from('income').delete().eq('id', id);
        if (error) throw error;
        showToast('Xóa khoản thu thành công');
        loadData();
      } catch (err: any) {
        showToast('Lỗi: ' + err.message);
      }
    }
  };

  // Guests CRUD
  const handleSaveGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const side = formData.get('side') as 'groom' | 'bride';
    const group_name = formData.get('group_name') as string;
    const phone = formData.get('phone') as string;
    const status = formData.get('status') as any;
    const rsvp_count = Number(formData.get('rsvp_count')) || 0;
    const gift_amount = Number(formData.get('gift_amount')) || 0;
    const notes = formData.get('notes') as string;

    if (!name.trim()) {
      showToast('Vui lòng nhập tên khách mời');
      return;
    }

    if (isOfflineMode) {
      let updated: Guest[];
      if (editingItem) {
        updated = guests.map(item => item.id === editingItem.id ? { ...item, name, side, group_name, phone, status, rsvp_count, gift_amount, notes } : item);
        showToast('Cập nhật khách mời thành công');
      } else {
        const newItem: Guest = { id: 'gst-' + Date.now(), name, side, group_name, phone, status, rsvp_count, gift_amount, notes };
        updated = [newItem, ...guests];
        showToast('Thêm khách mời thành công');
      }
      setGuests(updated);
      syncOfflineStorage(undefined, undefined, updated);
    } else {
      try {
        if (editingItem) {
          const { error } = await supabase.from('guests').update({ name, side, group_name, phone, status, rsvp_count, gift_amount, notes }).eq('id', editingItem.id);
          if (error) throw error;
          showToast('Cập nhật khách mời thành công');
        } else {
          const { error } = await supabase.from('guests').insert([{ name, side, group_name, phone, status, rsvp_count, gift_amount, notes }]);
          if (error) throw error;
          showToast('Thêm khách mời thành công');
        }
        loadData();
      } catch (err: any) {
        showToast('Lỗi: ' + err.message);
      }
    }
    setShowModal(null);
    setEditingItem(null);
  };

  const handleDeleteGuest = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khách mời này?')) return;

    if (isOfflineMode) {
      const updated = guests.filter(item => item.id !== id);
      setGuests(updated);
      syncOfflineStorage(undefined, undefined, updated);
      showToast('Xóa khách mời thành công');
    } else {
      try {
        const { error } = await supabase.from('guests').delete().eq('id', id);
        if (error) throw error;
        showToast('Xóa khách mời thành công');
        loadData();
      } catch (err: any) {
        showToast('Lỗi: ' + err.message);
      }
    }
  };

  // Checklist CRUD
  const handleSaveChecklist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const task = formData.get('task') as string;
    const category = formData.get('category') as string;
    const due_date = formData.get('due_date') as string;
    const assigned_to = formData.get('assigned_to') as string;
    const notes = formData.get('notes') as string;

    if (!task.trim()) {
      showToast('Vui lòng nhập tên công việc');
      return;
    }

    if (isOfflineMode) {
      let updated: ChecklistItem[];
      if (editingItem) {
        updated = checklist.map(item => item.id === editingItem.id ? { ...item, task, category, due_date, assigned_to, notes } : item);
        showToast('Cập nhật công việc thành công');
      } else {
        const newItem: ChecklistItem = { id: 'chk-' + Date.now(), task, category, due_date, is_completed: false, assigned_to, notes };
        updated = [...checklist, newItem];
        showToast('Thêm công việc thành công');
      }
      setChecklist(updated);
      syncOfflineStorage(undefined, undefined, undefined, updated);
    } else {
      try {
        if (editingItem) {
          const { error } = await supabase.from('checklist').update({ task, category, due_date, assigned_to, notes }).eq('id', editingItem.id);
          if (error) throw error;
          showToast('Cập nhật công việc thành công');
        } else {
          const { error } = await supabase.from('checklist').insert([{ task, category, due_date, is_completed: false, assigned_to, notes }]);
          if (error) throw error;
          showToast('Thêm công việc thành công');
        }
        loadData();
      } catch (err: any) {
        showToast('Lỗi: ' + err.message);
      }
    }
    setShowModal(null);
    setEditingItem(null);
  };

  const handleToggleChecklist = async (id: string, currentStatus: boolean) => {
    if (isOfflineMode) {
      const updated = checklist.map(item => item.id === id ? { ...item, is_completed: !currentStatus } : item);
      setChecklist(updated);
      syncOfflineStorage(undefined, undefined, undefined, updated);
      showToast(!currentStatus ? 'Đã hoàn thành công việc' : 'Đã mở lại công việc');
    } else {
      try {
        const { error } = await supabase.from('checklist').update({ is_completed: !currentStatus }).eq('id', id);
        if (error) throw error;
        showToast(!currentStatus ? 'Đã hoàn thành công việc' : 'Đã mở lại công việc');
        loadData();
      } catch (err: any) {
        showToast('Lỗi: ' + err.message);
      }
    }
  };

  const handleDeleteChecklist = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;

    if (isOfflineMode) {
      const updated = checklist.filter(item => item.id !== id);
      setChecklist(updated);
      syncOfflineStorage(undefined, undefined, undefined, updated);
      showToast('Xóa công việc thành công');
    } else {
      try {
        const { error } = await supabase.from('checklist').delete().eq('id', id);
        if (error) throw error;
        showToast('Xóa công việc thành công');
        loadData();
      } catch (err: any) {
        showToast('Lỗi: ' + err.message);
      }
    }
  };

  // ----------------------------------------------------
  // Memoized Filtered Lists
  // ----------------------------------------------------
  const filteredExpenses = useMemo(() => {
    if (expenseFilter === 'All') return expenses;
    return expenses.filter(item => item.category === expenseFilter);
  }, [expenses, expenseFilter]);

  const filteredIncome = useMemo(() => {
    if (incomeFilter === 'All') return income;
    return income.filter(item => item.source === incomeFilter);
  }, [income, incomeFilter]);

  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesSearch = guest.name.toLowerCase().includes(guestSearch.toLowerCase()) || 
                            (guest.phone && guest.phone.includes(guestSearch)) || 
                            (guest.group_name && guest.group_name.toLowerCase().includes(guestSearch.toLowerCase()));
      const matchesSide = guestSideFilter === 'All' || guest.side === guestSideFilter;
      const matchesStatus = guestStatusFilter === 'All' || guest.status === guestStatusFilter;
      return matchesSearch && matchesSide && matchesStatus;
    });
  }, [guests, guestSearch, guestSideFilter, guestStatusFilter]);

  const filteredChecklist = useMemo(() => {
    if (checklistFilter === 'All') return checklist;
    return checklist.filter(item => item.category === checklistFilter);
  }, [checklist, checklistFilter]);

  // Unique lists for filtering dropdowns
  const categories = ['Tiệc cưới', 'Trang phục', 'Trang trí', 'Mâm quả', 'Quay phim/Chụp ảnh', 'Khác'];
  const incomeSources = ['Bố mẹ chú rể', 'Bố mẹ cô dâu', 'Tự túc', 'Khác'];
  const guestGroups = useMemo(() => {
    const groups = new Set(guests.map(g => g.group_name));
    return Array.from(groups).filter(Boolean);
  }, [guests]);
  const checklistCategories = ['Trước ngày cưới', 'Trong ngày cưới', 'Sau ngày cưới'];

  return (
    <div className="budgetApp">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logoArea">
          <h1>Khánh & Linh</h1>
          <p>Kế Hoạch Cưới 2026</p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={14} fill="var(--sage-400)" color="var(--sage-400)" />
          </div>
        </div>

        <nav className="navMenu">
          <button 
            className={`navItem ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Tổng quan</span>
          </button>
          <button 
            className={`navItem ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <DollarSign size={18} />
            <span>Chi phí</span>
          </button>
          <button 
            className={`navItem ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            <TrendingUp size={18} />
            <span>Khoản thu</span>
          </button>
          <button 
            className={`navItem ${activeTab === 'guests' ? 'active' : ''}`}
            onClick={() => setActiveTab('guests')}
          >
            <Users size={18} />
            <span>Khách mời</span>
          </button>
          <button 
            className={`navItem ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <CheckSquare size={18} />
            <span>Checklist</span>
          </button>
        </nav>

        {/* Database Sync Status indicator */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          {dbSetupRequired ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', background: 'var(--rose-100)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(198, 107, 95, 0.2)' }}>
              <span style={{ color: 'var(--rose-500)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={12} /> Cần Setup DB
              </span>
              <button 
                onClick={() => loadData()} 
                style={{ background: 'linear-gradient(135deg, var(--sage-600), var(--sage-700))', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.72rem' }}
              >
                Tải lại Live
              </button>
            </div>
          ) : isOfflineMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', background: 'var(--gold-100)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(212, 164, 42, 0.15)' }}>
              <span style={{ color: 'var(--gold-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={12} /> Chế độ Demo
              </span>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.65rem' }}>Dữ liệu lưu tạm trên trình duyệt của bạn.</p>
              {!dbSetupRequired && (
                <button 
                  onClick={() => switchMode(false)}
                  style={{ background: 'linear-gradient(135deg, var(--sage-600), var(--sage-700))', color: 'white', border: 'none', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.72rem' }}
                >
                  Kết nối Supabase
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '0.75rem', color: 'var(--sage-700)', background: 'var(--sage-100)', padding: '10px 14px', borderRadius: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                <Check size={14} /> Live Supabase
              </span>
              <button 
                onClick={() => switchMode(true)}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.7rem' }}
              >
                Demo
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="mainContent">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="toast">
            <Info size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Database setup assistance box (if needed) */}
        {dbSetupRequired && activeTab === 'dashboard' && (
          <div style={{ background: 'var(--card)', border: '1px solid rgba(198, 107, 95, 0.2)', borderRadius: '14px', padding: '22px', marginBottom: '24px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ color: 'var(--rose-500)', fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <Database /> Hướng dẫn tạo bảng trong Supabase
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '14px', lineHeight: 1.6 }}>
              Dự án Next.js đã kết nối với Supabase của bạn, nhưng chưa tìm thấy các bảng dữ liệu. Bạn có thể copy tệp <code style={{ background: 'var(--sage-100)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.82rem' }}>supabase-schema.sql</code> ở thư mục gốc của dự án này để chạy trong phần **SQL Editor** trên trang quản lý Supabase.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => loadData()} className="btn btnPrimary" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>
                <RefreshCw size={14} /> Kiểm tra lại kết nối
              </button>
              <button onClick={() => setDbSetupRequired(false)} className="btn btnSecondary" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>
                Bỏ qua và dùng Bản Demo
              </button>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading ? (
          <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
            <div className="loadingSpinner"></div>
            <p style={{ color: 'var(--accent-muted)', fontStyle: 'italic' }}>Đang kết nối dữ liệu cưới...</p>
          </div>
        ) : (
          <>
            {/* ------------------------------------------------- */}
            {/* DASHBOARD TAB */}
            {/* ------------------------------------------------- */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="headerSection">
                  <div>
                    <h2 className="pageTitle">Kế hoạch cưới của Khánh & Linh</h2>
                    <p style={{ color: 'var(--accent-muted)', fontSize: '0.9rem' }}>Tổng quan chi phí, khách mời và công việc cưới</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setShowModal('expense')} className="btn btnPrimary">
                      <Plus size={16} /> Chi phí
                    </button>
                    <button onClick={() => setShowModal('guest')} className="btn btnSecondary">
                      <Plus size={16} /> Khách mời
                    </button>
                  </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="metricsGrid">
                  <div className="metricCard">
                    <span className="metricLabel">Tổng chi dự kiến</span>
                    <span className="metricValue">{formatVND(totals.plannedCost)}</span>
                    <span className="metricSubtext">Dựa trên dự tính ban đầu</span>
                  </div>
                  <div className="metricCard rose">
                    <span className="metricLabel">Tổng chi thực tế</span>
                    <span className="metricValue">{formatVND(totals.actualCost)}</span>
                    <span className="metricSubtext">Đã chốt hợp đồng</span>
                  </div>
                  <div className="metricCard sage">
                    <span className="metricLabel">Đã thanh toán</span>
                    <span className="metricValue">{formatVND(totals.paidCost)}</span>
                    <span className="metricSubtext" style={{ color: 'var(--sage-700)', fontWeight: 'bold' }}>
                      Còn lại: {formatVND(totals.remainingToPay)}
                    </span>
                  </div>
                  <div className="metricCard moss">
                    <span className="metricLabel">Tổng khoản thu</span>
                    <span className="metricValue">{formatVND(totals.totalBudget)}</span>
                    <span className="metricSubtext">
                      Quỹ hỗ trợ ({formatVND(totals.income)}) + Mừng cưới ({formatVND(totals.gifts)})
                    </span>
                  </div>
                </div>

                {/* Row: Budget Health & Progress */}
                <div className="dashboardRows">
                  {/* Left Column: Cost Breakdown & Guests */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="sectionCard">
                      <h2>
                        <span>Phân bổ chi phí cưới</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-muted)' }}>
                          Thực tế / Dự kiến
                        </span>
                      </h2>
                      <div className="progressList">
                        {categories.map(cat => {
                          const catItems = expenses.filter(i => i.category === cat);
                          const catPlanned = catItems.reduce((s, i) => s + i.planned_amount, 0);
                          const catActual = catItems.reduce((s, i) => s + i.actual_amount, 0);
                          const percentage = totals.actualCost > 0 ? Math.round((catActual / totals.actualCost) * 100) : 0;
                          
                          return (
                            <div className="progressItem" key={cat}>
                              <div className="progressInfo">
                                <span>{cat}</span>
                                <span style={{ color: 'var(--accent-muted)' }}>
                                  {formatVND(catActual)} <small>({percentage}%)</small>
                                </span>
                              </div>
                              <div className="progressBarContainer">
                                <div 
                                  className={`progressBar ${cat === 'Tiệc cưới' ? 'moss' : cat === 'Trang phục' ? 'rose' : cat === 'Trang trí' ? 'gold' : ''}`}
                                  style={{ width: `${Math.min(100, Math.max(5, (catActual / (catPlanned || 1)) * 100))}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Guests Summary in Dashboard */}
                    <div className="sectionCard">
                      <h2>Khách mời & RSVP</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', textAlign: 'center', marginTop: '12px' }}>
                        <div style={{ background: 'var(--sage-50)', padding: '18px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: '4px', letterSpacing: '0.06em', fontWeight: 600 }}>Tổng khách</h4>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--sage-700)', fontWeight: 600 }}>{guestStats.total}</p>
                        </div>
                        <div style={{ background: 'var(--status-attending-bg)', padding: '18px 16px', borderRadius: '12px', border: '1px solid rgba(45, 106, 62, 0.12)' }}>
                          <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--sage-700)', marginBottom: '4px', letterSpacing: '0.06em', fontWeight: 600 }}>Tham gia</h4>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--sage-700)', fontWeight: 600 }}>{guestStats.attending}</p>
                          <small style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>+{guestStats.attendingTotalPeople - guestStats.attending} người đi cùng</small>
                        </div>
                        <div style={{ background: 'var(--gold-100)', padding: '18px 16px', borderRadius: '12px', border: '1px solid rgba(212, 164, 42, 0.1)' }}>
                          <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--gold-600)', marginBottom: '4px', letterSpacing: '0.06em', fontWeight: 600 }}>Đã mời</h4>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--gold-500)', fontWeight: 600 }}>{guestStats.invited}</p>
                        </div>
                        <div style={{ background: 'var(--rose-100)', padding: '18px 16px', borderRadius: '12px', border: '1px solid rgba(198, 107, 95, 0.1)' }}>
                          <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--rose-600)', marginBottom: '4px', letterSpacing: '0.06em', fontWeight: 600 }}>Từ chối</h4>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--rose-500)', fontWeight: 600 }}>{guestStats.declined}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--muted-foreground)', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                        <span>Nhà trai: <strong style={{ color: 'var(--sage-700)' }}>{guestStats.groomSide}</strong></span>
                        <span>Nhà gái: <strong style={{ color: 'var(--rose-500)' }}>{guestStats.brideSide}</strong></span>
                        <span>Chưa mời: <strong style={{ color: 'var(--gold-500)' }}>{guestStats.uninvited}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Circular Checklist Progress & Quick Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="sectionCard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h2>Tiến độ checklist</h2>
                      <div className="circularProgressWrapper">
                        <svg width="180" height="180" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="var(--sage-100)" strokeWidth="6" fill="transparent" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            stroke="var(--sage-500)" 
                            strokeWidth="6" 
                            fill="transparent" 
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * checklistStats.percent) / 100}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                          />
                        </svg>
                        <div className="circularProgressText">
                          <span className="circularProgressPercent">{checklistStats.percent}%</span>
                          <p className="circularProgressLabel">{checklistStats.completed}/{checklistStats.total} việc</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('checklist')}
                        className="btn btnSecondary"
                        style={{ marginTop: '16px', width: '100%', fontSize: '0.75rem' }}
                      >
                        Xem chi tiết việc cần làm
                      </button>
                    </div>

                    {/* Financial Summary Box */}
                    <div className="sectionCard" style={{ background: totals.balance >= 0 ? 'var(--sage-50)' : 'var(--rose-100)', borderColor: totals.balance >= 0 ? 'var(--border-strong)' : 'rgba(198, 107, 95, 0.2)' }}>
                      <h2>Cân đối tài chính</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="flexBetween" style={{ fontSize: '0.9rem' }}>
                          <span>Tổng quỹ & Mừng cưới:</span>
                          <strong style={{ color: 'var(--accent-moss)' }}>{formatVND(totals.totalBudget)}</strong>
                        </div>
                        <div className="flexBetween" style={{ fontSize: '0.9rem' }}>
                          <span>Tổng chi thực tế:</span>
                          <strong style={{ color: 'var(--accent-rose)' }}>{formatVND(totals.actualCost)}</strong>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '10px' }} className="flexBetween">
                          <span style={{ fontWeight: 700 }}>{totals.balance >= 0 ? 'Còn dư:' : 'Thiếu hụt:'}</span>
                          <strong style={{ fontSize: '1.25rem', color: totals.balance >= 0 ? 'var(--sage-700)' : 'var(--rose-500)' }}>
                            {formatVND(Math.abs(totals.balance))}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------- */}
            {/* CHI PHÍ (EXPENSES) TAB */}
            {/* ------------------------------------------------- */}
            {activeTab === 'expenses' && (
              <div>
                <div className="headerSection">
                  <div>
                    <h2 className="pageTitle">Quản lý chi phí cưới</h2>
                    <p style={{ color: 'var(--accent-muted)', fontSize: '0.9rem' }}>
                      Tổng thực tế: <strong style={{ color: 'var(--accent-rose)' }}>{formatVND(totals.actualCost)}</strong> (Kế hoạch: {formatVND(totals.plannedCost)})
                    </p>
                  </div>
                  <button onClick={() => { setEditingItem(null); setShowModal('expense'); }} className="btn btnPrimary">
                    <Plus size={16} /> Thêm chi phí
                  </button>
                </div>

                {/* Filters */}
                <div className="filtersBar">
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-muted)' }}>
                    Lọc danh mục:
                  </span>
                  <button 
                    className={`btn ${expenseFilter === 'All' ? 'btnPrimary' : 'btnSecondary'}`} 
                    onClick={() => setExpenseFilter('All')}
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Tất cả
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`btn ${expenseFilter === cat ? 'btnPrimary' : 'btnSecondary'}`}
                      onClick={() => setExpenseFilter(cat)}
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Expenses Table */}
                {filteredExpenses.length === 0 ? (
                  <div className="emptyState">Chưa có khoản chi phí nào thuộc danh mục này.</div>
                ) : (
                  <div className="tableContainer" style={{ marginTop: 0 }}>
                      <table className="customTable">
                        <thead>
                          <tr>
                            <th>Hạng mục</th>
                            <th>Danh mục</th>
                            <th className="textRight">Dự kiến (đ)</th>
                            <th className="textRight">Thực tế (đ)</th>
                            <th className="textRight">Đã trả (đ)</th>
                            <th className="textRight">Còn lại (đ)</th>
                            <th>Ghi chú</th>
                            <th className="textCenter">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredExpenses.map(item => {
                            const unpaid = (item.actual_amount || 0) - (item.paid_amount || 0);
                            return (
                              <tr key={item.id}>
                                <td style={{ fontWeight: 600 }}>{item.name}</td>
                                <td><span className="badge group">{item.category}</span></td>
                                <td className="textRight">{formatVND(item.planned_amount).replace(' ₫', '')}</td>
                                <td className="textRight" style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>
                                  {formatVND(item.actual_amount).replace(' ₫', '')}
                                </td>
                                <td className="textRight" style={{ color: 'var(--sage-700)' }}>
                                  {formatVND(item.paid_amount).replace(' ₫', '')}
                                </td>
                                <td className="textRight" style={{ fontWeight: 600, color: unpaid > 0 ? 'var(--accent-gold)' : 'var(--accent-muted)' }}>
                                  {unpaid > 0 ? formatVND(unpaid).replace(' ₫', '') : 'Xong'}
                                </td>
                                <td style={{ maxWidth: '200px', fontSize: '0.8rem', color: 'var(--accent-muted)' }}>{item.notes}</td>
                                <td className="textCenter">
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    <button 
                                      onClick={() => { setEditingItem(item); setShowModal('expense'); }}
                                      className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--accent-moss)' }}
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteExpense(item.id)}
                                      className="btn btnDanger" style={{ padding: '6px' }}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            )}

            {/* ------------------------------------------------- */}
            {/* KHOẢN THU (INCOME) TAB */}
            {/* ------------------------------------------------- */}
            {activeTab === 'income' && (
              <div>
                <div className="headerSection">
                  <div>
                    <h2 className="pageTitle">Quản lý các khoản thu & Tài trợ</h2>
                    <p style={{ color: 'var(--accent-muted)', fontSize: '0.9rem' }}>
                      Tổng ngân quỹ hỗ trợ: <strong style={{ color: 'var(--accent-moss)' }}>{formatVND(totals.income)}</strong> (Tổng cộng gồm mừng cưới: {formatVND(totals.totalBudget)})
                    </p>
                  </div>
                  <button onClick={() => { setEditingItem(null); setShowModal('income'); }} className="btn btnPrimary">
                    <Plus size={16} /> Thêm khoản thu
                  </button>
                </div>

                {/* Filters */}
                <div className="filtersBar">
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-muted)' }}>
                    Lọc nguồn thu:
                  </span>
                  <button 
                    className={`btn ${incomeFilter === 'All' ? 'btnPrimary' : 'btnSecondary'}`} 
                    onClick={() => setIncomeFilter('All')}
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Tất cả
                  </button>
                  {incomeSources.map(src => (
                    <button
                      key={src}
                      className={`btn ${incomeFilter === src ? 'btnPrimary' : 'btnSecondary'}`}
                      onClick={() => setIncomeFilter(src)}
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      {src}
                    </button>
                  ))}
                </div>

                {/* Income Table */}
                {filteredIncome.length === 0 ? (
                  <div className="emptyState">Chưa có khoản thu nào được ghi nhận.</div>
) : (
                  <div className="tableContainer" style={{ marginTop: 0 }}>
                      <table className="customTable">
                        <thead>
                          <tr>
                            <th>Nội dung</th>
                            <th>Nguồn đóng góp</th>
                            <th className="textRight">Số tiền (đ)</th>
                            <th>Ghi chú</th>
                            <th className="textCenter">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredIncome.map(item => (
                            <tr key={item.id}>
                              <td style={{ fontWeight: 600 }}>{item.name}</td>
                              <td><span className="badge group">{item.source}</span></td>
                              <td className="textRight" style={{ color: 'var(--accent-moss)', fontWeight: 600 }}>
                                {formatVND(item.amount).replace(' ₫', '')}
                              </td>
                              <td style={{ color: 'var(--accent-muted)', fontSize: '0.8rem' }}>{item.notes}</td>
                              <td className="textCenter">
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                  <button 
                                    onClick={() => { setEditingItem(item); setShowModal('income'); }}
                                    className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--accent-moss)' }}
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteIncome(item.id)}
                                    className="btn btnDanger" style={{ padding: '6px' }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            )}

            {/* ------------------------------------------------- */}
            {/* KHÁCH MỜI (GUESTS) TAB */}
            {/* ------------------------------------------------- */}
            {activeTab === 'guests' && (
              <div>
                <div className="headerSection">
                  <div>
                    <h2 className="pageTitle">Danh sách khách mời</h2>
                    <p style={{ color: 'var(--accent-muted)', fontSize: '0.9rem' }}>
                      Tổng: <strong>{guestStats.total} khách</strong> | Tham gia: <strong style={{ color: 'var(--sage-700)' }}>{guestStats.attendingTotalPeople} người</strong> | Tiền mừng nhận được: <strong style={{ color: 'var(--accent-gold)' }}>{formatVND(totals.gifts)}</strong>
                    </p>
                  </div>
                  <button onClick={() => { setEditingItem(null); setShowModal('guest'); }} className="btn btnPrimary">
                    <Plus size={16} /> Thêm khách mời
                  </button>
                </div>

                {/* Search & Filter Controls */}
                <div className="sectionCard" style={{ marginBottom: '24px', padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '240px' }} className="inputGroup">
                      <label>Tìm kiếm khách mời</label>
                      <div className="searchWrapper">
                        <Search size={16} className="searchIcon" />
                        <input 
                          type="text" 
                          placeholder="Tìm tên, số điện thoại, nhóm..." 
                          className="formInput searchInput"
                          value={guestSearch}
                          onChange={(e) => setGuestSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '130px' }} className="inputGroup">
                      <label>Phía gia đình</label>
                      <select 
                        className="formSelect" 
                        value={guestSideFilter}
                        onChange={(e) => setGuestSideFilter(e.target.value)}
                      >
                        <option value="All">Tất cả</option>
                        <option value="groom">Nhà trai</option>
                        <option value="bride">Nhà gái</option>
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '150px' }} className="inputGroup">
                      <label>Trạng thái</label>
                      <select 
                        className="formSelect"
                        value={guestStatusFilter}
                        onChange={(e) => setGuestStatusFilter(e.target.value)}
                      >
                        <option value="All">Tất cả</option>
                        <option value="uninvited">Chưa mời</option>
                        <option value="invited">Đã mời</option>
                        <option value="attending">Sẽ tham gia</option>
                        <option value="declined">Không tham gia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Guests Table */}
                {filteredGuests.length === 0 ? (
                  <div className="emptyState">Không tìm thấy khách mời nào phù hợp điều kiện lọc.</div>
                ) : (
                  <div className="tableContainer" style={{ marginTop: 0 }}>
                      <table className="customTable">
                        <thead>
                          <tr>
                            <th>Tên khách mời</th>
                            <th>Bên</th>
                            <th>Nhóm</th>
                            <th>SĐT</th>
                            <th>Trạng thái</th>
                            <th className="textCenter">Đi cùng</th>
                            <th className="textRight">Tiền mừng (đ)</th>
                            <th>Ghi chú</th>
                            <th className="textCenter">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredGuests.map(guest => (
                            <tr key={guest.id}>
                              <td style={{ fontWeight: 600 }}>{guest.name}</td>
                              <td>
                                <span className={guest.side === 'groom' ? 'textGroom' : 'textBride'}>
                                  {guest.side === 'groom' ? 'Nhà Trai' : 'Nhà Gái'}
                                </span>
                              </td>
                              <td><span className="badge group">{guest.group_name}</span></td>
                              <td style={{ color: 'var(--accent-muted)' }}>{guest.phone || '—'}</td>
                              <td>
                                <span className={`badge ${guest.status}`}>
                                  {guest.status === 'uninvited' && 'Chưa mời'}
                                  {guest.status === 'invited' && 'Đã mời'}
                                  {guest.status === 'attending' && 'Sẽ tham gia'}
                                  {guest.status === 'declined' && 'Không tham gia'}
                                </span>
                              </td>
                              <td className="textCenter" style={{ fontWeight: 700 }}>
                                {guest.status === 'attending' ? `+${guest.rsvp_count}` : '—'}
                              </td>
                              <td className="textRight" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                                {guest.gift_amount > 0 ? formatVND(guest.gift_amount).replace(' ₫', '') : '—'}
                              </td>
                              <td style={{ fontSize: '0.8rem', color: 'var(--accent-muted)', maxWidth: '180px' }}>{guest.notes}</td>
                              <td className="textCenter">
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                  <button 
                                    onClick={() => { setEditingItem(guest); setShowModal('guest'); }}
                                    className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--accent-moss)' }}
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteGuest(guest.id)}
                                    className="btn btnDanger" style={{ padding: '6px' }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            )}

            {/* ------------------------------------------------- */}
            {/* CHECKLIST (TODO) TAB */}
            {/* ------------------------------------------------- */}
            {activeTab === 'checklist' && (
              <div>
                <div className="headerSection">
                  <div>
                    <h2 className="pageTitle">Danh sách việc cần làm</h2>
                    <p style={{ color: 'var(--accent-muted)', fontSize: '0.9rem' }}>
                      Đã hoàn thành <strong style={{ color: 'var(--accent-moss)' }}>{checklistStats.completed}</strong> trên tổng số <strong>{checklistStats.total}</strong> đầu việc ({checklistStats.percent}%)
                    </p>
                  </div>
                  <button onClick={() => { setEditingItem(null); setShowModal('checklist'); }} className="btn btnPrimary">
                    <Plus size={16} /> Thêm công việc
                  </button>
                </div>

                {/* Filters */}
                <div className="filtersBar">
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-muted)' }}>
                    Lọc thời điểm:
                  </span>
                  <button 
                    className={`btn ${checklistFilter === 'All' ? 'btnPrimary' : 'btnSecondary'}`} 
                    onClick={() => setChecklistFilter('All')}
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    Tất cả
                  </button>
                  {checklistCategories.map(cat => (
                    <button
                      key={cat}
                      className={`btn ${checklistFilter === cat ? 'btnPrimary' : 'btnSecondary'}`}
                      onClick={() => setChecklistFilter(cat)}
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Checklist Layout (Cards grouped by Category, or unified list based on filter) */}
                {checklistFilter !== 'All' ? (
                  <div className="checklistColumn">
                    <h3>
                      <span>{checklistFilter}</span>
                      <small style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>
                        ({filteredChecklist.filter(c => c.is_completed).length}/{filteredChecklist.length})
                      </small>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {filteredChecklist.length === 0 ? (
                        <p className="emptyState" style={{ padding: '20px' }}>Chưa có công việc nào trong danh mục này.</p>
                      ) : (
                        filteredChecklist.map(item => (
                          <div key={item.id} className={`taskItem ${item.is_completed ? 'completed' : ''}`}>
                            <input 
                              type="checkbox" 
                              className="taskCheckbox" 
                              checked={item.is_completed}
                              onChange={() => handleToggleChecklist(item.id, item.is_completed)}
                            />
                            <div className="taskDetails">
                              <span className="taskName">{item.task}</span>
                              <div className="taskMeta">
                                <span><Calendar size={12} /> Hạn: {item.due_date ? new Date(item.due_date).toLocaleDateString('vi-VN') : 'Không có'}</span>
                                <span><User size={12} /> Người làm: {item.assigned_to || 'Chưa phân công'}</span>
                                {item.notes && <span style={{ width: '100%', fontStyle: 'italic', display: 'block', marginTop: '2px' }}>* {item.notes}</span>}
                              </div>
                            </div>
                            <div className="taskActions">
                              <button 
                                onClick={() => { setEditingItem(item); setShowModal('checklist'); }}
                                className="btn" style={{ padding: '4px', background: 'transparent', color: 'var(--accent-moss)' }}
                              >
                                <Edit2 size={12} />
                              </button>
                              <button 
                                onClick={() => handleDeleteChecklist(item.id)}
                                className="btn" style={{ padding: '4px', background: 'transparent', color: 'var(--accent-rose)' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="checklistGrid">
                    {checklistCategories.map(cat => {
                      const catTasks = checklist.filter(t => t.category === cat);
                      const completedCatTasks = catTasks.filter(t => t.is_completed);
                      
                      return (
                        <div key={cat} className="checklistColumn">
                          <h3>
                            <span>{cat}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--accent-muted)' }}>
                              {completedCatTasks.length}/{catTasks.length}
                            </span>
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                            {catTasks.length === 0 ? (
                              <p className="emptyState" style={{ padding: '20px', fontSize: '0.8rem' }}>Trống</p>
                            ) : (
                              catTasks.map(item => (
                                <div key={item.id} className={`taskItem ${item.is_completed ? 'completed' : ''}`}>
                                  <input 
                                    type="checkbox" 
                                    className="taskCheckbox" 
                                    checked={item.is_completed}
                                    onChange={() => handleToggleChecklist(item.id, item.is_completed)}
                                  />
                                  <div className="taskDetails">
                                    <span className="taskName">{item.task}</span>
                                    <div className="taskMeta">
                                      <span><Calendar size={10} /> {item.due_date ? new Date(item.due_date).toLocaleDateString('vi-VN') : 'Không hạn'}</span>
                                      <span><User size={10} /> {item.assigned_to || 'Chưa gán'}</span>
                                      {item.notes && <span style={{ width: '100%', fontStyle: 'italic', display: 'block', fontSize: '0.65rem' }}>* {item.notes}</span>}
                                    </div>
                                  </div>
                                  <div className="taskActions">
                                    <button 
                                      onClick={() => { setEditingItem(item); setShowModal('checklist'); }}
                                      className="btn" style={{ padding: '4px', background: 'transparent', color: 'var(--accent-moss)' }}
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteChecklist(item.id)}
                                      className="btn" style={{ padding: '4px', background: 'transparent', color: 'var(--accent-rose)' }}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ------------------------------------------------- */}
      {/* MODALS */}
      {/* ------------------------------------------------- */}

      {/* EXPENSE MODAL */}
      {showModal === 'expense' && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h3>{editingItem ? 'Sửa chi phí cưới' : 'Thêm chi phí cưới'}</h3>
              <button className="closeButton" onClick={() => setShowModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveExpense}>
              <div className="modalBody">
                <div className="inputGroup">
                  <label>Tên chi phí / Hạng mục</label>
                  <input 
                    type="text" name="name" required placeholder="Ví dụ: Thuê cổng hoa gia tiên" 
                    className="formInput" defaultValue={editingItem?.name || ''} 
                  />
                </div>
                <div className="inputGroup">
                  <label>Danh mục</label>
                  <select name="category" className="formSelect" defaultValue={editingItem?.category || 'Tiệc cưới'}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="inputGroup">
                    <label>Chi phí dự kiến (đ)</label>
                    <input 
                      type="number" name="planned_amount" required min="0" placeholder="0"
                      className="formInput" defaultValue={editingItem?.planned_amount || 0} 
                    />
                  </div>
                  <div className="inputGroup">
                    <label>Chi phí thực tế (đ)</label>
                    <input 
                      type="number" name="actual_amount" required min="0" placeholder="0"
                      className="formInput" defaultValue={editingItem?.actual_amount || 0} 
                    />
                  </div>
                </div>
                <div className="inputGroup">
                  <label>Đã thanh toán trước (đ)</label>
                  <input 
                    type="number" name="paid_amount" required min="0" placeholder="0"
                    className="formInput" defaultValue={editingItem?.paid_amount || 0} 
                  />
                </div>
                <div className="inputGroup">
                  <label>Ghi chú thêm</label>
                  <textarea 
                    name="notes" placeholder="Chi tiết hợp đồng, thông tin liên hệ..." rows={3}
                    className="formInput" defaultValue={editingItem?.notes || ''}
                  ></textarea>
                </div>
              </div>
              <div className="modalFooter">
                <button type="button" onClick={() => setShowModal(null)} className="btn btnSecondary">Hủy</button>
                <button type="submit" className="btn btnPrimary">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INCOME MODAL */}
      {showModal === 'income' && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h3>{editingItem ? 'Sửa khoản thu' : 'Thêm khoản thu'}</h3>
              <button className="closeButton" onClick={() => setShowModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveIncome}>
              <div className="modalBody">
                <div className="inputGroup">
                  <label>Nội dung đóng góp / Tên khoản thu</label>
                  <input 
                    type="text" name="name" required placeholder="Ví dụ: Bố mẹ chú rể cho tiền tiệc" 
                    className="formInput" defaultValue={editingItem?.name || ''} 
                  />
                </div>
                <div className="inputGroup">
                  <label>Nguồn hỗ trợ</label>
                  <select name="source" className="formSelect" defaultValue={editingItem?.source || 'Bố mẹ chú rể'}>
                    {incomeSources.map(src => <option key={src} value={src}>{src}</option>)}
                  </select>
                </div>
                <div className="inputGroup">
                  <label>Số tiền đóng góp (đ)</label>
                  <input 
                    type="number" name="amount" required min="0" placeholder="0"
                    className="formInput" defaultValue={editingItem?.amount || 0} 
                  />
                </div>
                <div className="inputGroup">
                  <label>Ghi chú</label>
                  <textarea 
                    name="notes" placeholder="Ghi chú chi tiết..." rows={3}
                    className="formInput" defaultValue={editingItem?.notes || ''}
                  ></textarea>
                </div>
              </div>
              <div className="modalFooter">
                <button type="button" onClick={() => setShowModal(null)} className="btn btnSecondary">Hủy</button>
                <button type="submit" className="btn btnPrimary">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GUEST MODAL */}
      {showModal === 'guest' && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h3>{editingItem ? 'Sửa khách mời' : 'Thêm khách mời'}</h3>
              <button className="closeButton" onClick={() => setShowModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveGuest}>
              <div className="modalBody" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="inputGroup">
                  <label>Họ & Tên khách mời</label>
                  <input 
                    type="text" name="name" required placeholder="Ví dụ: Nguyễn Văn A" 
                    className="formInput" defaultValue={editingItem?.name || ''} 
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="inputGroup">
                    <label>Phía gia đình</label>
                    <select name="side" className="formSelect" defaultValue={editingItem?.side || 'groom'}>
                      <option value="groom">Nhà trai</option>
                      <option value="bride">Nhà gái</option>
                    </select>
                  </div>
                  <div className="inputGroup">
                    <label>Nhóm khách</label>
                    <input 
                      type="text" name="group_name" required placeholder="Ví dụ: Bạn đại học, Họ hàng..." 
                      className="formInput" defaultValue={editingItem?.group_name || 'Bạn bè'} 
                      list="guest-group-list"
                    />
                    <datalist id="guest-group-list">
                      {guestGroups.map(grp => <option key={grp} value={grp} />)}
                      <option value="Họ hàng" />
                      <option value="Đồng nghiệp" />
                      <option value="Bạn cấp 3" />
                    </datalist>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="inputGroup">
                    <label>Số điện thoại</label>
                    <input 
                      type="tel" name="phone" placeholder="09xxxxxxxx" 
                      className="formInput" defaultValue={editingItem?.phone || ''} 
                    />
                  </div>
                  <div className="inputGroup">
                    <label>Số người đi cùng</label>
                    <input 
                      type="number" name="rsvp_count" min="0" placeholder="0"
                      className="formInput" defaultValue={editingItem?.rsvp_count || 0} 
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="inputGroup">
                    <label>Tiền mừng cưới (đ)</label>
                    <input 
                      type="number" name="gift_amount" min="0" placeholder="0"
                      className="formInput" defaultValue={editingItem?.gift_amount || 0} 
                    />
                  </div>
                  <div className="inputGroup">
                    <label>Trạng thái</label>
                    <select name="status" className="formSelect" defaultValue={editingItem?.status || 'uninvited'}>
                      <option value="uninvited">Chưa mời</option>
                      <option value="invited">Đã mời</option>
                      <option value="attending">Sẽ tham gia</option>
                      <option value="declined">Không tham gia</option>
                    </select>
                  </div>
                </div>
                <div className="inputGroup">
                  <label>Ghi chú</label>
                  <textarea 
                    name="notes" placeholder="Ví dụ: Ngồi bàn số 5 bạn chú rể..." rows={2}
                    className="formInput" defaultValue={editingItem?.notes || ''}
                  ></textarea>
                </div>
              </div>
              <div className="modalFooter">
                <button type="button" onClick={() => setShowModal(null)} className="btn btnSecondary">Hủy</button>
                <button type="submit" className="btn btnPrimary">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHECKLIST MODAL */}
      {showModal === 'checklist' && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h3>{editingItem ? 'Sửa công việc cưới' : 'Thêm công việc cưới'}</h3>
              <button className="closeButton" onClick={() => setShowModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveChecklist}>
              <div className="modalBody">
                <div className="inputGroup">
                  <label>Tên công việc cần làm</label>
                  <input 
                    type="text" name="task" required placeholder="Ví dụ: Gửi thiệp mời online cho bạn đại học" 
                    className="formInput" defaultValue={editingItem?.task || ''} 
                  />
                </div>
                <div className="inputGroup">
                  <label>Thời điểm thực hiện</label>
                  <select name="category" className="formSelect" defaultValue={editingItem?.category || 'Trước ngày cưới'}>
                    {checklistCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="inputGroup">
                    <label>Hạn hoàn thành</label>
                    <input 
                      type="date" name="due_date" 
                      className="formInput" defaultValue={editingItem?.due_date || ''} 
                    />
                  </div>
                  <div className="inputGroup">
                    <label>Người chịu trách nhiệm</label>
                    <select name="assigned_to" className="formSelect" defaultValue={editingItem?.assigned_to || 'Cả hai'}>
                      <option value="Chú rể">Chú rể</option>
                      <option value="Cô dâu">Cô dâu</option>
                      <option value="Cả hai">Cả hai</option>
                    </select>
                  </div>
                </div>
                <div className="inputGroup">
                  <label>Ghi chú chi tiết</label>
                  <textarea 
                    name="notes" placeholder="Mô tả công việc..." rows={3}
                    className="formInput" defaultValue={editingItem?.notes || ''}
                  ></textarea>
                </div>
              </div>
              <div className="modalFooter">
                <button type="button" onClick={() => setShowModal(null)} className="btn btnSecondary">Hủy</button>
                <button type="submit" className="btn btnPrimary">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
