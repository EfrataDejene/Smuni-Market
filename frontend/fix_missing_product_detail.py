import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

product_block = """
          {/* ─── 8. PRODUCT DETAIL ─── */}
          {activeSection === 'product' && id && (() => {
            const viewingProduct = products.find(p => p.productId === Number(id) || String(p.productId) === id);
            if (!viewingProduct || viewingProduct.sellerId !== currentUser.userId) {
              return (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <h2 className="text-xl font-bold text-slate-700">Product Not Found</h2>
                  <button onClick={() => navigate('/seller/dashboard/all_products')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Go Back</button>
                </div>
              );
            }
            
            const displayImg = selectedVariant?.image || viewingProduct.image;
            const displayPrice = selectedVariant?.price || viewingProduct.price;
            const displayStock = selectedVariant ? selectedVariant.stock : (inventory.find(i => i.productId === viewingProduct.productId)?.quantity || 0);
            
            return (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <button onClick={() => { setSelectedVariant(null); navigate('/seller/dashboard/all_products'); }} className="text-slate-400 hover:text-slate-700 bg-white shadow-sm p-2 rounded-xl border border-slate-200 transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <h2 className="text-lg font-black text-slate-900">Product Details</h2>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
                    <div className="aspect-[4/3] bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-200">
                      {displayImg ? (
                        <img src={displayImg} alt={viewingProduct.name} className="w-full h-full object-contain" />
                      ) : (
                        <Package size={64} className="text-slate-300" />
                      )}
                    </div>
                    
                    <div>
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${viewingProduct.status === 'Approved' ? 'bg-green-100 text-green-700' : viewingProduct.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                            {viewingProduct.status}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SKU-{viewingProduct.productId}</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">
                          {viewingProduct.name}
                          {selectedVariant && (
                            <span className="block text-sm font-bold text-blue-600 mt-1">
                              Variant: {[selectedVariant.color, selectedVariant.size].filter(Boolean).join(' - ')}
                            </span>
                          )}
                        </h1>
                        <div className="flex items-center gap-4 mt-3">
                          <p className="text-3xl font-black text-indigo-600">ETB {Number(displayPrice).toLocaleString()}</p>
                          {(!selectedVariant && viewingProduct.discount > 0) && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">-{viewingProduct.discount}% OFF</span>}
                        </div>
                      </div>
                      
                      <div className="prose prose-sm text-slate-600 mb-6">
                        <p>{viewingProduct.description || 'No description provided.'}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="border border-slate-100 bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Category</p>
                          <p className="font-bold text-slate-800 text-sm mt-1">{categories.find(c => c.id === viewingProduct.categoryId)?.name || 'N/A'}</p>
                        </div>
                        <div className="border border-slate-100 bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Stock Level</p>
                          <p className="font-bold text-slate-800 text-sm mt-1">{displayStock} Units</p>
                        </div>
                      </div>
                      
                      {viewingProduct.variants && viewingProduct.variants.length > 0 && (
                        <div className="border-t border-slate-100 pt-6">
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
                  <button onClick={() => { setSelectedVariant(null); navigate('/seller/dashboard/all_products'); }} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
                    Close
                  </button>
                  <button onClick={() => { startEditProduct(viewingProduct); setSelectedVariant(null); navigate('/seller/dashboard/add_product'); }} className="px-6 py-2.5 rounded-xl font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-sm flex items-center gap-2">
                    <Edit2 size={16} /> Edit Product
                  </button>
                  <button onClick={() => { deleteProduct(viewingProduct.productId); setSelectedVariant(null); navigate('/seller/dashboard/all_products'); triggerMessage(`Deleted ${viewingProduct.name}`); }} className="px-6 py-2.5 rounded-xl font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors text-sm flex items-center gap-2">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            );
          })()}
"""

# Insert it before the closing tags of the main content area
target = "        </div>\n      </div>\n    </div>\n  );\n}"
content = content.replace(target, product_block + "\n" + target)

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)
