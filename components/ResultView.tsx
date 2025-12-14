import React, { useState } from 'react';
import { Button } from './Button';

interface ResultViewProps {
  images: string[];
  isLoading: boolean;
  progress: number;
  error: string | null;
  onRetry: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ images, isLoading, progress, error, onRetry }) => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // High quality download helper using Blob
  const handleDownload = async (base64Data: string, index: number) => {
    try {
        // Fetch the base64 data to create a Blob, ensuring exact byte representation
        const response = await fetch(base64Data);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `viet-anh-ai-${Date.now()}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (e) {
        console.error("Download failed", e);
        // Fallback method
        const link = document.createElement('a');
        link.href = base64Data;
        link.download = `viet-anh-ai-${Date.now()}.png`;
        link.click();
    }
  };

  if (error) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-neutral-950 p-6">
        <div className="text-center max-w-md space-y-4">
          <div className="w-16 h-16 border border-red-900 rounded-full flex items-center justify-center mx-auto text-red-700 bg-red-900/10 text-2xl">!</div>
          <h3 className="text-white text-lg font-semibold">Tạo ảnh thất bại</h3>
          <p className="text-neutral-500 text-sm">{error}</p>
          <Button onClick={onRetry} variant="outline" className="mt-4">Thử lại</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-neutral-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)',
               backgroundSize: '24px 24px'
             }}>
        </div>
        
        <div className="z-10 w-80 text-center space-y-8">
            <div className="relative w-full bg-neutral-800 h-2 rounded-full overflow-hidden shadow-inner border border-neutral-700">
                <div 
                    className="absolute left-0 top-0 bottom-0 bg-white transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="space-y-2">
                <h2 className="text-6xl font-bold text-white tracking-tighter tabular-nums">{progress}%</h2>
                <p className="text-neutral-400 text-xs tracking-[0.2em] uppercase animate-pulse">Đang xử lý dữ liệu AI...</p>
            </div>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-[#050505]">
        <div className="text-center space-y-4 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          <p className="text-sm font-light">Kết quả 4 ảnh sẽ hiển thị tại đây</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#050505] p-4 lg:p-8 overflow-y-auto">
        <h2 className="text-white text-sm font-bold uppercase tracking-widest mb-6 opacity-50">Kết Quả ({images.length})</h2>
        
        {/* Grid View */}
        <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full max-w-6xl mx-auto content-start">
            {images.map((imgSrc, idx) => (
                <div 
                    key={idx} 
                    onClick={() => setPreviewIndex(idx)}
                    className="relative group rounded-xl overflow-hidden border border-neutral-900 bg-neutral-900 aspect-square shadow-2xl cursor-pointer transition-transform hover:scale-[1.02] hover:border-neutral-700"
                >
                    <img 
                        src={imgSrc} 
                        alt={`Result ${idx}`} 
                        className="w-full h-full object-cover"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            Xem & Tải
                        </span>
                    </div>
                </div>
            ))}
        </div>

        {/* Preview Modal */}
        {previewIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 lg:p-10 animate-in fade-in duration-200">
                <div className="relative w-full h-full max-w-7xl max-h-full flex flex-col items-center justify-center">
                    
                    {/* Close Button */}
                    <button 
                        onClick={() => setPreviewIndex(null)}
                        className="absolute top-0 right-0 p-4 text-white hover:text-neutral-300 z-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    {/* Main Image */}
                    <img 
                        src={images[previewIndex]} 
                        alt="Preview" 
                        className="max-w-full max-h-[80vh] object-contain shadow-2xl border border-neutral-800 rounded-lg bg-neutral-900"
                    />

                    {/* Action Bar */}
                    <div className="mt-8 flex gap-4">
                        <Button 
                            onClick={() => handleDownload(images[previewIndex], previewIndex)}
                            variant="primary"
                            className="px-10 py-4 text-base shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            TẢI ẢNH GỐC (4K)
                        </Button>
                        <Button 
                            onClick={() => setPreviewIndex(null)}
                            variant="outline"
                            className="px-8"
                        >
                            Đóng
                        </Button>
                    </div>
                    
                    <p className="mt-4 text-neutral-500 text-xs">Đang xem ảnh {previewIndex + 1} / {images.length}</p>
                </div>
            </div>
        )}
    </div>
  );
};