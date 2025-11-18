import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Facebook, Linkedin, Instagram, Link as LinkIcon, Check } from 'lucide-react';

export function ShareDialog({ isOpen, onClose, postContent, postUrl }) {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Udostępnij post</DialogTitle>
          <DialogDescription>
            Wybierz platformę, na której chcesz udostępnić ten post
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          <Button
            onClick={shareToFacebook}
            className="w-full justify-start gap-3 bg-[#1877F2] hover:bg-[#1565C0] text-white"
          >
            <Facebook className="w-5 h-5" />
            Udostępnij na Facebook
          </Button>

          <Button
            onClick={shareToLinkedIn}
            className="w-full justify-start gap-3 bg-[#0A66C2] hover:bg-[#084E8F] text-white"
          >
            <Linkedin className="w-5 h-5" />
            Udostępnij na LinkedIn
          </Button>

          <Button
            onClick={shareToInstagram}
            className="w-full justify-start gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
          >
            <Instagram className="w-5 h-5" />
            Udostępnij na Instagram
          </Button>

          <div className="border-t pt-3 mt-3">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full justify-start gap-3"
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
          </div>

          <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 break-all">
            {postUrl}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
