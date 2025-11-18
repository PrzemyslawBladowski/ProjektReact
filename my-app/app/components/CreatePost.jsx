import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, X, Image as ImageIcon, Link as LinkIcon, Upload, PenSquare } from 'lucide-react';

export function CreatePost({ onCreatePost }) {
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (imageToRemove) => {
    setImages(images.filter(img => img !== imageToRemove));
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
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
    <Card className="mb-6 border-2 border-blue-100 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <PenSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Utwórz post naukowy</h2>
            <p className="text-gray-500 text-sm">Podziel się swoimi odkryciami ze społecznością</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Textarea
          placeholder="O czym chcesz opowiedzieć? Opisz swoje badania, odkrycia lub obserwacje..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="min-h-[100px] mb-4 resize-none"
        />

        {isExpanded && (
          <div className="space-y-4 animate-slide-up">
              {/* Tags Section */}
              <div>
                <Label className="text-sm mb-2 block text-gray-700">
                  Tagi naukowe
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Dodaj tag (np. Fizyka, Biologia)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button onClick={handleAddTag} variant="outline" size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Images Section */}
              <div>
                <Label className="text-sm mb-2 block text-gray-700">
                  Zdjęcia i wykresy
                </Label>
                
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload pliku
                    </TabsTrigger>
                    <TabsTrigger value="url" className="gap-2">
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
                      className="w-full gap-2"
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
                      />
                      <Button onClick={handleAddImage} variant="outline" size="icon">
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
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                    setContent('');
                    setTags([]);
                    setImages([]);
                  }}
                  variant="outline"
                >
                  Anuluj
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!content.trim()}
                  className="gap-2"
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
