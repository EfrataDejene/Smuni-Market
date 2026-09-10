import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

# Replace the products section in SellerDashboard
new_products_ui = """          {activeSection === 'all_products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">My Product Listings ({myProducts.length})</h2>
                <button onClick={() => { setEditingProduct(null); setActiveSection('add_product'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/25">
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Package size={20} className="text-slate-600"/></span>
                    <span className="text-xs font-bold text-slate-400">Total Products</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 mt-3">{myProducts.length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><AlertTriangle size={20} className="text-amber-500"/></span>
                    <span className="text-xs font-bold text-amber-500">Pending Review</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 mt-3">{myProducts.filter(p => p.status === 'Pending').length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><CheckCircle size={20} className="text-emerald-500"/></span>
                    <span className="text-xs font-bold text-emerald-500">Approved</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 mt-3">{myProducts.filter(p => p.status === 'Approved' || p.status === 'Active').length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><XCircle size={20} className="text-red-500"/></span>
                    <span className="text-xs font-bold text-red-500">Rejected</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 mt-3">{myProducts.filter(p => p.status === 'Rejected').length}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-sm">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input type="text" placeholder="Search your products..." className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 font-medium" />
                </div>
                <select className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500">
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {myProducts.map(p => {
                  const inv = inventory.find(i => i.productId === p.productId);
                  const isPending = p.status === 'Pending';
                  const isRejected = p.status === 'Rejected';
                  return (
                    <div key={p.productId} onClick={() => setViewingProduct(p)} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col group">
                      <div className="relative h-40 bg-slate-100 flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={40} className="text-slate-300" />
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-[10px] font-black rounded-lg ${isPending ? 'bg-amber-100 text-amber-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {isPending ? 'Pending' : isRejected ? 'Rejected' : 'Approved'}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg">View Details</span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{p.name}</h3>
                        <div className="mt-auto pt-3">
                          <p className="font-black text-indigo-600 text-lg">ETB {p.price.toLocaleString()}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-slate-400 font-mono">SKU: {p.productId.toString().padStart(6, '0')}</span>
                            <span className="text-[10px] font-bold text-emerald-600">{inv ? `${inv.quantity} in stock` : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {myProducts.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-bold">You haven't added any products yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}"""

content = re.sub(
    r"\{\/\* ─── 2\. ALL PRODUCTS ───────────────────────────────────────────── \*\/\}\n\s*\{activeSection === 'all_products' && \([\s\S]*?\}\)\}\n\s*<\/tbody>\n\s*<\/table>\n\s*<\/div>\n\s*<\/div>\n\s*\)\}",
    "{/* ─── 2. ALL PRODUCTS ───────────────────────────────────────────── */}\n" + new_products_ui,
    content
)

state_injection = """  const [viewingProduct, setViewingProduct] = useState(null);
"""
content = content.replace("const [actionMsg, setActionMsg] = useState('');", state_injection + "\n  const [actionMsg, setActionMsg] = useState('');")

modal_ui = """      {viewingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-black text-slate-900">Product Details</h2>
              <button onClick={() => setViewingProduct(null)} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm p-1.5 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">
                    {viewingProduct.image ? (
                      <img src={viewingProduct.image} alt={viewingProduct.name} className="w-full h-full object-cover" />
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
                    <h1 className="text-2xl font-black text-slate-900 leading-tight">{viewingProduct.name}</h1>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-3xl font-black text-indigo-600">ETB {viewingProduct.price.toLocaleString()}</p>
                      {viewingProduct.discount > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">-{viewingProduct.discount}% OFF</span>}
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
                          {inventory.find(i => i.productId === viewingProduct.productId)?.quantity || 0} Units
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button onClick={() => setViewingProduct(null)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
                Close
              </button>
              <button onClick={() => { startEditProduct(viewingProduct); setViewingProduct(null); setActiveSection('add_product'); }} className="px-6 py-2.5 rounded-xl font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-sm flex items-center gap-2">
                <Edit2 size={16} /> Edit Product
              </button>
              <button onClick={() => { deleteProduct(viewingProduct.productId); setViewingProduct(null); triggerMessage(`Deleted ${viewingProduct.name}`); }} className="px-6 py-2.5 rounded-xl font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors text-sm flex items-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("    </div>\n  );\n}\n", modal_ui + "    </div>\n  );\n}\n")

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)
