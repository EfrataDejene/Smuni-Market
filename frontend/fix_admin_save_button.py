import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

# I need to find the Footer Actions section and replace it.
old_footer = """            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <span className="text-sm font-bold text-slate-500">Update Status:</span>
                 <div className="relative">
                   <select 
                     value={viewingProduct.status === 'Active' ? 'Approved' : viewingProduct.status}
                     onChange={(e) => handleUpdateProductStatus(viewingProduct.productId, e.target.value)}
                     className="pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm appearance-none"
                   >
                     <option value="Pending">Pending Review</option>
                     <option value="Approved">Approved (Active)</option>
                     <option value="Rejected">Rejected</option>
                   </select>
                   <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                 </div>
              </div>
              <button onClick={() => setViewingProduct(null)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
                Close
              </button>
            </div>"""

new_footer = """            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <span className="text-sm font-bold text-slate-500">Update Status:</span>
                 <div className="relative flex-1 sm:flex-none">
                   <select 
                     value={viewingProduct.status === 'Active' ? 'Approved' : viewingProduct.status}
                     onChange={(e) => setViewingProduct({ ...viewingProduct, status: e.target.value })}
                     className="w-full sm:w-auto pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm appearance-none"
                   >
                     <option value="Pending">Pending Review</option>
                     <option value="Approved">Approved (Active)</option>
                     <option value="Rejected">Rejected</option>
                   </select>
                   <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                 </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button onClick={() => setViewingProduct(null)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm w-full sm:w-auto">
                  Cancel
                </button>
                <button onClick={() => handleUpdateProductStatus(viewingProduct.productId, viewingProduct.status)} className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 border border-indigo-600 hover:bg-indigo-700 transition-colors text-sm w-full sm:w-auto shadow-sm flex items-center justify-center gap-2">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>"""

if old_footer in content:
    content = content.replace(old_footer, new_footer)
else:
    print("Warning: old footer not found exactly")

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)
