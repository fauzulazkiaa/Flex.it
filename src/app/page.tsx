"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Show, useAuth } from '@clerk/nextjs';
import { Activity, Category } from '../types';
// Local storage helpers removed - using database APIs
import { Navbar } from '../components/Navbar';
import { StatCards } from '../components/StatCards';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
// Memaksa Vercel untuk membangun ulang tanpa cache
import { UpcomingDeadlines } from '../components/UpcomingDeadlines';
import { ActivityTable } from '../components/ActivityTable';
import { ActivityFormModal } from '../components/ActivityFormModal';
import { ActivityDetailModal } from '../components/ActivityDetailModal';
import { SettingsModal } from '../components/SettingsModal';
import { LPDPTable } from '../components/LPDPTable';
import { MilestoneRoadmap } from '../components/MilestoneRoadmap';
import { LandingPage } from '../components/LandingPage';
import { Trophy, Sparkles, Filter, Plus, ArrowUpRight, CheckCircle2, List, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table'>('dashboard');
  const [tableMode, setTableMode] = useState<'all' | 'lpdp' | 'roadmap'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { isSignedIn } = useAuth();

  // Load Initial Data from database APIs
  useEffect(() => {
    if (!isSignedIn) return;
    const loadData = async () => {
      try {
        const [resActs, resCats] = await Promise.all([
          fetch('/api/activities'),
          fetch('/api/categories')
        ]);
        if (resActs.ok && resCats.ok) {
          const acts = await resActs.json();
          const cats = await resCats.json();
          setActivities(acts);
          setCategories(cats);
        }
      } catch (error) {
        console.error('Failed to load data from database:', error);
      }
    };
    loadData();
  }, [isSignedIn]);

  // List Available Years from Data
  const availableYears = useMemo(() => {
    const setYears = new Set<number>();
    activities.forEach(a => setYears.add(a.year || new Date().getFullYear()));
    setYears.add(new Date().getFullYear());
    return Array.from(setYears).sort((a, b) => b - a);
  }, [activities]);

  // CRUD Handlers using database APIs
  const handleCreateOrUpdateActivity = async (
    data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    try {
      if (data.id) {
        // Update
        const res = await fetch(`/api/activities/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const updatedAct = await res.json();
          const updated = activities.map((a) => (a.id === data.id ? updatedAct : a));
          setActivities(updated);
          if (selectedActivity?.id === data.id) {
            setSelectedActivity(updatedAct);
          }
        }
      } else {
        // Create
        const res = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newAct = await res.json();
          setActivities([newAct, ...activities]);
        }
      }
    } catch (error) {
      console.error('Failed to save activity to database:', error);
    }
    setEditingActivity(null);
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const filtered = activities.filter((a) => a.id !== id);
        setActivities(filtered);
        if (selectedActivity?.id === id) {
          setSelectedActivity(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete activity from database:', error);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    try {
      const existing = activities.find(a => a.id === id);
      if (!existing) return;
      
      const res = await fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...existing, status: newStatus }),
      });
      if (res.ok) {
        const updatedAct = await res.json();
        const updated = activities.map((a) => (a.id === id ? updatedAct : a));
        setActivities(updated);
        if (selectedActivity?.id === id) {
          setSelectedActivity(updatedAct);
        }
      }
    } catch (error) {
      console.error('Failed to update activity status in database:', error);
    }
  };

  const handleSaveCategory = async (catToSave: Category) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catToSave),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
      }
    } catch (error) {
      console.error('Failed to save category to database:', error);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    try {
      const res = await fetch(`/api/categories/${catId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updated = categories.filter((c) => c.id !== catId);
        setCategories(updated);
      }
    } catch (error) {
      console.error('Failed to delete category from database:', error);
    }
  };

  const handleDataRefresh = (newActs: Activity[], newCats: Category[]) => {
    setActivities(newActs);
    setCategories(newCats);
  };

  return (
    <>
      <Show when="signed-out">
        <LandingPage />
      </Show>
      <Show when="signed-in">
        <div className="w-full pb-16">
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewActivity={() => {
          setEditingActivity(null);
          setIsFormOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      {/* Main Container */}
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 relative">
        <AnimatePresence mode="wait">
        {/* Tab 1: Dashboard Utama */}
        {activeTab === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            
            {/* Banner Header Dashboard */}
            <div className="bg-gradient-to-r from-zinc-900 via-[#121215] to-indigo-950/90 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-zinc-800/80">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 text-xs font-semibold backdrop-blur-md border border-indigo-800/60">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Pelacak Portfolio & Program Kegiatan
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100">
                    Dashboard Kompetisi & Program {selectedYear !== 'ALL' ? selectedYear : ''}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Pantau status pendaftaran, tenggat waktu terdekat, success rate, dan tautan arsip sertifikat Google Drive dalam satu tempat yang terorganisir.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingActivity(null);
                      setIsFormOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Kegiatan
                  </button>
                </div>
              </div>
            </div>

            {/* Stat Cards (Total, Success Rate, Upcoming, Status) */}
            <StatCards activities={activities} selectedYear={selectedYear} selectedMonth={selectedMonth} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
              {/* Charts (Distribusi Kategori) */}
              <AnalyticsCharts activities={activities} categories={categories} selectedYear={selectedYear} selectedMonth={selectedMonth} />

              {/* Upcoming Deadlines */}
              <UpcomingDeadlines
                activities={activities}
                categories={categories}
                onSelectActivity={(act) => setSelectedActivity(act)}
                onOpenTableWithFilter={() => setActiveTab('table')}
              />
            </div>

            {/* Quick Activity Table Ringkas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-zinc-100 text-lg">
                  Ringkasan Semua Kegiatan ({activities.length})
                </h3>
                <button
                  onClick={() => setActiveTab('table')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Buka Tabel Lengkap <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <ActivityTable
                activities={activities}
                categories={categories}
                onSelectActivity={(act) => setSelectedActivity(act)}
                onEditActivity={(act) => {
                  setEditingActivity(act);
                  setIsFormOpen(true);
                }}
                onDeleteActivity={handleDeleteActivity}
                onOpenNewActivity={() => {
                  setEditingActivity(null);
                  setIsFormOpen(true);
                }}
                selectedYearNav={selectedYear}
                selectedMonthNav={selectedMonth}
              />
            </div>

          </motion.div>
        )}

        {/* Tab 2: Tabel & Filter Kegiatan Lengkap */}
        {activeTab === 'table' && (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-zinc-100">
                  Daftar & Pengarsipan Berkas Kegiatan
                </h2>
                <p className="text-xs text-zinc-400">
                  Urutkan dan saring kegiatan berdasarkan kategori, status, dan rentang waktu.
                </p>
              </div>

              {/* Toggle Mode LPDP */}
              <div className="flex items-center p-1 bg-[#121215] rounded-xl border border-zinc-800">
                <button
                  onClick={() => setTableMode('all')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tableMode === 'all'
                      ? 'bg-zinc-800 text-indigo-400 border border-zinc-700/60 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Semua Kegiatan
                </button>
                <button
                  onClick={() => setTableMode('lpdp')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tableMode === 'lpdp'
                      ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/60 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Rekap Prestasi Selesai
                </button>
                <button
                  onClick={() => setTableMode('roadmap')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tableMode === 'roadmap'
                      ? 'bg-zinc-800 text-amber-400 border border-zinc-700/60 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Peta Perjalanan
                </button>
              </div>
            </div>

            {tableMode === 'all' ? (
              <ActivityTable 
                activities={activities}
                categories={categories}
                onSelectActivity={setSelectedActivity}
                onEditActivity={(act) => {
                  setEditingActivity(act);
                  setIsFormOpen(true);
                }}
                onDeleteActivity={handleDeleteActivity}
                onOpenNewActivity={() => {
                  setEditingActivity(null);
                  setIsFormOpen(true);
                }}
                selectedYearNav={selectedYear}
                selectedMonthNav={selectedMonth}
              />
            ) : tableMode === 'lpdp' ? (
              <LPDPTable 
                activities={activities}
                categories={categories}
                onEditActivity={(act) => {
                  setEditingActivity(act);
                  setIsFormOpen(true);
                }}
                onSelectActivity={setSelectedActivity}
              />
            ) : (
              <MilestoneRoadmap
                activities={activities}
                categories={categories}
                onSelectActivity={setSelectedActivity}
                onEditActivity={(act) => {
                  setEditingActivity(act);
                  setIsFormOpen(true);
                }}
              />
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* MODALS */}
      {/* 1. CRUD Form Modal */}
      <ActivityFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleCreateOrUpdateActivity}
        initialData={editingActivity}
        categories={categories}
      />

      {/* 2. Detail Activity Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        categories={categories}
        onEdit={(act) => {
          setEditingActivity(act);
          setIsFormOpen(true);
        }}
        onDelete={handleDeleteActivity}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* 3. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        categories={categories}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onDataRefresh={handleDataRefresh}
      />

    </div>
      </Show>
    </>
  );
}
