import React, { useState, useCallback, useRef } from 'react';
import { generateCompositeImage, removeImageBackground, fileToDataUrl, dataURLtoFile } from '../services/geminiService';
import { Product } from '../types';
import ImageUploader from './ImageUploader';
import ObjectCard from './ObjectCard';
import Spinner from './Spinner';
import DebugModal from './DebugModal';
import AddProductModal from './AddProductModal';
import TouchGhost from './TouchGhost';
import { Sparkles, Layers, RefreshCw, Scissors, Eye, Check } from 'lucide-react';

const transparentDragImage = new Image();
transparentDragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Lámpara Moderna de Escritorio', imageUrl: '/assets/object.jpeg' },
];

export const ImmersiveCanvasView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(INITIAL_PRODUCTS[0]);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [sceneImage, setSceneImage] = useState<File | null>(null);
  const [sceneImageUrl, setSceneImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [persistedOrbPosition, setPersistedOrbPosition] = useState<{ x: number; y: number } | null>(null);
  const [debugImageUrl, setDebugImageUrl] = useState<string | null>(null);
  const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Touch drag state
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const [touchGhostPosition, setTouchGhostPosition] = useState<{ x: number; y: number } | null>(null);
  const [isHoveringDropZone, setIsHoveringDropZone] = useState(false);
  const [touchOrbPosition, setTouchOrbPosition] = useState<{ x: number; y: number } | null>(null);
  const sceneImgRef = useRef<HTMLImageElement>(null);

  // Initialize demo scene
  const handleInstantDemo = async () => {
    setError(null);
    try {
      const [objRes, sceneRes] = await Promise.all([
        fetch('/assets/object.jpeg'),
        fetch('/assets/scene.jpeg'),
      ]);

      if (!objRes.ok || !sceneRes.ok) throw new Error('No se pudieron cargar los recursos de demostración.');

      const [objBlob, sceneBlob] = await Promise.all([objRes.blob(), sceneRes.blob()]);
      const objFile = new File([objBlob], 'object.jpeg', { type: 'image/jpeg' });
      const scFile = new File([sceneBlob], 'scene.jpeg', { type: 'image/jpeg' });

      setProductImageFile(objFile);
      setSceneImage(scFile);
      setSceneImageUrl('/assets/scene.jpeg');
      setSelectedProduct({
        id: Date.now(),
        name: 'Lámpara Moderna de Escritorio',
        imageUrl: '/assets/object.jpeg',
      });
    } catch (err: any) {
      setError(err?.message || 'Error cargando la demo.');
    }
  };

  const handleCustomSceneUpload = (file: File) => {
    setSceneImage(file);
    setSceneImageUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleCustomProductUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const newProd: Product = { id: Date.now(), name: file.name, imageUrl: url };
    setProducts((prev) => [newProd, ...prev]);
    setSelectedProduct(newProd);
    setProductImageFile(file);
    setIsAddProductModalOpen(false);
    setError(null);
  };

  const handleProductDrop = useCallback(
    async (position: { x: number; y: number }, relativePosition: { xPercent: number; yPercent: number }) => {
      if (!sceneImage || !selectedProduct) {
        setError('Selecciona o sube primero un producto y una escena.');
        return;
      }

      setPersistedOrbPosition(position);
      setIsLoading(true);
      setError(null);

      try {
        // Fetch product file if not in state
        let pFile = productImageFile;
        if (!pFile) {
          const res = await fetch(selectedProduct.imageUrl);
          const blob = await res.blob();
          pFile = new File([blob], selectedProduct.name, { type: blob.type });
          setProductImageFile(pFile);
        }

        const result = await generateCompositeImage(
          pFile,
          selectedProduct.name,
          sceneImage,
          sceneImage.name,
          relativePosition
        );

        setDebugImageUrl(result.debugImageUrl);
        setDebugPrompt(result.finalPrompt);
        setSceneImageUrl(result.finalImageUrl);

        const newSceneFile = dataURLtoFile(result.finalImageUrl, `composite-${Date.now()}.jpeg`);
        setSceneImage(newSceneFile);
      } catch (err: any) {
        console.error(err);
        setError(`Fallo al generar la composición: ${err?.message}`);
      } finally {
        setIsLoading(false);
        setPersistedOrbPosition(null);
      }
    },
    [sceneImage, selectedProduct, productImageFile]
  );

  const handleRemoveBackground = async () => {
    if (!productImageFile && !selectedProduct) return;
    setIsRemovingBg(true);
    setError(null);

    try {
      let pFile = productImageFile;
      if (!pFile && selectedProduct) {
        const res = await fetch(selectedProduct.imageUrl);
        const blob = await res.blob();
        pFile = new File([blob], selectedProduct.name, { type: blob.type });
      }

      if (!pFile) throw new Error('No hay imagen de producto seleccionada.');

      const newPng = await removeImageBackground(pFile);
      const newUrl = URL.createObjectURL(newPng);
      const updatedProduct: Product = {
        id: Date.now(),
        name: `${selectedProduct?.name || 'product'}-isolated`,
        imageUrl: newUrl,
      };

      setProducts((prev) => [updatedProduct, ...prev]);
      setSelectedProduct(updatedProduct);
      setProductImageFile(newPng);
    } catch (err: any) {
      console.error(err);
      setError(`No se pudo remover el fondo: ${err?.message}`);
    } finally {
      setIsRemovingBg(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Home Canvas Studio · Composición de Producto con IA
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Arrastra tu producto y suéltalo en cualquier superficie de la habitación. Gemini renderizará la integración con perspectiva, sombras y luz coherente.
          </p>
        </div>

        <button
          onClick={handleInstantDemo}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/30 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Cargar Escena y Producto Demo
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-fade-in">
          <span>❌ {error}</span>
        </div>
      )}

      {/* Main Canvas Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product Selection & Tools */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200">1. Seleccionar Producto</h3>
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                + Subir Otro
              </button>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide py-1">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setProductImageFile(null);
                  }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', prod.name);
                    e.dataTransfer.setDragImage(transparentDragImage, 0, 0);
                  }}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                    selectedProduct?.id === prod.id
                      ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-900/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full aspect-square bg-slate-900 rounded-xl overflow-hidden mb-2 flex items-center justify-center p-2">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 truncate w-full">{prod.name}</span>
                </div>
              ))}
            </div>

            {/* Actions for Selected Product */}
            {selectedProduct && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button
                  onClick={handleRemoveBackground}
                  disabled={isRemovingBg}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all border border-slate-700"
                >
                  {isRemovingBg ? (
                    <>
                      <Spinner className="w-3.5 h-3.5" />
                      Removiendo Fondo con IA...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-3.5 h-3.5 text-purple-400" />
                      Aislar Objeto (Quitar Fondo)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scene Viewer & Drop Target */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200">
                2. Escena / Entorno (Haz clic o arrastra para colocar)
              </h3>
              {debugImageUrl && (
                <button
                  onClick={() => setIsDebugModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  Ver Depuración
                </button>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[380px] flex items-center justify-center">
              <ImageUploader
                id="scene-canvas-uploader"
                ref={sceneImgRef}
                imageUrl={sceneImageUrl}
                onFileSelect={handleCustomSceneUpload}
                isDropZone={Boolean(sceneImageUrl && selectedProduct)}
                onProductDrop={handleProductDrop}
                persistedOrbPosition={persistedOrbPosition}
                isTouchHovering={isHoveringDropZone}
                touchOrbPosition={touchOrbPosition}
              />

              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Spinner className="w-12 h-12 text-purple-400 animate-spin" />
                  <p className="text-sm font-extrabold text-slate-100">
                    Generando composición fotorealista con Gemini...
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Analizando superficie, perspectiva de cámara y calculando sombras proyectadas.
                  </p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 text-center font-mono">
              💡 Tip: Puedes subir cualquier foto de tu sala, oficina o terraza y ubicar la lámpara u objeto deseado.
            </p>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onFileSelect={handleCustomProductUpload}
      />

      <DebugModal
        isOpen={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
        imageUrl={debugImageUrl}
        prompt={debugPrompt}
      />

      <TouchGhost
        imageUrl={selectedProduct?.imageUrl || null}
        position={touchGhostPosition}
      />
    </div>
  );
};

export default ImmersiveCanvasView;
