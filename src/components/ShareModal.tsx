import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Twitter, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  url
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Listen to ${title} (${subtitle}) on QURRĀ’ NIGERIA — Preserving the Voices of the Qur’an: ${url}`;

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#FCFBF9] dark:bg-[#121B17] rounded-2xl shadow-2xl border border-[#E2DDD3] dark:border-[#22332A] p-6 space-y-5 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#064E3B] dark:text-[#34D399]">
            <Share2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#1B211E] dark:text-[#F0EDE6]">Share Recitation</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#78847E] dark:text-[#9DAAA3] hover:bg-[#F0ECE2] dark:hover:bg-[#1B2822] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#181D1B] dark:text-[#F0EDE6]">{title}</h4>
          <p className="text-xs text-[#636F69] dark:text-[#9AA6A0] mt-0.5">{subtitle}</p>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-[#16231E] border border-[#DDD9CE] dark:border-[#24342C] rounded-xl">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full bg-transparent px-2 text-xs text-[#333D38] dark:text-[#D1DDD6] focus:outline-hidden font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
              copied 
                ? 'bg-[#064E3B] text-white' 
                : 'bg-[#F2EFE8] dark:bg-[#202E27] hover:bg-[#E7E3D8] dark:hover:bg-[#273930] text-[#29322E] dark:text-[#E2EAE5]'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Direct Social Channels */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#D5D0C3] dark:border-[#26372F] bg-white dark:bg-[#16231E] hover:bg-[#25D366]/10 hover:border-[#25D366] text-[#1E2522] dark:text-[#E2EAE5] text-xs font-medium transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={shareTwitter}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#D5D0C3] dark:border-[#26372F] bg-white dark:bg-[#16231E] hover:bg-stone-100 dark:hover:bg-[#1C2C25] text-[#1E2522] dark:text-[#E2EAE5] text-xs font-medium transition-colors cursor-pointer"
          >
            <Twitter className="w-4 h-4 text-stone-800 dark:text-stone-200" />
            <span>Share on X</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-[#828F88] dark:text-[#7A8A83] pt-1">
          All audio on Qurrā’ Nigeria is preserved for education and spiritual devotion.
        </p>
      </div>
    </div>
  );
};
