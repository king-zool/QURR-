import React, { useState } from 'react';
import { ShieldCheck, Send, CheckCircle2, AlertCircle, FileText, Upload, Info } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { NIGERIAN_STATES } from '../data/surahs';
import { PhotoUploadDropzone } from '../components/PhotoUploadDropzone';

export const SubmitReciterView: React.FC = () => {
  const { addSubmission } = useLibrary();

  const [fullName, setFullName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [photographUrl, setPhotographUrl] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [riwayah, setRiwayah] = useState("Warsh 'an Nafi'");
  const [qiraah, setQiraah] = useState("Nafi' al-Madani");
  const [institution, setInstitution] = useState('');
  const [biography, setBiography] = useState('');
  const [recordingLinks, setRecordingLinks] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [permissionConfirmed, setPermissionConfirmed] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !state || !city || !biography || !submitterName || !submitterEmail) {
      setErrorMessage('Please complete all required fields marked with an asterisk (*).');
      return;
    }

    if (!permissionConfirmed) {
      setErrorMessage('You must confirm that you have rights or permission to submit these archival details and recordings.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addSubmission({
        reciterName: fullName,
        arabicName,
        photographUrl,
        state,
        city,
        riwayah,
        qiraah,
        institution,
        biography,
        audioRecordingsLink: recordingLinks,
        submittedBy: submitterName,
        submitterEmail,
        relationshipToReciter: 'Community Contributor',
        sourceReference: 'Community submission with verified metadata',
        permissionConfirmed
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleReset = () => {
    setFullName('');
    setArabicName('');
    setPhotographUrl('');
    setState('');
    setCity('');
    setRiwayah("Warsh 'an Nafi'");
    setQiraah("Nafi' al-Madani");
    setInstitution('');
    setBiography('');
    setRecordingLinks('');
    setSubmitterName('');
    setSubmitterEmail('');
    setPermissionConfirmed(false);
    setIsSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-28">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#064E3B] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Institutional Preservation Initiative</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141A17] tracking-tight">
          Help Preserve a Nigerian Reciter
        </h1>

        <p className="text-base sm:text-lg text-[#505D57] leading-relaxed">
          Know a Qur’an reciter whose voice and story deserve to be preserved? Help us document their contribution to Nigeria’s Qur’anic heritage.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-white rounded-3xl border border-[#D5E5DA] p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141A17]">
            Submission Received for Moderation
          </h2>

          <p className="text-sm text-[#4E5C55] max-w-lg mx-auto leading-relaxed">
            Thank you for contributing to the digital preservation of Nigeria's Qur'anic heritage. 
            Our archival review board will verify the reciter's details, canonical riwāyah, and audio recordings. 
            You can also view this submission inside the <strong>Curator Portal</strong>.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-semibold hover:bg-[#054131] transition-colors"
            >
              Submit Another Reciter
            </button>
          </div>
        </div>
      ) : (
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#E3DDD1] p-6 sm:p-10 shadow-xs space-y-8"
        >
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Reciter Details */}
          <div className="space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#141A17] border-b border-[#EFECE3] pb-2">
              1. Reciter's Scholarly Profile
            </h3>

            {/* Core Identity Photo Upload Dropzone */}
            <PhotoUploadDropzone
              currentPhotoUrl={photographUrl}
              onPhotoChange={(url) => setPhotographUrl(url)}
              label="Scholar Identity Portrait (Optional)"
              helperText="Upload an archival photo or portrait of the reciter if available. Drag and drop or browse from your device."
              presetPortraits={[
                { label: 'Elder Scholar (Turban)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
                { label: 'Contemporary Reciter', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop' },
                { label: 'Scholarly Academic', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' }
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                  Reciter’s Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sheikh Muhammad Kabiru Gombe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                  Arabic Name (if known)
                </label>
                <input
                  type="text"
                  value={arabicName}
                  onChange={(e) => setArabicName(e.target.value)}
                  placeholder="e.g. الشيخ محمد كبير غمبي"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] font-arabic focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                  State in Nigeria *
                </label>
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] focus:outline-hidden focus:border-[#064E3B]"
                >
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                  City / Town / Emirate *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Zaria, Maiduguri, Kano, Ilorin"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                  Canonical Riwāyah *
                </label>
                <select
                  value={riwayah}
                  onChange={(e) => setRiwayah(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] focus:outline-hidden focus:border-[#064E3B]"
                >
                  <option value="Warsh 'an Nafi'">Warsh 'an Nafi' (Historical West African)</option>
                  <option value="Hafs 'an Asim">Hafs 'an Asim</option>
                  <option value="Qalun 'an Nafi'">Qalun 'an Nafi'</option>
                  <option value="Ad-Duri 'an Abi 'Amr">Ad-Duri 'an Abi 'Amr</option>
                  <option value="Khalaf 'an Hamzah">Khalaf 'an Hamzah</option>
                  <option value="Other Canonical Riwayah">Other Canonical Riwāyah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                  Institution, Mosque, or Tsangaya
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Central Mosque Kano, Markaz Agege, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                Biography and Background *
              </label>
              <textarea
                required
                rows={4}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Include their teachers, education, style, regional impact, notable students, and any known recordings..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] focus:outline-hidden focus:border-[#064E3B]"
              />
            </div>
          </div>

          {/* Section 2: Audio Recording Links */}
          <div className="space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#141A17] border-b border-[#EFECE3] pb-2">
              2. Audio Recordings & Archives
            </h3>

            <div className="p-3.5 rounded-xl bg-[#F8F6EF] border border-[#E6E1D4] text-xs text-[#525E58] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
              <span>
                Please provide links to authentic audio files, Google Drive, Archive.org, or institutional repositories. 
                Recordings must be authorized for non-profit preservation.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                Audio Links (one per line)
              </label>
              <textarea
                rows={3}
                value={recordingLinks}
                onChange={(e) => setRecordingLinks(e.target.value)}
                placeholder="https://archive.org/... or cloud drive links with MP3s"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] font-mono text-xs focus:outline-hidden focus:border-[#064E3B]"
              />
            </div>
          </div>

          {/* Section 3: Submitter & Legal Confirmation */}
          <div className="space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#141A17] border-b border-[#EFECE3] pb-2">
              3. Contributor Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C3531] mb-1.5">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  placeholder="For verification updates"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1DBD0] text-sm text-[#1A201D] focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>
            </div>

            {/* Permission Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 rounded-xl bg-[#F6F4EC] border border-[#E3DDD1] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={permissionConfirmed}
                  onChange={(e) => setPermissionConfirmed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#064E3B] accent-[#064E3B]"
                />
                <span className="text-xs text-[#303B36] leading-relaxed">
                  I confirm that to the best of my knowledge, these biographical facts and recordings are accurate, 
                  and are submitted in accordance with copyright and ethical standards for scholarly Qur'anic preservation.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#EFECE3] flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-[#064E3B] text-white font-bold text-sm hover:bg-[#054131] transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting to Archive...' : 'Submit Reciter for Verification'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
