import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

# Replace everything from `{viewingProduct && (` to the end of the file
new_modal = """      {viewingProduct && (() => {
        const displayImg = selectedVariant?.image || viewingProduct.image;
        const displayPrice = selectedVariant?.price || viewingProduct.price;
        const displayStock = selectedVariant ? selectedVariant.stock : (inventory.find(i => i.productId === viewingProduct.productId)?.quantity || 0);
        
        return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-black text-slate-900">Product Details</h2>
              <button onClick={() => { setViewingProduct(null); setSelectedVariant(null); }} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm p-1.5 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">
                    {displayImg ? (
                      <img src={displayImg} alt={viewingProduct.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={80} className="text-slate-300" />
                    )}
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                     <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Approval Status</p>
                     <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 text-sm font-black rounded-xl ${viewingProduct.status === 'Pending' ? 'bg-amber-100 text-amber-700' : viewingProduct.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {viewingProduct.status === 'Pending' ? 'Pending Review' : viewingProduct.status === 'Rejected' ? 'Rejected' : 'Approved (Active)'}
                        </span>
                     </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 leading-tight">
                       {viewingProduct.name}
                       {selectedVariant && (
                         <span className="block text-lg text-slate-500 font-medium mt-1">
                           Variant: {[selectedVariant.color, selectedVariant.size].filter(Boolean).join(' - ')}
                         </span>
                       )}
                    </h1>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-3xl font-black text-indigo-600">ETB {Number(displayPrice).toLocaleString()}</p>
                      {(!selectedVariant && viewingProduct.discount > 0) && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">-{viewingProduct.discount}% OFF</span>}
                      {(selectedVariant && selectedVariant.offPrice) && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">Sale Price</span>}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm text-slate-600">
                    <p>{viewingProduct.description || 'No description provided.'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="border border-slate-100 bg-slate-50 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Category</p>
                        <p className="font-bold text-slate-800 text-sm mt-1">{categories.find(c => c.id === viewingProduct.categoryId)?.name || 'N/A'}</p>
                     </div>
                     <div className="border border-slate-100 bg-slate-50 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Stock Level</p>
                        <p className="font-bold text-slate-800 text-sm mt-1">
                          {displayStock} Units
                        </p>
                     </div>
                  </div>

                  {/* VARIATIONS DISPLAY */}
                  {viewingProduct.variants && viewingProduct.variants.length > 0 && (
                    <div className="mt-6 border-t border-slate-100 pt-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Product Variations</p>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setSelectedVariant(null)} 
                          className={`px-4 py-2 text-xs font-bold rounded-lg border ${!selectedVariant ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          Main Product
                        </button>
                        {viewingProduct.variants.map(v => {
                          const varName = [v.color, v.size].filter(Boolean).join(' - ') || 'Variant';
                          return (
                            <button 
                              key={v.id} 
                              onClick={() => setSelectedVariant(v)}
                              className={`px-4 py-2 text-xs font-bold rounded-lg border flex items-center gap-2 ${selectedVariant?.id === v.id ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                              {v.color && <span className="w-3 h-3 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: v.color.toLowerCase() }}></span>}
                              <span>{varName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button onClick={() => { setViewingProduct(null); setSelectedVariant(null); }} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
                Close
              </button>
              <button onClick={() => { startEditProduct(viewingProduct); setViewingProduct(null); setSelectedVariant(null); setActiveSection('add_product'); }} className="px-6 py-2.5 rounded-xl font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-sm flex items-center gap-2">
                <Edit2 size={16} /> Edit Product
              </button>
              <button onClick={() => { deleteProduct(viewingProduct.productId); setViewingProduct(null); setSelectedVariant(null); triggerMessage(`Deleted ${viewingProduct.name}`); }} className="px-6 py-2.5 rounded-xl font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors text-sm flex items-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
"""

content = re.sub(r"\{viewingProduct && \([\s\S]*$", new_modal, content)

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)

