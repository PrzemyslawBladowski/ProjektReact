import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { X, Camera } from 'lucide-react';
import { User } from '../../types';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updates: Partial<User>) => void;
}

export function EditProfileDialog({ isOpen, onClose, user, onSave }: EditProfileDialogProps) {
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio || '');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ avatar, bio });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg p-0 overflow-hidden [&>button]:hidden">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white font-semibold">Edytuj profil</DialogTitle>
              <DialogDescription className="text-white/90 mt-1">Edytuj swoje informacje profilowe</DialogDescription>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-white/80 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 p-6 bg-white">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-blue-100 bg-white">
                {avatar ? (
                  <AvatarImage src={avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="edit-profile-image"
              />
              <button
                type="button"
                onClick={() => document.getElementById('edit-profile-image')?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Kliknij ikonę aparatu, aby zmienić zdjęcie</p>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-900 font-semibold">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Nowy członek społeczności naukowej"
              className="resize-none bg-gray-50 border-[0.5px] border-gray-200"
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4 justify-end">
            <Button variant="outline" onClick={onClose} className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50">
              Anuluj
            </Button>
            <Button onClick={handleSave} className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50">
              Zapisz zmiany
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}