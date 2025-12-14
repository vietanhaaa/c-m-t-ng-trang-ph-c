import React, { useState } from 'react';
import { Controls } from './components/Controls';
import { ResultView } from './components/ResultView';
import { AspectRatio, Resolution } from './types';
import { generateImage, promptApiKeySelection } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [resolution, setResolution] = useState<Resolution>(Resolution.RES_1K);
  const [referenceImage, setReferenceImage] = useState<string | undefined>(undefined);
  
  // Store an array of images now instead of a single image
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);
    setProgress(0);

    try {
      // We want to generate 4 images.
      // We will create 4 parallel requests.
      const imageCount = 4;
      const newImages: string[] = [];
      let completedCount = 0;

      const generateSingle = async () => {
        try {
          const imageUrl = await generateImage({
            prompt,
            aspectRatio,
            resolution,
            referenceImage
          });
          completedCount++;
          setProgress(Math.round((completedCount / imageCount) * 100));
          return imageUrl;
        } catch (e) {
          console.error("Single image generation failed", e);
          return null;
        }
      };

      // Create array of promises
      const promises = Array(imageCount).fill(null).map(() => generateSingle());
      
      // Wait for all
      const results = await Promise.all(promises);
      
      // Filter out failures
      const successfulImages = results.filter((img): img is string => img !== null);

      if (successfulImages.length === 0) {
        throw new Error("Không thể tạo ảnh. Vui lòng thử lại.");
      }

      setGeneratedImages(successfulImages);

    } catch (err: any) {
      console.error(err);
      if (err.message === "API_KEY_REQUIRED" || err.message?.includes("API key")) {
        try {
            await promptApiKeySelection();
            setError("Đã chọn API Key. Vui lòng nhấn Tạo Ảnh lại.");
        } catch (authErr) {
            setError("Chưa chọn API Key. Không thể tạo ảnh độ phân giải cao.");
        }
      } else {
        setError(err.message || "Đã xảy ra lỗi không mong muốn.");
      }
    } finally {
      setIsGenerating(false);
      setProgress(0); // Reset progress after done (or keep it at 100 in view until reset)
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-black overflow-hidden">
      
      {/* Left Column: Controls */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 h-[40vh] lg:h-full z-20 shadow-xl shadow-black border-r border-neutral-800">
        <Controls
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          resolution={resolution}
          setResolution={setResolution}
          referenceImage={referenceImage}
          setReferenceImage={setReferenceImage}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      {/* Right Column: Output */}
      <div className="flex-1 h-[60vh] lg:h-full relative bg-[#050505]">
        <ResultView
          images={generatedImages}
          isLoading={isGenerating}
          progress={progress}
          error={error}
          onRetry={() => setError(null)}
        />
      </div>

    </div>
  );
};

export default App;