import React, { useState, useEffect } from 'react';
import { 
  X, Check, Image as ImageIcon, ShieldCheck, Award, School, User, 
  Sparkles, Save, AlertCircle 
} from 'lucide-react';
import { Reciter, RiwayahType, QiraahTradition } from '../types';
import { NIGERIAN_STATES } from '../data/surahs';
import { PhotoUploadDropzone } from './PhotoUploadDropzone';

interface EditReciterModalProps {
  isOpen: boolean;
  reciter: Reciter | null;
  onClose: () => void;
  onSave: (updatedReciter: Reciter) => void;
}

const PRESET_PORTRAITS = [
  { label: 'Elder Scholar (Turban)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
  { label: 'Contemporary Reciter', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop' },
  { label: 'Scholarly Academic', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
  { label: 'Maiduguri Master', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop' },
  { label: 'Sahelian Tsangaya Lead', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop' },
  { label: 'Sufi Markaz Teacher', url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=800&auto=format&fit=crop' },
];

const RIWAYAH_OPTIONS: RiwayahType[] = [
  "Warsh 'an Nafi'",
  "Hafs 'an Asim",
  "Qalun 'an Nafi'",
  "Ad-Duri 'an Abi 'Amr",
  "Khalaf 'an Hamzah",
  "Shu'bah 'an Asim",
  "Other documented riwāyāt"
];

const QIRAAH_OPTIONS: QiraahTradition[] = [
  "Nafi'",
  "'Asim",
  "Abu 'Amr",
  "Hamzah",
  "Ibn Kathir",
  "Ibn 'Amir",
  "Al-Kisa'i",
  "Abu Ja'far",
  "Ya'qub",
  "Khalaf al-'Ashir"
];

export const EditReciterModal: React.FC<EditReciterModalProps> = ({
  isOpen,
  reciter,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Reciter>>({});
  const [teachersInput, setTeachersInput] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'credentials' | 'biography' | 'audio'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (reciter) {
      setFormData({
        ...reciter
      });
      setTeachersInput(reciter.teachers ? reciter.teachers.join(', ') : '');
      setErrorMessage('');
      setSaveSuccess(false);
    }
  }, [reciter, isOpen]);

  if (!isOpen || !reciter) return null;

  const handleChange = (field: keyof Reciter, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      setErrorMessage('Reciter name is required.');
      setActiveTab('profile');
      return;
    }

    if (!formData.state?.trim()) {
      setErrorMessage('Nigerian State is required.');
      setActiveTab('profile');
      return;
    }

    const parsedTeachers = teachersInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const updated: Reciter = {
      ...reciter,
      ...formData,
      name: formData.name.trim(),
      arabicName: formData.arabicName?.trim() || reciter.arabicName,
      photograph: formData.photograph?.trim() || reciter.photograph,
      state: formData.state.trim(),
      city: formData.city?.trim() || reciter.city,
      riwayah: formData.riwayah || reciter.riwayah,
      qiraah: formData.qiraah || reciter.qiraah,
      institution: formData.institution?.trim() || '',
      ijazah: formData.ijazah?.trim() || '',
      specialisation: formData.specialisation?.trim() || '',
      yearBornOrEra: formData.yearBornOrEra?.trim() || '',
      biography: formData.biography?.trim() || reciter.biography,
      audioBaseUrl: formData.audioBaseUrl?.trim() || reciter.audioBaseUrl,
      teachers: parsedTeachers,
      verified: Boolean(formData.verified),
      featured: Boolean(formData.featured),
      completeQuranAvailable: Boolean(formData.completeQuranAvailable),
      updatedAt: new Date().toISOString()
    };

    setSaveSuccess(true);
    setTimeout(() => {
      onSave(updated);
      onClose();
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-3xl bg-[#FCFBF9] rounded-3xl shadow-2xl border border-[#E2DDD3] overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EBE6DB] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#141A17]">
                Edit Reciter Profile
              </h2>
              <p className="text-xs text-[#586560]">
                Updating scholarly archival record for <span className="font-semibold text-[#181F1C]">{reciter.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#78847E] hover:bg-[#F2EFE8] hover:text-[#181F1C] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#EBE6DB] bg-[#FAF8F3] flex items-center gap-2 overflow-x-auto shrink-0 py-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-[#55635C] hover:bg-[#EDE8DC]'
            }`}
          >
            1. Core Identity & Photo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'credentials'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-[#55635C] hover:bg-[#EDE8DC]'
            }`}
          >
            2. Riwāyah & Sanad
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('biography')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'biography'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-[#55635C] hover:bg-[#EDE8DC]'
            }`}
          >
            3. Biography & History
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-[#55635C] hover:bg-[#EDE8DC]'
            }`}
          >
            4. Audio Server & Status
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: CORE IDENTITY & PHOTO */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Core Identity Photo Upload & Management */}
              <PhotoUploadDropzone
                currentPhotoUrl={formData.photograph || reciter.photograph}
                onPhotoChange={(newUrl) => handleChange('photograph', newUrl)}
                label="Core Identity Portrait Photograph"
                helperText="Upload or update the official portrait photograph of this scholar. Supports drag-and-drop, manual selection, or curated presets."
                presetPortraits={PRESET_PORTRAITS}
              />

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#181F1C]">
                    Scholar Full English Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Sheikh Ahmad Sulaiman"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#181F1C]">
                    Arabic Name (Script)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.arabicName || ''}
                    onChange={(e) => handleChange('arabicName', e.target.value)}
                    placeholder="e.g. الشيخ أحمد سليمان"
                    className="w-full px-3.5 py-2.5 text-sm font-arabic bg-white border border-[#DDD7CA] rounded-xl text-[#064E3B] focus:outline-hidden focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              {/* State & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#181F1C]">
                    Nigerian State *
                  </label>
                  <select
                    value={formData.state || ''}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                  >
                    {NIGERIAN_STATES.map(st => (
                      <option key={st} value={st}>{st} State</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#181F1C]">
                    City / Town / Emirate
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="e.g. Kano City, Zaria, Azare, Maiduguri"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                  />
                </div>
              </div>

              {/* Era / Born */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#181F1C]">
                  Era / Lifespan / Active Period
                </label>
                <input
                  type="text"
                  value={formData.yearBornOrEra || ''}
                  onChange={(e) => handleChange('yearBornOrEra', e.target.value)}
                  placeholder="e.g. Contemporary, 1927 – Present, or 1934 – 2011"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

            </div>
          )}

          {/* TAB 2: CREDENTIALS & SANAD */}
          {activeTab === 'credentials' && (
            <div className="space-y-5">
              
              {/* Riwayah & Qira'ah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#181F1C]">
                    Primary Canonical Riwāyah *
                  </label>
                  <select
                    value={formData.riwayah || "Warsh 'an Nafi'"}
                    onChange={(e) => handleChange('riwayah', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                  >
                    {RIWAYAH_OPTIONS.map(rw => (
                      <option key={rw} value={rw}>{rw}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#181F1C]">
                    Canonical Qirā’ah Tradition
                  </label>
                  <select
                    value={formData.qiraah || "Nafi'"}
                    onChange={(e) => handleChange('qiraah', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                  >
                    {QIRAAH_OPTIONS.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Institution / Markaz */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#181F1C] flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Affiliated Institution / Markaz / Tsangaya Guild</span>
                </label>
                <input
                  type="text"
                  value={formData.institution || ''}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  placeholder="e.g. Markaz Tahfizul Qur'an, Kano / Tsangaya Guild of Borno"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              {/* Ijazah & Sanad */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#181F1C] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#C29B38]" />
                  <span>Verified Ijazah & Transmission Sanad</span>
                </label>
                <input
                  type="text"
                  value={formData.ijazah || ''}
                  onChange={(e) => handleChange('ijazah', e.target.value)}
                  placeholder="e.g. Documented Ijazah in Warsh 'an Nafi' via Tariq al-Azraq, verified by Kano Qur'anic Council"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              {/* Notable Teachers */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#181F1C] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Notable Shuyūkh & Teachers (comma separated)</span>
                </label>
                <input
                  type="text"
                  value={teachersInput}
                  onChange={(e) => setTeachersInput(e.target.value)}
                  placeholder="e.g. Sheikh Malam Balarabe Kano, Gwani Dan Zaria, Sheikh Isah Al-Kano"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              {/* Specialisation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#181F1C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Vocal Specialisation & Melodic Character</span>
                </label>
                <input
                  type="text"
                  value={formData.specialisation || ''}
                  onChange={(e) => handleChange('specialisation', e.target.value)}
                  placeholder="e.g. Distinctive West African Tarteel, Traditional Tsangaya Recitation & Warsh Vocal Inflection"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

            </div>
          )}

          {/* TAB 3: BIOGRAPHY */}
          {activeTab === 'biography' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#181F1C]">
                  Scholarly Biographical Narrative
                </label>
                <textarea
                  rows={8}
                  value={formData.biography || ''}
                  onChange={(e) => handleChange('biography', e.target.value)}
                  placeholder="Provide an in-depth biographical account of the reciter's early training, Tsangaya heritage, prominent recordings, and service to Qur'anic education in Nigeria..."
                  className="w-full px-3.5 py-3 text-sm leading-relaxed bg-white border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>
              <p className="text-xs text-[#63726B]">
                Tip: Include details of their memorization lineage, traditional Hausa or Kanuri titles (e.g. Gwani, Gangaran), and contributions to national musabaqah or community Tarawih.
              </p>
            </div>
          )}

          {/* TAB 4: AUDIO SERVER & STATUS */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              
              {/* Audio URL */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DFD3] space-y-2">
                <label className="block text-xs font-bold text-[#181F1C]">
                  Audio CDN Base URL
                </label>
                <input
                  type="url"
                  value={formData.audioBaseUrl || ''}
                  onChange={(e) => handleChange('audioBaseUrl', e.target.value)}
                  placeholder="https://server8.mp3quran.net/afs/"
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#FAF8F3] border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                />
                <p className="text-[11px] text-[#697670]">
                  Surahs 001 to 114 are fetched dynamically by appending <code className="bg-[#EFECE3] px-1 py-0.5 rounded text-[#064E3B]">001.mp3</code> to <code className="bg-[#EFECE3] px-1 py-0.5 rounded text-[#064E3B]">114.mp3</code>.
                </p>
              </div>

              {/* Status Toggles */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-[#181F1C] uppercase tracking-wider">
                  Archival Governance Flags
                </label>

                {/* Verified Flag */}
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E5DFD3] hover:bg-[#FAF8F3] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.verified)}
                    onChange={(e) => handleChange('verified', e.target.checked)}
                    className="w-4 h-4 rounded text-[#064E3B] focus:ring-[#064E3B]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#181F1C] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B]" />
                      <span>Verified Nigerian Scholar Badge</span>
                    </div>
                    <p className="text-[11px] text-[#606D67]">
                      Displays authentic verification seal indicating verified credentials and identity.
                    </p>
                  </div>
                </label>

                {/* Featured Flag */}
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E5DFD3] hover:bg-[#FAF8F3] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.featured)}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="w-4 h-4 rounded text-[#064E3B] focus:ring-[#064E3B]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#181F1C] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
                      <span>Feature on National Homepage</span>
                    </div>
                    <p className="text-[11px] text-[#606D67]">
                      Pins reciter profile to the spotlight carousel on the national homepage.
                    </p>
                  </div>
                </label>

                {/* Complete Quran Flag */}
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E5DFD3] hover:bg-[#FAF8F3] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.completeQuranAvailable)}
                    onChange={(e) => handleChange('completeQuranAvailable', e.target.checked)}
                    className="w-4 h-4 rounded text-[#064E3B] focus:ring-[#064E3B]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#181F1C]">
                      Complete 114 Surahs Available
                    </div>
                    <p className="text-[11px] text-[#606D67]">
                      Indicates that the full canonical Mus'haf recording is preserved and ready for streaming.
                    </p>
                  </div>
                </label>
              </div>

            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#EBE6DB] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#DDD7CA] bg-white text-xs font-semibold text-[#48554F] hover:bg-[#F2EFE8] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saveSuccess}
              className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053F30] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-75"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
