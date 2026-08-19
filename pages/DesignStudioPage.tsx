import React, { useState, useRef, useMemo } from 'react';
import { Product, Page, DesignElement, ImageElement, ShapeElement, ShapeType } from '../types';
import Button from '../components/Button';
import { UploadIcon, TrashIcon, SparklesIcon, LoaderIcon, CircleIcon, SquareIcon, LineIcon, PlusCircleIcon, AdjustmentsHorizontalIcon, XIcon } from '../components/icons';
import { generateDesignIdea } from '../services/geminiService';

interface DesignStudioPageProps {
  product: Product;
  onNavigate: (page: Page) => void;
  onAddToCart: (designElements: DesignElement[], previewImageUrl: string) => void;
}

interface DraggableElementProps {
  element: DesignElement;
  onUpdate: (element: DesignElement) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const DraggableResizableElement: React.FC<DraggableElementProps> = ({ element, onUpdate, onSelect, isSelected }) => {
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(element.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = element.x;
    const initialY = element.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onUpdate({ ...element, x: initialX + dx, y: initialY + dy });
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
  };
  
  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        cursor: 'move',
        outline: isSelected ? '2px dashed #4f46e5' : 'none',
        outlineOffset: '4px',
        touchAction: 'none',
      }}
    >
      {element.type === 'image' && (
        <img src={element.src} alt="user design" className="w-full h-full object-contain pointer-events-none select-none" draggable="false" />
      )}
      {element.type === 'shape' && (
         <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none select-none">
            {element.shapeType === 'circle' && <circle cx="50" cy="50" r="49" fill={element.fillColor} stroke={element.strokeColor} strokeWidth="2" />}
            {element.shapeType === 'square' && <rect x="1" y="1" width="98" height="98" fill={element.fillColor} stroke={element.strokeColor} strokeWidth="2" />}
            {element.shapeType === 'line' && <line x1="0" y1="50" x2="100" y2="50" stroke={element.strokeColor} strokeWidth="100" />}
         </svg>
      )}
    </div>
  );
};

