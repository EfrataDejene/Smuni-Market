import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

# Add selectedVariant state
if "const [selectedVariant, setSelectedVariant] = useState(null);" not in content:
    content = content.replace("const [viewingProduct, setViewingProduct] = useState(null);", "const [viewingProduct, setViewingProduct] = useState(null);\n  const [selectedVariant, setSelectedVariant] = useState(null);")

# Find the viewingProduct modal and replace it
# The modal in AdminDashboard starts with `{viewingProduct && (`
# Let's replace from `{viewingProduct && (` to the end of the file.

new_modal = """      {viewingProduct && (() => {
        const displayImg = selectedVariant?.image || viewingProduct.image;
        const displayPrice = selectedVariant?.price || viewingProduct.price;
        const displayStock = selectedVariant ? selectedVariant.stock : (inventory.find(i => i.productId === viewingProduct.productId)?.quantity || 0);
        const seller = users.find(u => u.userId === viewingProduct.sellerId);
        const cat = categories.find(c => c.id === viewingProduct.categoryId);
        const hasVariants = viewingProduct.variants && viewingProduct.variants.length > 0;
        
        return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col relative border border-slate-200">
            
            {/* Header (Close button) */}
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => { setViewingProduct(null); setSelectedVariant(null); }} className="bg-white text-slate-500 hover:text-slate-800 p-2 rounded-full shadow-md border border-slate-100 transition-transform hover:scale-105">
                <X size={20}/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
                
                {/* ─── LEFT COLUMN: IMAGES ─── */}
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="w-full aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 flex items-center justify-center relative group">
                    {displayImg ? (
                      <img src={displayImg} alt={viewingProduct.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <Package size={100} className="text-slate-200" />
                    )}
                    {selectedVariant && (
                       <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5">
                         <Star size={12} className="text-yellow-400" fill="currentColor"/> Variant View
                       </div>
                    )}
                  </div>

                  {/* Variants Thumbnails */}
                  {hasVariants && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-500">Variants ({viewingProduct.variants.length})</h3>
                      <div className="flex flex-wrap gap-3">
                        <div 
                          onClick={() => setSelectedVariant(null)}
                          className={`w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${!selectedVariant ? 'border-blue-600 shadow-md scale-105' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          {viewingProduct.image ? <img src={viewingProduct.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><Package size={20} className="text-slate-300"/></div>}
                        </div>
                        {viewingProduct.variants.map(v => (
                          <div 
                            key={v.id} 
                            onClick={() => setSelectedVariant(v)}
                            className={`w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedVariant?.id === v.id ? 'border-blue-600 shadow-md scale-105' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            {v.image ? <img src={v.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><Package size={20} className="text-slate-300"/></div>}
                          </div>
                        ))}
                      </div>
                      
                      {/* Detailed Variant Cards (Optional visual flair as seen in screenshot) */}
                      <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div onClick={() => setSelectedVariant(null)} className={`bg-white border rounded-2xl p-2 cursor-pointer transition-all ${!selectedVariant ? 'border-blue-600 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                           <div className="w-full h-20 rounded-xl bg-slate-50 overflow-hidden mb-2">
                             {viewingProduct.image ? <img src={viewingProduct.image} className="w-full h-full object-cover" /> : null}
                           </div>
                           <p className="text-[10px] font-bold text-center text-slate-700">Main Product</p>
                        </div>
                        {viewingProduct.variants.map(v => (
                          <div key={v.id} onClick={() => setSelectedVariant(v)} className={`bg-white border rounded-2xl p-2 cursor-pointer transition-all ${selectedVariant?.id === v.id ? 'border-blue-600 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                             <div className="w-full h-20 rounded-xl bg-slate-50 overflow-hidden mb-2 relative">
                               {v.image ? <img src={v.image} className="w-full h-full object-cover" /> : null}
                             </div>
                             <p className="text-[10px] font-bold text-center text-slate-700 truncate">{[v.color, v.size].filter(Boolean).join(' - ') || 'Variant'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ─── RIGHT COLUMN: DETAILS ─── */}
                <div className="space-y-6">
                  
                  {/* Status Dropdown block */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Product Status</label>
                    <div className="relative inline-block w-full max-w-sm">
                      <select 
                        value={viewingProduct.status === 'Active' ? 'Approved' : viewingProduct.status}
                        onChange={(e) => handleUpdateProductStatus(viewingProduct.productId, e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm font-bold bg-white text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm appearance-none"
                      >
                        <option value="Pending">Pending Review</option>
                        <option value="Approved">Approved (Active)</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <div className="absolute left-3 top-3.5">
                        {viewingProduct.status === 'Pending' ? <AlertTriangle size={16} className="text-amber-500"/> : viewingProduct.status === 'Rejected' ? <XCircle size={16} className="text-red-500"/> : <CheckCircle size={16} className="text-emerald-500"/>}
                      </div>
                      <ChevronDown size={16} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Title & Tags */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">{cat?.name || 'Uncategorized'}</span>
                      {selectedVariant && <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">Variant Selected</span>}
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                       {viewingProduct.name} {selectedVariant && ` - ${[selectedVariant.color, selectedVariant.size].filter(Boolean).join(' ')}`}
                    </h1>
                    <p className="text-xs font-bold text-slate-400 font-mono bg-slate-100 inline-block px-2 py-1 rounded-md">SKU: {viewingProduct.productId.toString().padStart(6, '0')}-{selectedVariant ? selectedVariant.id.toString().slice(-4) : 'BASE'}</p>
                  </div>

                  {/* Giant Price Box */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <p className="text-4xl font-black text-slate-900">ETB {Number(displayPrice).toLocaleString()}</p>
                    <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2">
                      <Tag size={12} /> Base Price
                    </p>
                  </div>

                  {/* 2x2 Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                       <Package size={24} className="text-emerald-500 mb-3" />
                       <p className="text-2xl font-black text-slate-900">{displayStock}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">In Stock</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                       <ShoppingBag size={24} className="text-blue-500 mb-3" />
                       <p className="text-2xl font-black text-slate-900">124</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Units Sold</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                       <Star size={24} className="text-amber-400 mb-3" fill="currentColor" />
                       <p className="text-2xl font-black text-slate-900">4.8</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Rating</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                       <TrendingUp size={24} className="text-purple-500 mb-3" />
                       <p className="text-2xl font-black text-slate-900">{viewingProduct.discount || 0}%</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Discount</p>
                    </div>
                  </div>

                  {/* Vendor Box */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                      <User size={18} className="text-slate-600" />
                      <h3 className="text-sm font-black text-slate-900">Vendor</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Store size={10}/> BUSINESS NAME</p>
                        <p className="text-sm font-bold text-slate-800">{seller?.name || 'Unknown Vendor'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Mail size={10}/> EMAIL</p>
                        <p className="text-sm font-bold text-slate-800">{seller?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Tag size={10}/> VENDOR ID</p>
                        <p className="text-sm font-bold text-slate-800">{seller?.userId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
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

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)
