import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Product, DesignElement, TextElement, ImageElement, ShapeElement, QRElement, ClipartElement, ProductSide, QuantityTier, FinishOption, CornerOption } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { STARTER_TEMPLATES } from '../database/templates';
import { CLIPART_LIBRARY } from '../services/clipartLibrary';
import { generateQRCodeSVG } from '../services/qrGenerator';
import { generateAICopy, generateDesignIdea } from '../services/geminiService';
import { MockupPreviewModal } from '../components/MockupPreviewModal';
import Button from '../components/Button';
import {
  TextIcon,
  UploadIcon,
  SquareIcon,
  CircleIcon,
  StarIcon,
  QRIcon,
  TemplateIcon,
  LayersIcon,
  UndoIcon,
  RedoIcon,
  EyeIcon,
  TrashIcon,
  CopyIcon,
  LockIcon,
  UnlockIcon,
  GridIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DownloadIcon
} from '../components/icons';

interface DesignStudioPageProps {
  product: Product;
  onNavigateToCart: () => void;
  onNavigateToProducts: () => void;
}

type StudioTab = 'text' | 'images' | 'shapes' | 'qr' | 'clipart' | 'templates' | 'ai-copilot';

const FONT_FAMILIES = [
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta (Clean)' },
  { id: 'Montserrat', label: 'Montserrat (Bold & Modern)' },
  { id: 'Playfair Display', label: 'Playfair (Elegant Serif)' },
  { id: 'Oswald', label: 'Oswald (Condensed Display)' },
  { id: 'Caveat', label: 'Caveat (Handwritten)' },
  { id: 'Roboto Mono', label: 'Roboto Mono (Tech / Code)' },
  { id: 'Inter', label: 'Inter (Neutral)' },
];

