'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Facebook, Linkedin, Instagram, Link as LinkIcon, Check, X } from 'lucide-react';
import { useState } from 'react';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postContent: string;
  postUrl: string;
}

export function ShareDialog({ isOpen, onClose, postContent, postUrl }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToInstagram = () => {
    // Instagram doesn't have direct share URL API, so we copy the link
    copyToClipboard();
    alert('Link został skopiowany! Wklej go w swoim poście na Instagramie.');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg p-0 overflow-hidden [&>button]:hidden">
        <DialogHeader className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-gray-900 font-semibold">Udostępnij post</DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Wybierz platformę, na której chcesz udostępnić ten post
              </DialogDescription>
            </div>
            <button
              onClick={onClose}
              className="text-gray-900 hover:text-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 p-6 bg-white">
          <Button
            onClick={shareToFacebook}
            className="w-full justify-start gap-3 bg-[#1877F2] hover:bg-[#1565C0] text-white transition-colors duration-200"
          >
            <Facebook className="w-5 h-5" />
            Udostępnij na Facebook
          </Button>

          <Button
            onClick={shareToLinkedIn}
            className="w-full justify-start gap-3 bg-[#0A66C2] hover:bg-[#084E8F] text-white transition-colors duration-200"
          >
            <Linkedin className="w-5 h-5" />
            Udostępnij na LinkedIn
          </Button>

          <Button
            onClick={shareToInstagram}
            className="w-full justify-start gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white transition-opacity duration-200"
          >
            <Instagram className="w-5 h-5" />
            Udostępnij na Instagram
          </Button>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full justify-start gap-3 bg-white border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600">Link skopiowany!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-5 h-5" />
                  Skopiuj link do posta
                </>
              )}
            </Button>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mt-3">
              <p className="text-xs text-gray-600 break-all">{postUrl}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}