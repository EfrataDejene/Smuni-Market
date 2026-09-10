import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

old_footer = """            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button onClick={() => setViewingProduct(null)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
                Close
              </button>
              {viewingProduct.status !== 'Approved' && viewingProduct.status !== 'Active' && (
                <button onClick={() => handleUpdateProductStatus(viewingProduct.productId, 'Approved')} className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2">
                  <CheckCircle size={16} /> Approve Product
                </button>
              )}
              {viewingProduct.status !== 'Rejected' && (
                <button onClick={() => handleUpdateProductStatus(viewingProduct.productId, 'Rejected')} className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors text-sm shadow-lg shadow-red-500/25 flex items-center gap-2">
                  <XCircle size={16} /> Reject
                </button>
              )}
              {viewingProduct.status !== 'Pending' && (
                <button onClick={() => handleUpdateProductStatus(viewingProduct.productId, 'Pending')} className="px-6 py-2.5 rounded-xl font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors text-sm flex items-center gap-2">
                  <AlertTriangle size={16} /> Mark Pending
                </button>
              )}
            </div>"""

new_footer = """            {/* Footer Actions */}
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

if old_footer in content:
    content = content.replace(old_footer, new_footer)
else:
    print("Warning: old footer not found exactly")

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)