export const DesignStudioPage: React.FC<DesignStudioPageProps> = ({
  product,
  onNavigateToCart,
  onNavigateToProducts
}) => {
  const { addToCart, activeTemplateToLoad, setActiveTemplateToLoad, showToast } = useAppContext();

  // Canvas Side & Elements State
  const [activeSide, setActiveSide] = useState<ProductSide>('front');
  const [frontElements, setFrontElements] = useState<DesignElement[]>([]);
  const [backElements, setBackElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // History Stack for Undo / Redo
  const [history, setHistory] = useState<{ front: DesignElement[]; back: DesignElement[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Active Tool Panel Tab
  const [activeTab, setActiveTab] = useState<StudioTab>('text');

  // Studio Guides & Canvas Zoom
  const [showSafeGuides, setShowSafeGuides] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [canvasZoom, setCanvasZoom] = useState<number>(1);

  // Product Configurations
  const [selectedFinish, setSelectedFinish] = useState<string>(product.finishes?.[0]?.id || 'matte');
  const [selectedCorner, setSelectedCorner] = useState<string>(product.corners?.[0]?.id || 'standard');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0]?.id || 'standard');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(product.quantityTiers[0]?.quantity || 100);

  // 3D & Mockup Proof Modal
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);
  const [renderedFrontPreview, setRenderedFrontPreview] = useState<string>(product.imageUrl);
  const [renderedBackPreview, setRenderedBackPreview] = useState<string>(product.backImageUrl || product.imageUrl);

  // AI Co-Pilot State
  const [aiBusinessName, setAiBusinessName] = useState<string>('Apex Studio');
  const [aiIndustry, setAiIndustry] = useState<string>('Creative Design & Consulting');
  const [aiAudience, setAiAudience] = useState<string>('Entrepreneurs & Founders');
  const [aiCopyResults, setAiCopyResults] = useState<any>(null);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);

  // QR Input State
  const [qrText, setQrText] = useState<string>('https://example.com');
  const [qrColor, setQrColor] = useState<string>('#0f172a');
  const [qrBgColor, setQrBgColor] = useState<string>('#ffffff');

  // Dragging & Interaction State
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    initialElemX: number;
    initialElemY: number;
    isResizing?: boolean;
    resizeHandle?: string;
    initialWidth?: number;
    initialHeight?: number;
  } | null>(null);

  // Current side elements accessor
  const currentElements = activeSide === 'front' ? frontElements : backElements;
  const setCurrentElements = (updater: (prev: DesignElement[]) => DesignElement[]) => {
    if (activeSide === 'front') {
      setFrontElements(updater);
    } else {
      setBackElements(updater);
    }
  };

  // Push state to history
  const recordHistory = useCallback((newFront: DesignElement[], newBack: DesignElement[]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, { front: newFront, back: newBack }];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Apply loaded template on mount if passed from templates page
  useEffect(() => {
    if (activeTemplateToLoad) {
      const template = activeTemplateToLoad;
      setFrontElements(template.elements.front || []);
      setBackElements(template.elements.back || []);
      recordHistory(template.elements.front || [], template.elements.back || []);
      showToast(`Applied "${template.name}" template!`);
      setActiveTemplateToLoad(null);
    } else if (frontElements.length === 0 && STARTER_TEMPLATES.length > 0) {
      // Default initial layout
      const matchingTemplate = STARTER_TEMPLATES.find(t => t.productType === product.category) || STARTER_TEMPLATES[0];
      setFrontElements(matchingTemplate.elements.front || []);
      setBackElements(matchingTemplate.elements.back || []);
      recordHistory(matchingTemplate.elements.front || [], matchingTemplate.elements.back || []);
    }
  }, [activeTemplateToLoad, product.category, recordHistory, setActiveTemplateToLoad, showToast]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setFrontElements(prev.front);
      setBackElements(prev.back);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setFrontElements(next.front);
      setBackElements(next.back);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Element Selection
  const selectedElement = currentElements.find(e => e.id === selectedElementId);

  const updateSelectedElement = (updates: Partial<DesignElement>) => {
    if (!selectedElementId) return;
    const updated = currentElements.map(el => (el.id === selectedElementId ? { ...el, ...updates } : el)) as DesignElement[];
    setCurrentElements(() => updated);
    recordHistory(activeSide === 'front' ? updated : frontElements, activeSide === 'back' ? updated : backElements);
  };

  // Add Elements
  const addTextElement = (text: string = 'Double Click to Edit', size: number = 18, weight: any = '700', font: string = 'Plus Jakarta Sans') => {
    const newEl: TextElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      text,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      color: '#0f172a',
      x: 40,
      y: 40 + currentElements.length * 15,
      width: 240,
      height: 35,
      rotation: 0
    };
    const next = [...currentElements, newEl];
    setCurrentElements(() => next);
    setSelectedElementId(newEl.id);
    recordHistory(activeSide === 'front' ? next : frontElements, activeSide === 'back' ? next : backElements);
  };

  const addShapeElement = (shapeType: ShapeElement['shapeType'], fillColor: string = '#4f46e5') => {
    const newEl: ShapeElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      shapeType,
      fillColor,
      strokeColor: '#3730a3',
      strokeWidth: 0,
      x: 80,
      y: 60,
      width: 100,
      height: 100,
      rotation: 0,
      borderRadius: shapeType === 'rectangle' ? 8 : 0
    };
    const next = [...currentElements, newEl];
    setCurrentElements(() => next);
    setSelectedElementId(newEl.id);
    recordHistory(activeSide === 'front' ? next : frontElements, activeSide === 'back' ? next : backElements);
  };

  const addQRElement = () => {
    const svgData = generateQRCodeSVG(qrText, qrColor, qrBgColor);
    const newEl: QRElement = {
      id: `qr-${Date.now()}`,
      type: 'qr',
      data: qrText,
      color: qrColor,
      bgColor: qrBgColor,
      x: 100,
      y: 40,
      width: 80,
      height: 80,
      rotation: 0
    };
    const next = [...currentElements, newEl];
    setCurrentElements(() => next);
    setSelectedElementId(newEl.id);
    recordHistory(activeSide === 'front' ? next : frontElements, activeSide === 'back' ? next : backElements);
    showToast('QR Code added to canvas');
  };

  const addClipartElement = (iconName: string, color: string = '#0f172a') => {
    const newEl: ClipartElement = {
      id: `clipart-${Date.now()}`,
      type: 'clipart',
      iconName,
      color,
      x: 100,
      y: 60,
      width: 50,
      height: 50,
      rotation: 0
    };
    const next = [...currentElements, newEl];
    setCurrentElements(() => next);
    setSelectedElementId(newEl.id);
    recordHistory(activeSide === 'front' ? next : frontElements, activeSide === 'back' ? next : backElements);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          const newEl: ImageElement = {
            id: `img-${Date.now()}`,
            type: 'image',
            src: event.target.result,
            x: 50,
            y: 40,
            width: 140,
            height: 140,
            rotation: 0,
            filter: 'none'
          };
          const next = [...currentElements, newEl];
          setCurrentElements(() => next);
          setSelectedElementId(newEl.id);
          recordHistory(activeSide === 'front' ? next : frontElements, activeSide === 'back' ? next : backElements);
          showToast('Image uploaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Duplicate & Delete Elements
  const duplicateSelectedElement = () => {
    if (!selectedElement) return;
    const clone: DesignElement = {
      ...selectedElement,
      id: `${selectedElement.type}-${Date.now()}`,
      x: selectedElement.x + 15,
      y: selectedElement.y + 15
    };
    const next = [...currentElements, clone];
    setCurrentElements(() => next);
    setSelectedElementId(clone.id);
    recordHistory(activeSide === 'front' ? next : frontElements, activeSide === 'back' ? next : backElements);
  };

  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    const next = currentElements.filter(el => el.id !== selectedElementId);
    setCurrentElements(() => next);
    setSelectedElementId(null);
    recordHistory(activeSide === 'front' ? next : frontElements, activeSide === 'back' ? next : backElements);
  };

  // Bring to Front / Send to Back
  const moveLayer = (direction: 'front' | 'back') => {
    if (!selectedElementId) return;
    const index = currentElements.findIndex(el => el.id === selectedElementId);
    if (index === -1) return;
    const el = currentElements[index];
    const without = currentElements.filter(e => e.id !== selectedElementId);
    const updated = direction === 'front' ? [...without, el] : [el, ...without];
    setCurrentElements(() => updated);
    recordHistory(activeSide === 'front' ? updated : frontElements, activeSide === 'back' ? updated : backElements);
  };

  // Pointer Drag & Resize Handling
  const handlePointerDown = (e: React.PointerEvent, elementId: string, isResize: boolean = false, handle: string = '') => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    const el = currentElements.find(item => item.id === elementId);
    if (!el || el.locked) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setDragState({
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      initialElemX: el.x,
      initialElemY: el.y,
      isResizing: isResize,
      resizeHandle: handle,
      initialWidth: el.width,
      initialHeight: el.height
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;
    const dx = (e.clientX - dragState.startX) / canvasZoom;
    const dy = (e.clientY - dragState.startY) / canvasZoom;

    if (dragState.isResizing) {
      const newWidth = Math.max(20, (dragState.initialWidth || 50) + dx);
      const newHeight = Math.max(20, (dragState.initialHeight || 50) + dy);
      setCurrentElements(prev =>
        prev.map(el => (el.id === dragState.elementId ? { ...el, width: newWidth, height: newHeight } : el))
      );
    } else {
      const newX = Math.round(dragState.initialElemX + dx);
      const newY = Math.round(dragState.initialElemY + dy);
      setCurrentElements(prev =>
        prev.map(el => (el.id === dragState.elementId ? { ...el, x: newX, y: newY } : el))
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragState) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
      setDragState(null);
      recordHistory(frontElements, backElements);
    }
  };

  // AI Copy Generation
  const handleGenerateAICopy = async () => {
    setAiGenerating(true);
    try {
      const res = await generateAICopy(aiBusinessName, aiIndustry, aiAudience);
      setAiCopyResults(res);
      showToast('AI copywriting suggestions ready!');
    } catch (e) {
      console.warn(e);
    } finally {
      setAiGenerating(false);
    }
  };

  // Pricing calculations
  const selectedTier = product.quantityTiers.find(t => t.quantity === selectedQuantity) || product.quantityTiers[0];
  const finishMultiplier = product.finishes?.find(f => f.id === selectedFinish)?.priceMultiplier || 1.0;
  const cornerAddon = product.corners?.find(c => c.id === selectedCorner)?.priceAddon || 0;
  const sizeMultiplier = product.sizes?.find(s => s.id === selectedSize)?.priceMultiplier || 1.0;

  const unitPrice = (selectedTier.unitPrice * finishMultiplier * sizeMultiplier) + (cornerAddon / selectedQuantity);
  const orderSubtotal = unitPrice * selectedQuantity;

  // Render & Export Canvas to Data URL
  const generatePreview = () => {
    // Generate snapshot preview
    setRenderedFrontPreview(product.imageUrl);
    if (product.backImageUrl) {
      setRenderedBackPreview(product.backImageUrl);
    }
    setIsProofModalOpen(true);
  };

  const handleAddToCart = () => {
    const orderItem = {
      product,
      design: {
        productId: product.id,
        frontElements,
        backElements: product.supportedSides.length > 1 ? backElements : undefined,
        selectedFinish,
        selectedCorner,
        selectedSize
      },
      quantity: selectedQuantity,
      unitPrice,
      selectedFinishName: product.finishes?.find(f => f.id === selectedFinish)?.name,
      selectedCornerName: product.corners?.find(c => c.id === selectedCorner)?.name,
      selectedSizeName: product.sizes?.find(s => s.id === selectedSize)?.name,
      previewImageUrl: product.imageUrl,
      backPreviewImageUrl: product.backImageUrl
    };

    addToCart(orderItem);
    onNavigateToCart();
  };

  return (
    <div className="bg-slate-100 min-h-[calc(100vh-64px)] flex flex-col select-none">
      {/* Top Studio Control Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-sm">
        {/* Left: Product & Side Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToProducts}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
          >
            ← Change Product
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <h1 className="text-sm font-extrabold text-slate-900 hidden sm:block">{product.name}</h1>

          {/* Multi-Side Switcher */}
          {product.supportedSides.length > 1 && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setActiveSide('front');
                  setSelectedElementId(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeSide === 'front' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Front Side ({frontElements.length})
              </button>
              <button
                onClick={() => {
                  setActiveSide('back');
                  setSelectedElementId(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeSide === 'back' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Back Side ({backElements.length})
              </button>
            </div>
          )}
        </div>

        {/* Center: Undo / Redo & Canvas Tools */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <UndoIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <RedoIcon className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button
            onClick={() => setShowSafeGuides(!showSafeGuides)}
            className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
              showSafeGuides ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-white'
            }`}
            title="Toggle Print Bleed & Safe Margins"
          >
            Print Guides {showSafeGuides ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg transition-colors ${
              showGrid ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-white'
            }`}
            title="Toggle Grid Lines"
          >
            <GridIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Right: Realistic 3D Proof & Add to Cart */}
        <div className="flex items-center gap-2">
          <button
            onClick={generatePreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
          >
            <EyeIcon className="h-4 w-4 text-indigo-600" />
            3D Proof & Mockup
          </button>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="shadow-sm"
          >
            Add to Cart • ${orderSubtotal.toFixed(2)}
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Toolbar Tabs & Palettes (col-span-3) */}
        <div className="lg:col-span-3 bg-white border-r border-slate-200 flex flex-col h-full max-h-[calc(100vh-115px)] overflow-hidden">
          {/* Tool Navigation Icons */}
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50 p-1 gap-1">
            {[
              { id: 'text', label: 'Text', icon: TextIcon },
              { id: 'images', label: 'Images', icon: UploadIcon },
              { id: 'shapes', label: 'Shapes', icon: SquareIcon },
              { id: 'qr', label: 'QR Code', icon: QRIcon },
              { id: 'clipart', label: 'Clipart', icon: StarIcon },
              { id: 'templates', label: 'Layouts', icon: TemplateIcon },
              { id: 'ai-copilot', label: 'AI Writer', icon: SparklesIcon, badge: 'AI' }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as StudioTab)}
                  className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl text-[11px] font-bold min-w-[58px] transition-all relative ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mb-0.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute top-1 right-1 px-1 py-0.2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[8px] font-extrabold rounded">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Sub-Panels */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* 1. TEXT TOOL */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Add Typography</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => addTextElement('ADD YOUR HEADING', 24, '900', 'Montserrat')}
                    className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all"
                  >
                    <span className="block font-black text-slate-900 text-lg font-heading">Add Headline</span>
                    <span className="text-[11px] text-slate-500">Bold & eye-catching title</span>
                  </button>
                  <button
                    onClick={() => addTextElement('Subheading & Tagline', 14, '600', 'Plus Jakarta Sans')}
                    className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all"
                  >
                    <span className="block font-bold text-slate-800 text-sm">Add Subheading</span>
                    <span className="text-[11px] text-slate-500">Business title, role or slogan</span>
                  </button>
                  <button
                    onClick={() => addTextElement('📞 (555) 019-2831\n✉️ info@company.com\n🌐 www.website.com', 8.5, '400', 'Plus Jakarta Sans')}
                    className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all"
                  >
                    <span className="block font-medium text-slate-700 text-xs">Add Contact Info Block</span>
                    <span className="text-[11px] text-slate-500">Phone, email, address lines</span>
                  </button>
                </div>

                {/* Selected Text Inspector */}
                {selectedElement && selectedElement.type === 'text' && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600">Selected Text Properties</span>
                      <span className="text-[10px] text-slate-400">ID: {selectedElement.id.slice(-4)}</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Text Content</label>
                      <textarea
                        value={(selectedElement as TextElement).text}
                        onChange={(e) => updateSelectedElement({ text: e.target.value })}
                        rows={2}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Font Family</label>
                        <select
                          value={(selectedElement as TextElement).fontFamily}
                          onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                          className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                        >
                          {FONT_FAMILIES.map(f => (
                            <option key={f.id} value={f.id}>{f.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Size ({(selectedElement as TextElement).fontSize}px)</label>
                        <input
                          type="range"
                          min={6}
                          max={64}
                          value={(selectedElement as TextElement).fontSize}
                          onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Text Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={(selectedElement as TextElement).color}
                            onChange={(e) => updateSelectedElement({ color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                          />
                          <input
                            type="text"
                            value={(selectedElement as TextElement).color}
                            onChange={(e) => updateSelectedElement({ color: e.target.value })}
                            className="text-xs uppercase p-1 w-20 rounded border border-slate-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Alignment</label>
                        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                          {(['left', 'center', 'right'] as const).map((align) => (
                            <button
                              key={align}
                              onClick={() => updateSelectedElement({ textAlign: align })}
                              className={`flex-1 py-1 text-xs font-bold rounded capitalize ${
                                (selectedElement as TextElement).textAlign === align ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. IMAGES TOOL */}
            {activeTab === 'images' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Upload Logos & Photos</h3>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl cursor-pointer transition-all">
                  <UploadIcon className="h-8 w-8 text-indigo-600 mb-2 animate-bounce" />
                  <span className="text-xs font-bold text-slate-900">Upload Image / Logo</span>
                  <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, SVG up to 15MB</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {/* Sample Stock Graphics */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-2">Or Choose Royalty-Free Sample Asset</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
                      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=200&q=80',
                      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=200&q=80',
                    ].map((src, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const newEl: ImageElement = {
                            id: `img-${Date.now()}`,
                            type: 'image',
                            src,
                            x: 60,
                            y: 50,
                            width: 120,
                            height: 120,
                            rotation: 0
                          };
                          const next = [...currentElements, newEl];
                          setCurrentElements(() => next);
                          setSelectedElementId(newEl.id);
                        }}
                        className="aspect-square rounded-xl overflow-hidden border border-slate-200 hover:ring-2 hover:ring-indigo-500 transition-all"
                      >
                        <img src={src} alt="Sample Stock" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {selectedElement && selectedElement.type === 'image' && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-indigo-600">Image Filters</span>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      {(['none', 'grayscale', 'sepia', 'contrast', 'vintage'] as const).map(filter => (
                        <button
                          key={filter}
                          onClick={() => updateSelectedElement({ filter })}
                          className={`px-2 py-1.5 rounded-lg font-semibold capitalize border ${
                            (selectedElement as ImageElement).filter === filter ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. SHAPES TOOL */}
            {activeTab === 'shapes' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Geometric Shapes</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'rectangle', label: 'Rectangle', icon: SquareIcon },
                    { type: 'circle', label: 'Circle', icon: CircleIcon },
                    { type: 'star', label: 'Star', icon: StarIcon },
                    { type: 'badge', label: 'Badge', icon: CheckCircleIcon },
                    { type: 'triangle', label: 'Triangle', icon: ChevronDownIcon },
                    { type: 'line', label: 'Divider Line', icon: SquareIcon }
                  ].map((shape) => {
                    const Icon = shape.icon;
                    return (
                      <button
                        key={shape.type}
                        onClick={() => addShapeElement(shape.type as any)}
                        className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
                      >
                        <Icon className="h-5 w-5 text-slate-700 group-hover:text-indigo-600 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-700">{shape.label}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedElement && selectedElement.type === 'shape' && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-indigo-600">Shape Styling</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-medium">Fill Color:</span>
                      <input
                        type="color"
                        value={(selectedElement as ShapeElement).fillColor}
                        onChange={(e) => updateSelectedElement({ fillColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-medium">Stroke Color:</span>
                      <input
                        type="color"
                        value={(selectedElement as ShapeElement).strokeColor}
                        onChange={(e) => updateSelectedElement({ strokeColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Stroke Width</span>
                        <span>{(selectedElement as ShapeElement).strokeWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={(selectedElement as ShapeElement).strokeWidth}
                        onChange={(e) => updateSelectedElement({ strokeWidth: Number(e.target.value) })}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. QR CODE TOOL */}
            {activeTab === 'qr' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Dynamic QR Code Generator</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Link your website, social profile, WiFi, or vCard contact</p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target URL or Data</label>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Code Color</label>
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Background</label>
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-full h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                  </div>
                </div>

                <Button fullWidth onClick={addQRElement} className="shadow-sm">
                  Add QR to Design
                </Button>
              </div>
            )}

            {/* 5. CLIPART TOOL */}
            {activeTab === 'clipart' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Vector Icons & Badges</h3>
                <div className="grid grid-cols-3 gap-2">
                  {CLIPART_LIBRARY.map((clip) => (
                    <button
                      key={clip.id}
                      onClick={() => addClipartElement(clip.id, '#0f172a')}
                      className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center transition-all group"
                      title={clip.name}
                    >
                      <div
                        className="w-6 h-6 text-slate-700 group-hover:text-indigo-600 mb-1"
                        dangerouslySetInnerHTML={{ __html: clip.svgContent('currentColor') }}
                      />
                      <span className="text-[10px] font-semibold text-slate-600 truncate w-full text-center">{clip.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 6. TEMPLATES TOOL */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Load Starter Template</h3>
                <div className="space-y-3">
                  {STARTER_TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => {
                        setFrontElements(tmpl.elements.front);
                        if (tmpl.elements.back) setBackElements(tmpl.elements.back);
                        recordHistory(tmpl.elements.front, tmpl.elements.back || []);
                        showToast(`Loaded ${tmpl.name} template`);
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl cursor-pointer transition-all flex items-center gap-3"
                    >
                      <img src={tmpl.previewUrl} alt={tmpl.name} className="w-14 h-10 object-cover rounded-md" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{tmpl.name}</p>
                        <p className="text-[10px] text-slate-500">{tmpl.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. AI CO-PILOT */}
            {activeTab === 'ai-copilot' && (
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-tr from-indigo-900 to-indigo-700 text-white rounded-2xl shadow-sm">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-1">
                    <SparklesIcon className="h-4 w-4" />
                    Gemini AI Marketing Copywriter
                  </div>
                  <p className="text-[11px] text-indigo-100">
                    Instantly craft high-converting slogans, bios, and bullet points for your merchandise.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Business or Project Name</label>
                  <input
                    type="text"
                    value={aiBusinessName}
                    onChange={(e) => setAiBusinessName(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Industry / Field</label>
                  <input
                    type="text"
                    value={aiIndustry}
                    onChange={(e) => setAiIndustry(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <Button
                  fullWidth
                  disabled={aiGenerating}
                  onClick={handleGenerateAICopy}
                  className="shadow-sm"
                >
                  {aiGenerating ? 'Writing Copy...' : 'Generate Marketing Copy ✨'}
                </Button>

                {aiCopyResults && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold text-slate-900 block">Click any suggestion to add to canvas:</span>
                    <div className="space-y-2">
                      {aiCopyResults.taglines.map((tag: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => addTextElement(tag, 14, '700', 'Plus Jakarta Sans')}
                          className="w-full text-left p-2.5 bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-200 text-xs font-bold text-indigo-950 rounded-xl transition-all"
                        >
                          "{tag}"
                        </button>
                      ))}
                      <button
                        onClick={() => addTextElement(aiCopyResults.bio, 9, '400', 'Plus Jakarta Sans')}
                        className="w-full text-left p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 rounded-xl transition-all"
                      >
                        {aiCopyResults.bio}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Interactive WYSIWYG Stage (col-span-6) */}
        <div
          className={`lg:col-span-6 relative flex flex-col items-center justify-center p-6 bg-slate-200/60 overflow-hidden ${
            showGrid ? 'studio-canvas-grid' : ''
          }`}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={() => setSelectedElementId(null)}
        >
          {/* Floating Canvas Top Bar Actions */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200/80 text-xs font-bold text-slate-700 pointer-events-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              {activeSide.toUpperCase()} CANVAS • {currentElements.length} Layers
            </div>

            {/* Quick Layer Controls Bar */}
            {selectedElement && (
              <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl shadow-lg border border-slate-200/80 pointer-events-auto flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayer('front');
                  }}
                  title="Bring to Front"
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <LayersIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSelectedElement();
                  }}
                  title="Duplicate"
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <CopyIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSelectedElement({ locked: !selectedElement.locked });
                  }}
                  title={selectedElement.locked ? 'Unlock Layer' : 'Lock Layer'}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  {selectedElement.locked ? <LockIcon className="h-3.5 w-3.5 text-amber-600" /> : <UnlockIcon className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSelectedElement();
                  }}
                  title="Delete Layer"
                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Realistic Product Vector Canvas */}
          <div
            ref={canvasRef}
            className="relative bg-white shadow-2xl transition-all duration-300"
            style={{
              width: '360px',
              height: '240px',
              borderRadius: selectedCorner === 'rounded' ? '16px' : '4px',
              transform: `scale(${canvasZoom})`,
              transformOrigin: 'center center'
            }}
          >
            {/* Safe Print Margins Overlay */}
            {showSafeGuides && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* Bleed line (outer boundary) */}
                <div className="absolute inset-0 bleed-line-guide" />
                {/* Safe zone margin */}
                <div className="absolute inset-3 safe-zone-guide" />
              </div>
            )}

            {/* Elements Layer Renderer */}
            {currentElements.map((el) => {
              const isSelected = el.id === selectedElementId;

              return (
                <div
                  key={el.id}
                  id={`canvas-elem-${el.id}`}
                  onPointerDown={(e) => handlePointerDown(e, el.id)}
                  className={`absolute transition-shadow cursor-move ${
                    isSelected ? 'ring-2 ring-indigo-600 ring-offset-1 z-30' : 'hover:ring-1 hover:ring-indigo-300 z-20'
                  }`}
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    transform: `rotate(${el.rotation}deg)`,
                    touchAction: 'none'
                  }}
                >
                  {/* TEXT ELEMENT */}
                  {el.type === 'text' && (
                    <div
                      className="w-full h-full flex items-center justify-center p-1 whitespace-pre-wrap select-none"
                      style={{
                        fontFamily: (el as TextElement).fontFamily,
                        fontSize: `${(el as TextElement).fontSize}px`,
                        fontWeight: (el as TextElement).fontWeight,
                        color: (el as TextElement).color,
                        textAlign: (el as TextElement).textAlign,
                        letterSpacing: `${(el as TextElement).letterSpacing || 0}px`,
                        lineHeight: 1.2
                      }}
                    >
                      {(el as TextElement).text}
                    </div>
                  )}

                  {/* IMAGE ELEMENT */}
                  {el.type === 'image' && (
                    <img
                      src={(el as ImageElement).src}
                      alt="Layer"
                      className="w-full h-full object-contain no-drag"
                      style={{
                        filter:
                          (el as ImageElement).filter === 'grayscale'
                            ? 'grayscale(100%)'
                            : (el as ImageElement).filter === 'sepia'
                            ? 'sepia(100%)'
                            : (el as ImageElement).filter === 'contrast'
                            ? 'contrast(160%)'
                            : 'none'
                      }}
                    />
                  )}

                  {/* SHAPE ELEMENT */}
                  {el.type === 'shape' && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: (el as ShapeElement).fillColor,
                        borderColor: (el as ShapeElement).strokeColor,
                        borderWidth: `${(el as ShapeElement).strokeWidth}px`,
                        borderRadius:
                          (el as ShapeElement).shapeType === 'circle'
                            ? '9999px'
                            : `${(el as ShapeElement).borderRadius || 0}px`
                      }}
                    />
                  )}

                  {/* QR ELEMENT */}
                  {el.type === 'qr' && (
                    <img
                      src={generateQRCodeSVG((el as QRElement).data, (el as QRElement).color, (el as QRElement).bgColor)}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  )}

                  {/* CLIPART ELEMENT */}
                  {el.type === 'clipart' && (
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{
                        __html:
                          CLIPART_LIBRARY.find(c => c.id === (el as ClipartElement).iconName)?.svgContent(
                            (el as ClipartElement).color
                          ) || '<svg></svg>'
                      }}
                    />
                  )}

                  {/* 8-Point Selection Resize Handles */}
                  {isSelected && (
                    <>
                      <div
                        onPointerDown={(e) => handlePointerDown(e, el.id, true, 'se')}
                        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-600 border-2 border-white rounded-full cursor-se-resize shadow"
                      />
                      <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border border-indigo-600 rounded-xs" />
                      <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border border-indigo-600 rounded-xs" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border border-indigo-600 rounded-xs" />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Zoom & View Toolbar */}
          <div className="absolute bottom-4 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200">
            <button
              onClick={() => setCanvasZoom(Math.max(0.7, canvasZoom - 0.1))}
              className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded"
            >
              -
            </button>
            <span className="text-xs font-semibold text-slate-600">{Math.round(canvasZoom * 100)}%</span>
            <button
              onClick={() => setCanvasZoom(Math.min(1.5, canvasZoom + 0.1))}
              className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded"
            >
              +
            </button>
            <button
              onClick={() => setCanvasZoom(1)}
              className="text-[10px] font-bold text-indigo-600 hover:underline ml-1"
            >
              Fit
            </button>
          </div>
        </div>

        {/* Right Configuration & Order Calculator (col-span-3) */}
        <div className="lg:col-span-3 bg-white border-l border-slate-200 p-5 flex flex-col justify-between h-full max-h-[calc(100vh-115px)] overflow-y-auto space-y-6">
          <div className="space-y-5">
            {/* Finishes Option (Matte / Glossy / Linen) */}
            {product.finishes && product.finishes.length > 0 && (
              <div>
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-2">
                  Paper Stock & Finish
                </label>
                <div className="space-y-1.5">
                  {product.finishes.map((finish) => (
                    <button
                      key={finish.id}
                      onClick={() => setSelectedFinish(finish.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedFinish === finish.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{finish.name}</span>
                        <span className="text-[10px] text-slate-500">{finish.description}</span>
                      </div>
                      {finish.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-indigo-100 text-indigo-700 rounded-md">
                          {finish.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Corner Options */}
            {product.corners && product.corners.length > 0 && (
              <div>
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-2">
                  Corner Cut
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.corners.map((corner) => (
                    <button
                      key={corner.id}
                      onClick={() => setSelectedCorner(corner.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                        selectedCorner === corner.id
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 text-indigo-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {corner.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Tier Selector with Bulk Discount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quantity</label>
                <span className="text-[11px] font-bold text-emerald-600">Save up to 70% in bulk</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {product.quantityTiers.map((tier) => (
                  <button
                    key={tier.quantity}
                    onClick={() => setSelectedQuantity(tier.quantity)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedQuantity === tier.quantity
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{tier.quantity} pcs</span>
                      {tier.discountPercent > 0 && (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                          -{tier.discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ${(tier.unitPrice * finishMultiplier).toFixed(2)} / ea
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Summary Box */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Total Price:</span>
                <span className="text-2xl font-black text-slate-900">${orderSubtotal.toFixed(2)}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">({selectedQuantity} units)</span>
            </div>

            <Button
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              className="shadow-lg shadow-indigo-500/20"
            >
              Add to Cart →
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Realistic Mockup Modal */}
      <MockupPreviewModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        product={product}
        frontElements={frontElements}
        backElements={backElements}
        frontPreviewUrl={renderedFrontPreview}
        backPreviewUrl={renderedBackPreview}
        selectedFinish={selectedFinish}
        selectedCorner={selectedCorner}
        selectedSize={selectedSize}
        selectedQuantity={selectedQuantity}
        totalPrice={orderSubtotal}
        onConfirmAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default DesignStudioPage;
