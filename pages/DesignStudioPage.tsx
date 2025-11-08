import React, { useState, useRef } from 'react';
import { Product, Page, DesignElement, ImageElement } from '../types';
import Button from '../components/Button';
import { UploadIcon, TrashIcon, SparklesIcon, LoaderIcon } from '../components/icons';
import { generateDesignIdea } from '../services/geminiService';

interface DesignStudioPageProps {
  product: Product;
  onNavigate: (page: Page) => void;
  onAddToCart: (designElements: DesignElement[]) => void;
}

interface DesignElementProps {
  element: ImageElement;
  onUpdate: (element: ImageElement) => void;
}

const DraggableResizableElement: React.FC<DesignElementProps> = ({ element, onUpdate }) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = element.x;
    const initialY = element.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onUpdate({ ...element, x: initialX + dx, y: initialY + dy });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        cursor: 'move',
        outline: '2px dashed #4f46e5',
        outlineOffset: '4px',
      }}
    >
      <img src={element.src} alt="user design" className="w-full h-full object-contain pointer-events-none select-none" draggable="false" />
    </div>
  );
};

const DesignStudioPage: React.FC<DesignStudioPageProps> = ({ product, onNavigate, onAddToCart }) => {
  const [imageElement, setImageElement] = useState<ImageElement | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const printableAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateElement = (updatedElement: ImageElement) => {
    setImageElement(updatedElement);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
            if (!printableAreaRef.current) return;
            const container = printableAreaRef.current;
            const areaWidth = container.offsetWidth;
            const areaHeight = container.offsetHeight;

            const imageAspectRatio = img.width / img.height;

            let scaledWidth, scaledHeight;
            const padding = 0.9; // Use 90% of area

            if ((areaWidth / areaHeight) > imageAspectRatio) {
                scaledHeight = areaHeight * padding;
                scaledWidth = scaledHeight * imageAspectRatio;
            } else {
                scaledWidth = areaWidth * padding;
                scaledHeight = scaledWidth / imageAspectRatio;
            }
            
            if (scaledWidth > areaWidth) {
                scaledWidth = areaWidth * padding;
                scaledHeight = scaledWidth / imageAspectRatio;
            }
            if (scaledHeight > areaHeight) {
                scaledHeight = areaHeight * padding;
                scaledWidth = scaledHeight * imageAspectRatio;
            }

            const x = (areaWidth - scaledWidth) / 2;
            const y = (areaHeight - scaledHeight) / 2;

            const newImage: ImageElement = {
              id: `img-${Date.now()}`, type: 'image', src: reader.result as string,
              x, y, width: scaledWidth, height: scaledHeight, rotation: 0
            };
            setImageElement(newImage);
        }
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset file input
    }
  };
  
  const deleteElement = () => {
    setImageElement(null);
  };

  const handleGenerateIdea = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedIdea(null);
    try {
      const idea = await generateDesignIdea(aiPrompt);
      setGeneratedIdea(idea);
    } catch (error) {
      console.error("Failed to generate idea:", error);
      setGeneratedIdea("Sorry, something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Upload & Preview: <span className="text-indigo-600">{product.name}</span></h1>
        <Button onClick={() => onAddToCart(imageElement ? [imageElement] : [])} disabled={!imageElement}>Proceed to Checkout</Button>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-64 bg-white p-4 border-r border-gray-200 space-y-6 overflow-y-auto">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Your Design</h3>
            <div className="space-y-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <UploadIcon className="h-5 w-5" /> Upload Your Design
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
               <p className="text-xs text-gray-500 text-center mt-2">Upload a JPG, PNG, or SVG file.</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-indigo-500" />
                AI Idea Generator
            </h3>
            <div className="space-y-3">
                <textarea
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-50"
                    placeholder="e.g., a corgi surfing on a pizza slice"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    disabled={isGenerating}
                    aria-label="AI Design Idea Prompt"
                />
                <Button 
                    fullWidth 
                    onClick={handleGenerateIdea} 
                    disabled={isGenerating || !aiPrompt.trim()}
                    variant="secondary"
                >
                    {isGenerating ? <LoaderIcon className="animate-spin h-5 w-5 mr-2" /> : <SparklesIcon className="h-5 w-5 mr-2" />}
                    {isGenerating ? 'Generating...' : 'Get Ideas'}
                </Button>

                {isGenerating && (
                    <div className="text-sm text-gray-500 text-center animate-pulse pt-2">Thinking of something cool...</div>
                )}
                
                {generatedIdea && !isGenerating && (
                    <div className="mt-2 p-3 bg-indigo-50 rounded-md border border-indigo-200">
                        <p className="text-sm text-gray-800 italic">"{generatedIdea}"</p>
                    </div>
                )}
            </div>
          </div>

        </aside>

        {/* Main Canvas */}
        <main className="flex-1 flex items-center justify-center p-8 bg-gray-200 overflow-auto">
            <div className="relative shadow-lg">
                <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-[70vh] object-contain select-none" draggable="false" />
                <div
                    ref={printableAreaRef}
                    className="absolute"
                    style={{
                        width: `${product.printableArea.width}%`,
                        height: `${product.printableArea.height}%`,
                        top: `${product.printableArea.top}%`,
                        left: `${product.printableArea.left}%`,
                    }}
                >
                    {imageElement ? (
                        <DraggableResizableElement
                            key={imageElement.id}
                            element={imageElement}
                            onUpdate={updateElement}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none border-2 border-dashed border-gray-400 rounded-md">
                            <div className="text-center p-4">
                                <UploadIcon className="h-10 w-10 mx-auto text-gray-500" />
                                <p className="mt-2 text-sm text-gray-600 font-medium">Upload your design</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>

        {/* Right Properties Panel */}
        <aside className="w-72 bg-white p-4 border-l border-gray-200 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">Properties</h3>
            {!imageElement && <p className="text-sm text-gray-500">Upload an image to see its properties.</p>}
            
            {imageElement && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dimensions (px)</label>
                        <div className="flex gap-2 mt-1">
                            <input type="number" value={Math.round(imageElement.width)} onChange={(e) => updateElement({...imageElement, width: parseInt(e.target.value, 10)})} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="W" />
                            <input type="number" value={Math.round(imageElement.height)} onChange={(e) => updateElement({...imageElement, height: parseInt(e.target.value, 10)})} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="H" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rotation (&deg;)</label>
                        <input type="range" min="0" max="360" value={imageElement.rotation} onChange={(e) => updateElement({...imageElement, rotation: parseInt(e.target.value, 10)})} className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                     <div className="mt-6 border-t pt-4">
                        <Button variant="danger" fullWidth onClick={deleteElement}>
                            <TrashIcon className="h-5 w-5 mr-2" /> Remove Image
                        </Button>
                    </div>
                </div>
            )}
        </aside>
      </div>
    </div>
  );
};

export default DesignStudioPage;