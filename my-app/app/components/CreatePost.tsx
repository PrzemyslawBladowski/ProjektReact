'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, X, Image as ImageIcon, Link as LinkIcon, Upload, PenSquare } from 'lucide-react';

interface CreatePostProps {
  onCreatePost: (content: string, tags: string[], images: string[]) => void;
  availableTags?: string[];
}

export function CreatePost({ onCreatePost, availableTags = [] }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setImages(images.filter(img => img !== imageToRemove));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result && !images.includes(result)) {
            setImages(prev => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onCreatePost(content, tags, images);
      setContent('');
      setTags([]);
      setImages([]);
      setIsExpanded(false);
    }
  };

  return (
    <Card className="mb-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <PenSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 font-semibold">Utwórz post naukowy</h2>
            <p className="text-gray-500 text-sm">Podziel się swoimi odkryciami ze społecznością</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <Textarea
          placeholder="O czym chcesz opowiedzieć? Opisz swoje badania, odkrycia lub obserwacje..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="min-h-[100px] mb-4 resize-none bg-gray-50 border-gray-200"
        />

        {isExpanded && (
          <div className="space-y-4 animate-slide-up">
              {/* Tags Section */}
              {availableTags.length > 0 && (
                <div>
                  <Label className="text-sm mb-2 block text-gray-900">
                    Tagi naukowe
                  </Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                          tags.includes(tag)
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-200 text-blue-800'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Images Section */}
              <div>
                <Label className="text-sm mb-2 block text-gray-900">
                  Zdjęcia i wykresy
                </Label>
                
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-0.5 h-auto gap-0 rounded-lg border-0 shadow-none">
                    <TabsTrigger value="upload" className="gap-2 bg-transparent border-0 rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium text-gray-700 transition-colors duration-200">
                      <Upload className="w-4 h-4" />
                      Upload pliku
                    </TabsTrigger>
                    <TabsTrigger value="url" className="gap-2 bg-transparent border-0 rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium text-gray-700 transition-colors duration-200">
                      <LinkIcon className="w-4 h-4" />
                      URL obrazu
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full gap-2 bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Wybierz pliki graficzne
                    </Button>
                    <p className="text-xs text-gray-500">
                      Możesz dodać wiele zdjęć (JPG, PNG, GIF)
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImage();
                          }
                        }}
                        className="bg-gray-50 border-gray-200"
                      />
                      <Button onClick={handleAddImage} variant="outline" size="icon" className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Wklej link do zewnętrznego obrazu
                    </p>
                  </TabsContent>
                </Tabs>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          onClick={() => handleRemoveImage(img)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                    setContent('');
                    setTags([]);
                    setImages([]);
                  }}
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                >
                  Anuluj
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!content.trim()}
                  className="gap-2 bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <PenSquare className="w-4 h-4" />
                  Opublikuj post
                </Button>
              </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}