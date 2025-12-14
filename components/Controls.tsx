import React, { useRef, useState } from 'react';
import { AspectRatio, Resolution } from '../types';
import { Button } from './Button';

interface ControlsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (value: AspectRatio) => void;
  resolution: Resolution;
  setResolution: (value: Resolution) => void;
  referenceImage: string | undefined;
  setReferenceImage: (value: string | undefined) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  resolution,
  setResolution,
  referenceImage,
  setReferenceImage,
  onGenerate,
  isGenerating
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setReferenceImage(undefined);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full gap-6 p-6 overflow-y-auto bg-black text-gray-200">
      
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tighter text-white mb-1">Viet Anh</h1>
        <p className="text-neutral-500 text-xs uppercase tracking-widest">AI Character Creator</p>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        
        {/* Upload Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Tải Ảnh (Tùy Chọn)</label>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 text-xs py-3 border-dashed border-neutral-700 hover:border-white"
            >
              {fileName ? 'Đổi Ảnh Khác' : '+ Tải Ảnh Lên'}
            </Button>
            {referenceImage && (
              <Button type="button" variant="secondary" onClick={handleClearImage} className="px-3">
                ✕
              </Button>
            )}
          </div>
          {referenceImage && (
            <div className="relative w-full h-24 rounded bg-neutral-900 overflow-hidden border border-neutral-800 group">
              <img src={referenceImage} alt="Ref" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/80 to-transparent">
                 <span className="text-[10px] text-white truncate">{fileName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Prompt Section */}
        <div className="space-y-2 flex-1 flex flex-col">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Mô Tả Hình Ảnh</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Nhập mô tả hình ảnh bạn đang tưởng tượng... (ví dụ: Chiến binh không gian, phong cách đen trắng, ánh sáng tương phản)"
            className="w-full flex-1 min-h-[120px] bg-[#0a0a0a] border border-neutral-800 p-4 text-white text-sm focus:border-white focus:outline-none focus:ring-0 transition-colors resize-none placeholder-neutral-700 leading-relaxed"
          />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Tỉ Lệ Khung Hình</label>
            <div className="relative">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full bg-[#0a0a0a] border border-neutral-800 text-white text-xs p-3 appearance-none focus:border-white focus:outline-none cursor-pointer"
              >
                <option value={AspectRatio.SQUARE}>Vuông (1:1)</option>
                <option value={AspectRatio.PORTRAIT}>Dọc (3:4)</option>
                <option value={AspectRatio.LANDSCAPE}>Ngang (4:3)</option>
                <option value={AspectRatio.WIDE}>Rộng (16:9)</option>
                <option value={AspectRatio.TALL}>Cao (9:16)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-[10px]">▼</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Độ Phân Giải</label>
            <div className="relative">
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full bg-[#0a0a0a] border border-neutral-800 text-white text-xs p-3 appearance-none focus:border-white focus:outline-none cursor-pointer"
              >
                <option value={Resolution.RES_1K}>1080P (Nhanh)</option>
                <option value={Resolution.RES_2K}>2K (Pro - Nét)</option>
                <option value={Resolution.RES_4K}>4K (Pro - Siêu Nét)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-[10px]">▼</div>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-2">
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating || !prompt.trim()} 
            fullWidth
            className="h-14 text-sm uppercase tracking-widest"
          >
            {isGenerating ? "Đang xử lý..." : "TẠO ẢNH"}
          </Button>
          <p className="mt-3 text-[10px] text-neutral-600 text-center">
            *Độ phân giải 2K & 4K yêu cầu API Key trả phí (Gemini Pro).
          </p>
        </div>

      </div>
    </div>
  );
};