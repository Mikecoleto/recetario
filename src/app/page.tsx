"use client";
import React, { useState } from 'react';
import { Plus, Loader2, CheckCircle2, X } from 'lucide-react';

export default function RecipeApp() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [extractedRecipes, setExtractedRecipes] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleImport = async (inputData: string) => {
    setLoading(true);
    // Aquí llamaríamos a nuestra API de arriba
    const res = await fetch('/api/extract', {
      method: 'POST',
      body: JSON.stringify({ content: inputData, type: 'url/pdf' })
    });
    const data = await res.json();
    setExtractedRecipes(data.recetasEncontradas);
    setShowModal(true);
    setLoading(false);
  };

  const toggleRecipe = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white p-4">
      {/* Botón de Importar */}
      <div className="max-w-md mx-auto mt-10">
        <button 
          onClick={() => handleImport("Link de ejemplo")}
          className="w-full bg-[#18181b] border-2 border-dashed border-zinc-700 p-8 rounded-2xl flex flex-col items-center gap-3 hover:border-amber-500 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin text-amber-500" /> : <Plus className="text-zinc-500" />}
          <span className="text-zinc-400 font-medium">Pegar Link o Subir PDF</span>
        </button>
      </div>

      {/* Modal de Selección */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#18181b] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-zinc-800 p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recetas Encontradas</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <div className="space-y-3">
              {extractedRecipes.map((recipe: any) => (
                <div 
                  key={recipe.id}
                  onClick={() => toggleRecipe(recipe.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                    selectedIds.has(recipe.id) ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-900/50'
                  }`}
                >
                  <div>
                    <p className="font-bold">{recipe.titulo}</p>
                    <p className="text-xs text-zinc-500">{recipe.categoria} • {recipe.dieta.join(', ')}</p>
                  </div>
                  {selectedIds.has(recipe.id) && <CheckCircle2 className="text-amber-500" />}
                </div>
              ))}
            </div>

            <button 
              className="w-full bg-amber-500 text-black font-bold py-4 rounded-xl mt-6 shadow-lg shadow-amber-500/20"
              onClick={() => {
                alert("Guardando en Firebase...");
                setShowModal(false);
              }}
            >
              Importar {selectedIds.size} recetas
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