const DesignStudioPage: React.FC<DesignStudioPageProps> = ({ product, onNavigate, onAddToCart }) => {
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'tools' | 'properties' | null>(null);

  const printableAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedElement = useMemo(() => {
    return designElements.find(el => el.id === selectedElementId);
  }, [designElements, selectedElementId]);

  const updateElement = (updatedElement: DesignElement) => {
    setDesignElements(prev => prev.map(el => el.id === updatedElement.id ? updatedElement : el));
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
            const padding = 0.9; // Use 90% of area
            let scaledWidth, scaledHeight;

            if ((areaWidth / areaHeight) > imageAspectRatio) {
                scaledHeight = areaHeight * padding;
                scaledWidth = scaledHeight * imageAspectRatio;
            } else {
                scaledWidth = areaWidth * padding;
                scaledHeight = scaledWidth / imageAspectRatio;
            }
            
            const x = (areaWidth - scaledWidth) / 2;
            const y = (areaHeight - scaledHeight) / 2;

            const newImage: ImageElement = {
              id: `img-${Date.now()}`, type: 'image', src: reader.result as string,
              x, y, width: scaledWidth, height: scaledHeight, rotation: 0
            };
            setDesignElements(prev => [...prev, newImage]);
            setSelectedElementId(newImage.id);
        }
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset file input
      closeMobilePanel();
    }
  };

  const handleAddShape = (shapeType: ShapeType) => {
    if (!printableAreaRef.current) return;
    const container = printableAreaRef.current;
    const areaWidth = container.offsetWidth;
    const areaHeight = container.offsetHeight;

    const size = Math.min(areaWidth, areaHeight) * 0.4; // 40% of smaller dimension
    const newShape: ShapeElement = {
        id: `${shapeType}-${Date.now()}`,
        type: 'shape',
        shapeType,
        x: (areaWidth - size) / 2,
        y: (areaHeight - (shapeType === 'line' ? 10 : size)) / 2,
        width: size,
        height: shapeType === 'line' ? 10 : size,
        rotation: 0,
        fillColor: '#6366f1',
        strokeColor: '#1f2937',
    };
    setDesignElements(prev => [...prev, newShape]);
    setSelectedElementId(newShape.id);
    closeMobilePanel();
  }
  
  const deleteElement = () => {
    if (!selectedElementId) return;
    setDesignElements(prev => prev.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
    closeMobilePanel();
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

  const generatePreview = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Could not get canvas context');

      const productImg = new Image();
      productImg.crossOrigin = 'anonymous'; // Required for images from other domains
      productImg.src = product.imageUrl;

      productImg.onload = async () => {
        canvas.width = productImg.naturalWidth;
        canvas.height = productImg.naturalHeight;
        ctx.drawImage(productImg, 0, 0);

        if (!printableAreaRef.current) return reject('Printable area ref not found');
        const onScreenAreaWidth = printableAreaRef.current.offsetWidth;
        const onScreenAreaHeight = printableAreaRef.current.offsetHeight;

        const pa = product.printableArea;
        const areaX = (pa.left / 100) * canvas.width;
        const areaY = (pa.top / 100) * canvas.height;
        const areaWidth = (pa.width / 100) * canvas.width;
        const areaHeight = (pa.height / 100) * canvas.height;
        
        const widthScale = areaWidth / onScreenAreaWidth;
        const heightScale = areaHeight / onScreenAreaHeight;
        
        const elementPromises = designElements.map(element => {
            return new Promise<void>(resolveElement => {
                if (element.type === 'image') {
                    const elImg = new Image();
                    elImg.src = element.src;
                    elImg.onload = () => {
                        ctx.save();
                        const centerX = areaX + (element.x + element.width / 2) * widthScale;
                        const centerY = areaY + (element.y + element.height / 2) * heightScale;
                        ctx.translate(centerX, centerY);
                        ctx.rotate((element.rotation * Math.PI) / 180);
                        const scaledWidth = element.width * widthScale;
                        const scaledHeight = element.height * heightScale;
                        ctx.drawImage(elImg, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
                        ctx.restore();
                        resolveElement();
                    };
                    elImg.onerror = () => { console.error("Failed to load design image for preview"); resolveElement(); }
                } else if (element.type === 'shape') {
                    ctx.save();
                    const centerX = areaX + (element.x + element.width / 2) * widthScale;
                    const centerY = areaY + (element.y + element.height / 2) * heightScale;
                    ctx.translate(centerX, centerY);
                    ctx.rotate((element.rotation * Math.PI) / 180);

                    const scaledWidth = element.width * widthScale;
                    const scaledHeight = element.height * heightScale;

                    ctx.fillStyle = element.fillColor;
                    ctx.strokeStyle = element.strokeColor;
                    ctx.lineWidth = 2 * Math.min(widthScale, heightScale);
                    
                    const drawX = -scaledWidth / 2;
                    const drawY = -scaledHeight / 2;
                    
                    if (element.shapeType === 'circle') {
                        ctx.beginPath();
                        ctx.ellipse(0, 0, scaledWidth / 2 - ctx.lineWidth / 2, scaledHeight / 2 - ctx.lineWidth / 2, 0, 0, 2 * Math.PI);
                        if (element.fillColor) ctx.fill();
                        if (element.strokeColor) ctx.stroke();
                    } else if (element.shapeType === 'square') {
                        if (element.fillColor) ctx.fillRect(drawX, drawY, scaledWidth, scaledHeight);
                        if (element.strokeColor) ctx.strokeRect(drawX, drawY, scaledWidth, scaledHeight);
                    } else if (element.shapeType === 'line') {
                        ctx.beginPath();
                        ctx.moveTo(drawX, 0);
                        ctx.lineTo(drawX + scaledWidth, 0);
                        ctx.lineWidth = scaledHeight;
                        if (element.strokeColor) ctx.stroke();
                    }
                    ctx.restore();
                    resolveElement();
                }
            });
        });
        
        await Promise.all(elementPromises);
        try {
          resolve(canvas.toDataURL('image/png'));
        } catch (e) {
          console.warn("Canvas export tainted or CORS limited, using product base image URL", e);
          resolve(product.imageUrl);
        }
      };
      
      productImg.onerror = () => {
        console.warn("Could not load background product image, using fallback");
        resolve(product.imageUrl);
      };
    });
  };

  const handleAddToCartClick = async () => {
    setIsSaving(true);
    try {
        const previewImageUrl = await generatePreview();
        onAddToCart(designElements, previewImageUrl);
    } catch (error) {
        console.warn("Generating preview fallback:", error);
        onAddToCart(designElements, product.imageUrl);
    } finally {
        setIsSaving(false);
    }
  };


  const closeMobilePanel = () => setMobilePanel(null);

  const ToolsPanelContent = () => (
    <>
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Your Design</h3>
        <div className="space-y-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <UploadIcon className="h-5 w-5" /> Upload Image
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Add Shapes</h3>
        <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleAddShape('circle')} className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-indigo-100 transition-colors text-sm font-medium text-gray-700">
                <CircleIcon className="h-6 w-6" /> Circle
            </button>
            <button onClick={() => handleAddShape('square')} className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-indigo-100 transition-colors text-sm font-medium text-gray-700">
                <SquareIcon className="h-6 w-6" /> Square
            </button>
            <button onClick={() => handleAddShape('line')} className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-indigo-100 transition-colors text-sm font-medium text-gray-700">
                <LineIcon className="h-6 w-6" /> Line
            </button>
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
    </>
  );

  const PropertiesPanelContent = () => (
     <>
        {!selectedElement && <p className="text-sm text-gray-500">Select an element to see its properties.</p>}
        {selectedElement && (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Dimensions (px)</label>
                    <div className="flex gap-2 mt-1">
                        <input type="number" value={Math.round(selectedElement.width)} onChange={(e) => updateElement({...selectedElement, width: parseInt(e.target.value, 10)})} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="W" />
                        <input type="number" value={Math.round(selectedElement.height)} onChange={(e) => updateElement({...selectedElement, height: parseInt(e.target.value, 10)})} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="H" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Rotation (&deg;)</label>
                    <input type="range" min="0" max="360" value={selectedElement.rotation} onChange={(e) => updateElement({...selectedElement, rotation: parseInt(e.target.value, 10)})} className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                {selectedElement.type === 'shape' && (
                    <div className="space-y-4 border-t pt-4 mt-4">
                         {selectedElement.shapeType !== 'line' && (
                            <div>
                                <label htmlFor="fillColor" className="block text-sm font-medium text-gray-700">Fill Color</label>
                                <input id="fillColor" type="color" value={selectedElement.fillColor} onChange={(e) => updateElement({...selectedElement, fillColor: e.target.value})} className="mt-1 w-full h-8 p-0 border-gray-300 rounded-md" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="strokeColor" className="block text-sm font-medium text-gray-700">Stroke / Line Color</label>
                            <input id="strokeColor" type="color" value={selectedElement.strokeColor} onChange={(e) => updateElement({...selectedElement, strokeColor: e.target.value})} className="mt-1 w-full h-8 p-0 border-gray-300 rounded-md" />
                        </div>
                    </div>
                )}

                 <div className="mt-6 border-t pt-4">
                    <Button variant="danger" fullWidth onClick={deleteElement}>
                        <TrashIcon className="h-5 w-5 mr-2" /> Remove Element
                    </Button>
                </div>
            </div>
        )}
    </>
  );

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden md:h-[calc(100vh-140px)]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center shadow-sm">
        <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">
          Design: <span className="text-indigo-600 font-semibold">{product.name}</span>
        </h1>
        <Button onClick={handleAddToCartClick} disabled={designElements.length === 0 || isSaving} size="sm" className="whitespace-nowrap">
          {isSaving ? <LoaderIcon className="animate-spin h-5 w-5 mr-2" /> : null}
          {isSaving ? 'Saving...' : <><span className="hidden sm:inline">Proceed to Checkout</span><span className="sm:hidden">Proceed</span></>}
        </Button>
      </div>

      <div className="flex flex-grow overflow-hidden relative md:flex-row flex-col">
        {/* Left Toolbar (Desktop) */}
        <aside className="hidden md:block w-64 bg-white p-4 border-r border-gray-200 space-y-6 overflow-y-auto">
          <ToolsPanelContent />
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-200 overflow-auto" onClick={() => setSelectedElementId(null)}>
            <div className="relative shadow-lg">
                <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain select-none" draggable="false" />
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
                    {designElements.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none border-2 border-dashed border-gray-400 rounded-md">
                            <div className="text-center p-4">
                                <UploadIcon className="h-10 w-10 mx-auto text-gray-500" />
                                <p className="mt-2 text-sm text-gray-600 font-medium">Upload an image or add a shape</p>
                            </div>
                        </div>
                    ) : designElements.map(element => (
                        <DraggableResizableElement
                            key={element.id}
                            element={element}
                            onUpdate={updateElement}
                            onSelect={setSelectedElementId}
                            isSelected={selectedElementId === element.id}
                        />
                    ))}
                </div>
            </div>
        </main>

        {/* Right Properties Panel (Desktop) */}
        <aside className="hidden md:block w-72 bg-white p-4 border-l border-gray-200 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">Properties</h3>
            <PropertiesPanelContent />
        </aside>

        {/* --- Mobile Panels (Overlay) --- */}
        <div 
            className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${mobilePanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={closeMobilePanel}
            aria-hidden="true"
        />

        {/* Tools Panel (Mobile) */}
        <div className={`md:hidden fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${mobilePanel === 'tools' ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold text-gray-800">Design Tools</h3>
                <button onClick={closeMobilePanel} className="p-1 text-gray-500 hover:text-gray-800"><XIcon className="h-6 w-6" /></button>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-65px)]">
                <ToolsPanelContent />
            </div>
        </div>
        
        {/* Properties Panel (Mobile) */}
        <div className={`md:hidden fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${mobilePanel === 'properties' ? 'translate-x-0' : 'translate-x-full'}`}>
             <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold text-gray-800">Properties</h3>
                <button onClick={closeMobilePanel} className="p-1 text-gray-500 hover:text-gray-800"><XIcon className="h-6 w-6" /></button>
            </div>
             <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
                <PropertiesPanelContent />
            </div>
        </div>
      </div>

      {/* --- Bottom Navigation (Mobile) --- */}
      <div className="md:hidden grid grid-cols-3 gap-2 bg-white border-t border-gray-200 p-2 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
        <button onClick={() => setMobilePanel('tools')} className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors">
            <PlusCircleIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Add</span>
        </button>
        <button onClick={() => setMobilePanel('properties')} disabled={!selectedElementId} className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors disabled:text-gray-400 disabled:bg-transparent disabled:hover:bg-transparent">
            <AdjustmentsHorizontalIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Edit</span>
        </button>
        <button onClick={deleteElement} disabled={!selectedElementId} className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-red-50 text-red-600 transition-colors disabled:text-gray-400 disabled:bg-transparent disabled:hover:bg-transparent">
            <TrashIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default DesignStudioPage;