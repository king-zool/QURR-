import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, 
  Trash2, RefreshCw, Link as LinkIcon, Sparkles, Camera 
} from 'lucide-react';
import { processAndCompressImage } from '../utils/imageUtils';

export interface PhotoUploadDropzoneProps {
  currentPhotoUrl?: string;
  onPhotoChange: (newUrl: string) => void;
  label?: string;
  helperText?: string;
  presetPortraits?: { label: string; url: string }[];
}

export const PhotoUploadDropzone: React.FC<PhotoUploadDropzoneProps> = ({
  currentPhotoUrl,
  onPhotoChange,
  label = "Core Identity Portrait Photograph",
  helperText = "Upload high-resolution scholar portrait (PNG, JPG, WebP). Files are automatically optimized for crisp display.",
  presetPortraits = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadInfo, setUploadInfo] = useState<{ fileName: string; sizeKb: number } | null>(null);
  const [mode, setMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(currentPhotoUrl || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const result = await processAndCompressImage(file, 720, 0.85);
      onPhotoChange(result.dataUrl);
      setUploadInfo({
        fileName: result.originalFileName,
        sizeKb: result.fileSizeKb
      });
      setUrlInput(result.dataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset file input so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearPhoto = () => {
    onPhotoChange('');
    setUrlInput('');
    setUploadInfo(null);
    setErrorMessage(null);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      handleClearPhoto();
      return;
    }
    onPhotoChange(urlInput.trim());
    setUploadInfo(null);
  };

  return (
    <div className="p-4 rounded-2xl bg-white border border-[#E5DFD3] space-y-4 shadow-2xs">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFECE3] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#064E3B]" />
            <label className="text-xs font-bold text-[#181F1C] uppercase tracking-wider">
              {label}
            </label>
          </div>
          <p className="text-[11px] text-[#697670] mt-0.5">
            {helperText}
          </p>
        </div>

        {/* Input Method Selector */}
        <div className="flex items-center gap-1 bg-[#F4F1EA] p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              mode === 'upload' 
                ? 'bg-[#064E3B] text-white shadow-xs' 
                : 'text-[#586560] hover:text-[#181F1C]'
            }`}
          >
            <span className="flex items-center gap-1">
              <UploadCloud className="w-3 h-3" />
              Upload File
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode('presets')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              mode === 'presets' 
                ? 'bg-[#064E3B] text-white shadow-xs' 
                : 'text-[#586560] hover:text-[#181F1C]'
            }`}
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Presets
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              mode === 'url' 
                ? 'bg-[#064E3B] text-white shadow-xs' 
                : 'text-[#586560] hover:text-[#181F1C]'
            }`}
          >
            <span className="flex items-center gap-1">
              <LinkIcon className="w-3 h-3" />
              URL
            </span>
          </button>
        </div>
      </div>

      {/* Main Preview and Action Section */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        
        {/* Scholar Portrait Thumbnail Preview */}
        <div className="relative group w-28 h-32 rounded-xl overflow-hidden bg-[#ECE8DE] border-2 border-[#DDD7CA] shrink-0 shadow-xs flex items-center justify-center">
          {currentPhotoUrl ? (
            <img 
              src={currentPhotoUrl} 
              alt="Reciter Portrait" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#95A09A] p-2 text-center">
              <ImageIcon className="w-8 h-8 stroke-1" />
              <span className="text-[10px] mt-1 font-medium">No Photo</span>
            </div>
          )}

          {currentPhotoUrl && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-white text-[#181F1C] rounded-lg shadow-sm hover:bg-stone-100 cursor-pointer"
                title="Change Photo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleClearPhoto}
                className="p-1.5 bg-rose-600 text-white rounded-lg shadow-sm hover:bg-rose-700 cursor-pointer"
                title="Remove Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Action Area according to Mode */}
        <div className="flex-1 w-full space-y-3">
          
          {/* Mode 1: Drag & Drop + Click to Upload */}
          {mode === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onFileInputChange}
                className="hidden"
                id="photo-upload-input"
              />

              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
                  isDragging 
                    ? 'border-[#064E3B] bg-[#064E3B]/8 ring-4 ring-[#064E3B]/10' 
                    : 'border-[#DDD7CA] bg-[#FAF8F3] hover:border-[#064E3B] hover:bg-[#F6F3EB]'
                }`}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-2 text-[#064E3B] gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-semibold">Optimizing portrait image...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#181F1C]">
                        <span className="text-[#064E3B] underline underline-offset-2">Click to select photo</span> or drag & drop here
                      </p>
                      <p className="text-[11px] text-[#697670] mt-0.5">
                        PNG, JPG or WebP (max 10MB). Automatically scaled for archival quality.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {uploadInfo && (
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#064E3B] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <div className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                    <span className="truncate font-medium">{uploadInfo.fileName}</span>
                  </div>
                  <span className="text-emerald-800 shrink-0 font-bold ml-2">
                    {uploadInfo.sizeKb} KB
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Presets Picker */}
          {mode === 'presets' && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#5A6762] block">
                Select from verified Nigerian scholar portrait styles:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presetPortraits.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onPhotoChange(preset.url);
                      setUrlInput(preset.url);
                      setUploadInfo(null);
                    }}
                    className={`px-2.5 py-2 rounded-xl border text-left text-[11px] transition-all flex items-center gap-2 cursor-pointer ${
                      currentPhotoUrl === preset.url
                        ? 'border-[#064E3B] bg-[#064E3B]/10 text-[#064E3B] font-bold shadow-2xs'
                        : 'border-[#E5DFD3] bg-[#FAF8F3] hover:bg-[#F2EFE8] text-[#414E48]'
                    }`}
                  >
                    <img 
                      src={preset.url} 
                      alt="" 
                      className="w-6 h-6 rounded-full object-cover shrink-0 border border-black/10" 
                    />
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode 3: Image URL Input */}
          {mode === 'url' && (
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-[#5A6762]">
                Direct Archival Image Link (HTTPS):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/scholar-portrait.jpg"
                  className="flex-1 px-3 py-2 text-xs bg-[#FAF8F3] border border-[#DDD7CA] rounded-xl text-[#181F1C] focus:outline-hidden focus:border-[#064E3B]"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3.5 py-2 bg-[#064E3B] text-white text-xs font-semibold rounded-xl hover:bg-[#054131] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
