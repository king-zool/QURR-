import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Users, Music, FileText, CheckCircle2, XCircle, 
  Plus, Edit, Eye, Trash2, Lock, BarChart3, Radio, Database, Check, AlertCircle, 
  Search, RotateCcw, Edit3, LogOut, KeyRound, Copy, CheckCheck, ExternalLink, Key 
} from 'lucide-react';
import { SURAHS, NIGERIAN_STATES } from '../data/surahs';
import { useLibrary } from '../context/LibraryContext';
import { Reciter, AudioPermissionType } from '../types';
import { EditReciterModal } from '../components/EditReciterModal';
import { PhotoUploadDropzone } from '../components/PhotoUploadDropzone';

interface AdminViewProps {
  onExit?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onExit }) => {
  const { 
    reciters, 
    updateReciter, 
    addReciter, 
    deleteReciter, 
    resetRecitersToDefault,
    submissions, 
    updateSubmissionStatus,
    curatorEmail,
    logoutCurator,
    updateCuratorPasskey
  } = useLibrary();

  const [copiedSecretUrl, setCopiedSecretUrl] = useState(false);
  const [isChangePasskeyOpen, setIsChangePasskeyOpen] = useState(false);
  const [newPasskeyInput, setNewPasskeyInput] = useState('');
  const [passkeyNotice, setPasskeyNotice] = useState(false);

  const handleCopySecretUrl = () => {
    const secretUrl = `${window.location.origin}${window.location.pathname}#/curator-portal`;
    navigator.clipboard.writeText(secretUrl);
    setCopiedSecretUrl(true);
    setTimeout(() => setCopiedSecretUrl(false), 2500);
  };

  const handleLogout = () => {
    logoutCurator();
    if (onExit) {
      onExit();
    } else {
      window.location.hash = '#/';
    }
  };

  const handleSaveNewPasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasskeyInput.trim()) return;
    updateCuratorPasskey(newPasskeyInput.trim());
    setPasskeyNotice(true);
    setTimeout(() => {
      setPasskeyNotice(false);
      setIsChangePasskeyOpen(false);
      setNewPasskeyInput('');
    }, 2000);
  };

  const [activeTab, setActiveTab] = useState<'analytics' | 'reciters' | 'submissions' | 'audio'>('analytics');
  
  // Reciter editing & filtering state
  const [editingReciter, setEditingReciter] = useState<Reciter | null>(null);
  const [reciterSearch, setReciterSearch] = useState('');
  const [reciterStateFilter, setReciterStateFilter] = useState('');
  const [resetNotice, setResetNotice] = useState(false);

  // New Reciter Modal State
  const [isAddReciterOpen, setIsAddReciterOpen] = useState(false);
  const [newReciterName, setNewReciterName] = useState('');
  const [newReciterArabic, setNewReciterArabic] = useState('');
  const [newReciterState, setNewReciterState] = useState('Kano');
  const [newReciterCity, setNewReciterCity] = useState('');
  const [newReciterRiwayah, setNewReciterRiwayah] = useState("Warsh 'an Nafi'");
  const [newReciterBio, setNewReciterBio] = useState('');
  const [newReciterAudioUrl, setNewReciterAudioUrl] = useState('https://server8.mp3quran.net/afs/');
  const [newReciterPhoto, setNewReciterPhoto] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop');

  // Audio permission manager state
  const [selectedAudioPermission, setSelectedAudioPermission] = useState<AudioPermissionType>('download_permitted');
  const [permissionNotice, setPermissionNotice] = useState(false);

  const handleCreateReciter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReciterName || !newReciterCity) return;

    const slug = newReciterName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newReciter: Reciter = {
      id: `reciter-${Date.now()}`,
      name: newReciterName,
      arabicName: newReciterArabic || newReciterName,
      slug,
      state: newReciterState,
      city: newReciterCity,
      riwayah: newReciterRiwayah as any,
      qiraah: "Nafi' al-Madani",
      photograph: newReciterPhoto,
      biography: newReciterBio,
      verified: true,
      featured: false,
      completeQuranAvailable: true,
      audioBaseUrl: newReciterAudioUrl,
      totalListens: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addReciter(newReciter);
    setIsAddReciterOpen(false);
    // Reset form
    setNewReciterName('');
    setNewReciterArabic('');
    setNewReciterCity('');
    setNewReciterBio('');
  };

  const toggleFeatured = (reciterId: string) => {
    const r = reciters.find(item => item.id === reciterId);
    if (r) {
      updateReciter(reciterId, { featured: !r.featured });
    }
  };

  const toggleVerified = (reciterId: string) => {
    const r = reciters.find(item => item.id === reciterId);
    if (r) {
      updateReciter(reciterId, { verified: !r.verified });
    }
  };

  const filteredRecitersList = useMemo(() => {
    return reciters.filter(r => {
      const matchesSearch = !reciterSearch.trim() || 
        r.name.toLowerCase().includes(reciterSearch.toLowerCase().trim()) ||
        r.arabicName.includes(reciterSearch.trim()) ||
        r.city.toLowerCase().includes(reciterSearch.toLowerCase().trim());
      
      const matchesState = !reciterStateFilter || r.state.toLowerCase() === reciterStateFilter.toLowerCase();
      
      return matchesSearch && matchesState;
    });
  }, [reciters, reciterSearch, reciterStateFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-28">
      
      {/* Curator Active Session & Security Toolbar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#064E3B] to-[#0A3D2E] text-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Status & Identity */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-200">
                Authorized Curator Session
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-emerald-100 font-mono">
                {curatorEmail}
              </span>
            </div>
            <p className="text-xs text-white/80">
              This console is hidden from public navigation. Access only via your secret portal URL.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Copy Secret URL */}
            <button
              onClick={handleCopySecretUrl}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
              title="Copy secret portal gateway URL to bookmark"
            >
              {copiedSecretUrl ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-200">URL Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Secret URL</span>
                </>
              )}
            </button>

            {/* Change Passkey */}
            <button
              onClick={() => setIsChangePasskeyOpen(!isChangePasskeyOpen)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Passkey</span>
            </button>

            {/* Exit to Public */}
            {onExit && (
              <button
                onClick={onExit}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
                title="Browse public archive without ending session"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Public Site</span>
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Lock portal and sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock & Sign Out</span>
            </button>

          </div>
        </div>

        {/* Change Passkey Dropdown/Panel */}
        {isChangePasskeyOpen && (
          <form onSubmit={handleSaveNewPasskey} className="pt-3 mt-3 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                Update Curator Passkey (Must be kept secure):
              </label>
              <input
                type="password"
                value={newPasskeyInput}
                onChange={(e) => setNewPasskeyInput(e.target.value)}
                placeholder="Enter new strong passkey..."
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-hidden focus:border-white focus:bg-white/15"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 sm:mt-5 px-4 py-1.5 rounded-lg bg-emerald-400 text-[#064E3B] font-bold text-xs hover:bg-emerald-300 transition-colors cursor-pointer"
            >
              Save Passkey
            </button>
            {passkeyNotice && (
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1 mt-4 sm:mt-5">
                <CheckCircle2 className="w-4 h-4" /> Updated!
              </span>
            )}
          </form>
        )}
      </div>
      
      {/* Curator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3DDD1] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#064E3B] uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>National Archival Curator Console</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141A17] mt-1">
            Qurrā’ Nigeria Repository Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6A63] mt-1">
            Moderate community submissions, verify sanad & canonical riwāyāt, and govern audio licensing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddReciterOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-semibold hover:bg-[#054131] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Verified Reciter</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3DDD1] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'analytics' ? 'bg-[#064E3B] text-white' : 'text-[#55635C] hover:bg-[#F2EFE8]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Repository Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer relative ${
            activeTab === 'submissions' ? 'bg-[#064E3B] text-white' : 'text-[#55635C] hover:bg-[#F2EFE8]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Moderation Queue</span>
          {submissions.filter(s => s.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#C29B38] text-white">
              {submissions.filter(s => s.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reciters')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'reciters' ? 'bg-[#064E3B] text-white' : 'text-[#55635C] hover:bg-[#F2EFE8]'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Manage Reciters ({reciters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'audio' ? 'bg-[#064E3B] text-white' : 'text-[#55635C] hover:bg-[#F2EFE8]'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Audio Permissions & Storage</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-[#E3DDD1] p-5 shadow-xs">
              <div className="text-xs font-semibold text-[#6E7B75] uppercase">Documented Reciters</div>
              <div className="font-editorial text-3xl font-bold text-[#141A17] mt-1">{reciters.length}</div>
              <div className="text-[11px] text-[#064E3B] font-medium mt-1">Across 14 Nigerian States</div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E3DDD1] p-5 shadow-xs">
              <div className="text-xs font-semibold text-[#6E7B75] uppercase">Catalogued Surah Audio</div>
              <div className="font-editorial text-3xl font-bold text-[#141A17] mt-1">1,140+</div>
              <div className="text-[11px] text-[#064E3B] font-medium mt-1">High-definition authorized streams</div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E3DDD1] p-5 shadow-xs">
              <div className="text-xs font-semibold text-[#6E7B75] uppercase">Total Listening Hours</div>
              <div className="font-editorial text-3xl font-bold text-[#141A17] mt-1">18,420</div>
              <div className="text-[11px] text-[#064E3B] font-medium mt-1">+14% this month</div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E3DDD1] p-5 shadow-xs">
              <div className="text-xs font-semibold text-[#6E7B75] uppercase">Pending Submissions</div>
              <div className="font-editorial text-3xl font-bold text-[#C29B38] mt-1">
                {submissions.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-[11px] text-[#6E7B75] mt-1">Awaiting archival review</div>
            </div>
          </div>

          {/* Regional & Riwayah Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-[#E3DDD1] p-6 shadow-xs space-y-4">
              <h3 className="font-editorial text-xl font-bold text-[#141A17]">
                State Representation in Repository
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { state: 'Kano State', count: 3, pct: '30%' },
                  { state: 'Kaduna State', count: 2, pct: '20%' },
                  { state: 'Borno State', count: 1, pct: '10%' },
                  { state: 'Bauchi State', count: 1, pct: '10%' },
                  { state: 'Sokoto State', count: 1, pct: '10%' },
                  { state: 'Kwara State', count: 1, pct: '10%' },
                  { state: 'Lagos State', count: 1, pct: '10%' },
                ].map(item => (
                  <div key={item.state} className="space-y-1">
                    <div className="flex justify-between text-[#38433E]">
                      <span className="font-medium">{item.state}</span>
                      <span>{item.count} reciters ({item.pct})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#EAE6DD] overflow-hidden">
                      <div className="h-full bg-[#064E3B]" style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E3DDD1] p-6 shadow-xs space-y-4">
              <h3 className="font-editorial text-xl font-bold text-[#141A17]">
                Canonical Riwāyāt Preservation
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] space-y-1">
                  <div className="flex justify-between font-bold text-[#141A17]">
                    <span>Warsh ‘an Nāfi‘</span>
                    <span>50%</span>
                  </div>
                  <p className="text-[#64716B]">Primary historical transmission of Northern and Western Nigeria.</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] space-y-1">
                  <div className="flex justify-between font-bold text-[#141A17]">
                    <span>Hafs ‘an ‘Āṣim</span>
                    <span>30%</span>
                  </div>
                  <p className="text-[#64716B]">Widely adopted in modern Nigerian educational markazes.</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] space-y-1">
                  <div className="flex justify-between font-bold text-[#141A17]">
                    <span>Qālūn ‘an Nāfi‘ & Ad-Dūrī</span>
                    <span>20%</span>
                  </div>
                  <p className="text-[#64716B]">Preserved among specialized Qur'anic circles in Borno and Ilorin.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SUBMISSIONS MODERATION QUEUE */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-bold text-[#141A17]">
              Community Reciter Submissions ({submissions.length})
            </h3>
            <span className="text-xs text-[#6F7C76]">
              Review biographic sources and verify authentic sound files before approval
            </span>
          </div>

          <div className="space-y-4">
            {submissions.map(sub => (
              <div 
                key={sub.id}
                className="bg-white rounded-2xl border border-[#E3DDD1] p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFECE3] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-editorial text-lg font-bold text-[#141A17]">{sub.fullName}</h4>
                      {sub.arabicName && <span className="font-arabic text-sm text-[#064E3B]">{sub.arabicName}</span>}
                    </div>
                    <p className="text-xs text-[#6F7C76]">
                      📍 {sub.city}, {sub.state} • Riwāyah: <strong>{sub.riwayah}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      sub.status === 'approved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : sub.status === 'rejected' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#414E48] leading-relaxed">
                  <strong>Biography / Notes:</strong> {sub.biography}
                </div>

                {sub.institution && (
                  <div className="text-xs text-[#5D6B65]">
                    <strong>Institution:</strong> {sub.institution}
                  </div>
                )}

                <div className="text-xs text-[#5D6B65]">
                  <strong>Submitted by:</strong> {sub.submitterName} ({sub.submitterEmail}) on {new Date(sub.submittedAt).toLocaleDateString()}
                </div>

                {sub.status === 'pending' && (
                  <div className="pt-3 border-t border-[#EFECE3] flex items-center justify-end gap-2">
                    <button
                      onClick={() => updateSubmissionStatus(sub.id, 'rejected')}
                      className="px-3.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => updateSubmissionStatus(sub.id, 'approved')}
                      className="px-4 py-1.5 rounded-lg bg-[#064E3B] text-white text-xs font-semibold hover:bg-[#054131] flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve to Live Archive</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE RECITERS */}
      {activeTab === 'reciters' && (
        <div className="space-y-6">

          {/* Reset Confirmation Notice */}
          {resetNotice && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Archive has been restored to default verified historical reciters.</span>
              </div>
              <button
                onClick={() => setResetNotice(false)}
                className="text-amber-800 hover:text-amber-950 font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Table Controls & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#E3DDD1] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={reciterSearch}
                onChange={(e) => setReciterSearch(e.target.value)}
                placeholder="Search reciter by name, Arabic script, or city..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl text-[#1E2622] focus:outline-hidden focus:border-[#064E3B]"
              />
              {reciterSearch && (
                <button 
                  onClick={() => setReciterSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A9690] hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* State Filter */}
            <div className="flex items-center gap-2">
              <select
                value={reciterStateFilter}
                onChange={(e) => setReciterStateFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl text-[#1E2622] focus:outline-hidden focus:border-[#064E3B]"
              >
                <option value="">All States ({reciters.length})</option>
                {NIGERIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              <button
                onClick={() => setIsAddReciterOpen(true)}
                className="px-4 py-2 bg-[#064E3B] hover:bg-[#054031] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Reciter</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset reciter records back to default factory archival data? Any local edits will be reverted.')) {
                    resetRecitersToDefault();
                    setResetNotice(true);
                    setTimeout(() => setResetNotice(false), 4000);
                  }
                }}
                className="p-2 text-[#7C8882] hover:text-[#181F1C] hover:bg-[#FAF8F3] rounded-xl border border-[#DDD8CD] transition-colors cursor-pointer shrink-0"
                title="Reset Archive to Factory Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Reciters Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E3DDD1] bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#E3DDD1] font-semibold text-[#66736D] uppercase">
                  <th className="py-3 px-4">Reciter ({filteredRecitersList.length})</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Riwāyah</th>
                  <th className="py-3 px-4 text-center">Verified</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE3]">
                {filteredRecitersList.map(r => (
                  <tr key={r.id} className="hover:bg-[#FAF8F3] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={r.photograph} 
                          alt={r.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-[#E2DDD2]" 
                        />
                        <div>
                          <div className="font-bold text-[#141A17]">{r.name}</div>
                          <div className="font-arabic text-xs text-[#064E3B]">{r.arabicName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#525F59]">{r.city}, {r.state}</td>
                    <td className="py-3 px-4 font-medium text-[#1E2622]">{r.riwayah}</td>
                    
                    {/* Toggle Verified */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleVerified(r.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          r.verified ? 'bg-[#064E3B]/10 text-[#064E3B] hover:bg-[#064E3B]/20' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                        }`}
                        title="Toggle Verified Status"
                      >
                        {r.verified ? '✓ Verified' : 'Unverified'}
                      </button>
                    </td>

                    {/* Toggle Featured */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(r.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          r.featured ? 'bg-[#C29B38]/20 text-[#9E7A23] hover:bg-[#C29B38]/30' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        {r.featured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right font-medium">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingReciter(r)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#064E3B]/30 bg-[#064E3B]/5 hover:bg-[#064E3B]/15 text-[#064E3B] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit Reciter Profile"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${r.name} from the repository?`)) {
                              deleteReciter(r.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete reciter record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRecitersList.length === 0 && (
              <div className="p-8 text-center text-xs text-[#7A8680]">
                No reciters match your search criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIO PERMISSIONS & STORAGE */}
      {activeTab === 'audio' && (
        <div className="bg-white rounded-3xl border border-[#E3DDD1] p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#141A17]">
              Audio Licensing & Storage Governance
            </h3>
            <p className="text-xs text-[#63706A] mt-1">
              Configure universal audio permission policies according to Islamic waqf and copyright standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'streaming_only', title: 'Streaming Permitted Only', desc: 'Audio can be streamed globally via the website player; MP3 downloads disabled.' },
              { id: 'download_permitted', title: 'Streaming & Download Permitted', desc: 'Default policy for public educational recitations to support offline listening in low-bandwidth regions.' },
              { id: 'educational_use', title: 'Educational & Scholarly Use', desc: 'Audio restricted to academic research, markaz instruction, and accredited madrasahs.' },
              { id: 'restricted', title: 'Restricted / Family Archival Hold', desc: 'Private cassette tape archive pending family permission and sound cleanup.' },
            ].map(perm => (
              <div 
                key={perm.id}
                onClick={() => {
                  setSelectedAudioPermission(perm.id as any);
                  setPermissionNotice(true);
                  setTimeout(() => setPermissionNotice(false), 2500);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedAudioPermission === perm.id 
                    ? 'border-[#064E3B] bg-[#064E3B]/5 ring-1 ring-[#064E3B]' 
                    : 'border-[#E2DDD3] hover:bg-[#FAF8F3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#141A17]">{perm.title}</span>
                  {selectedAudioPermission === perm.id && <CheckCircle2 className="w-4 h-4 text-[#064E3B]" />}
                </div>
                <p className="text-xs text-[#5D6A64] mt-2">{perm.desc}</p>
              </div>
            ))}
          </div>

          {permissionNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Global repository default permission updated successfully.</span>
            </div>
          )}
        </div>
      )}

      {/* Add Reciter Modal */}
      {isAddReciterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-[#E3DDD1] max-h-[90vh] overflow-y-auto">
            <h3 className="font-editorial text-2xl font-bold text-[#141A17]">Add Verified Reciter</h3>
            
            <form onSubmit={handleCreateReciter} className="space-y-4">
              <PhotoUploadDropzone
                currentPhotoUrl={newReciterPhoto}
                onPhotoChange={(url) => setNewReciterPhoto(url)}
                label="Core Identity Portrait Photograph"
                helperText="Upload official photograph of scholar. Drag and drop, select file, or pick from styles."
                presetPortraits={[
                  { label: 'Elder Scholar (Turban)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
                  { label: 'Contemporary Reciter', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop' },
                  { label: 'Scholarly Academic', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
                  { label: 'Maiduguri Master', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop' }
                ]}
              />

              <div>
                <label className="block text-xs font-semibold text-[#29322E] mb-1">Reciter Full Name *</label>
                <input
                  type="text"
                  required
                  value={newReciterName}
                  onChange={(e) => setNewReciterName(e.target.value)}
                  placeholder="e.g. Sheikh Abubakar Gumi"
                  className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#29322E] mb-1">Arabic Name</label>
                <input
                  type="text"
                  value={newReciterArabic}
                  onChange={(e) => setNewReciterArabic(e.target.value)}
                  placeholder="e.g. الشيخ أبو بكر غومي"
                  className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl text-xs font-arabic"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#29322E] mb-1">State</label>
                  <select
                    value={newReciterState}
                    onChange={(e) => setNewReciterState(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl text-xs"
                  >
                    {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29322E] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newReciterCity}
                    onChange={(e) => setNewReciterCity(e.target.value)}
                    placeholder="e.g. Kaduna"
                    className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#29322E] mb-1">Canonical Riwāyah</label>
                <select
                  value={newReciterRiwayah}
                  onChange={(e) => setNewReciterRiwayah(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl text-xs"
                >
                  <option value="Warsh 'an Nafi'">Warsh 'an Nafi'</option>
                  <option value="Hafs 'an Asim">Hafs 'an Asim</option>
                  <option value="Qalun 'an Nafi'">Qalun 'an Nafi'</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#29322E] mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={newReciterBio}
                  onChange={(e) => setNewReciterBio(e.target.value)}
                  placeholder="Scholarly background and lineage..."
                  className="w-full px-3 py-2 bg-[#FAF8F3] border border-[#DDD8CD] rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddReciterOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDD8CD] text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-semibold hover:bg-[#054131]"
                >
                  Save to Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reciter Profile Editor Modal */}
      <EditReciterModal
        isOpen={Boolean(editingReciter)}
        reciter={editingReciter}
        onClose={() => setEditingReciter(null)}
        onSave={(updated) => updateReciter(updated.id, updated)}
      />

    </div>
  );
};
