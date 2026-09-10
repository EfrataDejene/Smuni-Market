import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

# 1. Add isDescExpanded state
state_search = "const [activeSection, setActiveSection] = useState(section || 'dashboard');"
state_replace = "const [activeSection, setActiveSection] = useState(section || 'dashboard');\n  const [isDescExpanded, setIsDescExpanded] = useState(false);"
if "isDescExpanded" not in content:
    content = content.replace(state_search, state_replace)

# 2. Update description rendering
desc_search = """<div className="prose prose-sm text-slate-600 mb-6">
                        <p>{viewingProduct.description || 'No description provided.'}</p>
                      </div>"""

desc_replace = """<div className="mb-6">
                        <div className={`prose prose-sm text-slate-600 whitespace-pre-wrap ${!isDescExpanded ? 'line-clamp-3' : ''}`}>
                          {viewingProduct.description || 'No description provided.'}
                        </div>
                        {viewingProduct.description && viewingProduct.description.length > 150 && (
                          <button 
                            onClick={() => setIsDescExpanded(!isDescExpanded)} 
                            className="text-blue-600 font-bold text-xs mt-2 hover:underline"
                          >
                            {isDescExpanded ? 'See Less' : 'See More'}
                          </button>
                        )}
                      </div>"""

content = content.replace(desc_search, desc_replace)

# 3. Add Features Display right after Description block
# Look for: <div className="grid grid-cols-2 gap-4 mb-6">
features_block = """                      {viewingProduct.features && viewingProduct.features.length > 0 && (
                        <div className="mb-6">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Product Features</p>
                          <ul className="space-y-2">
                            {viewingProduct.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-medium bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}"""

grid_search = """<div className="grid grid-cols-2 gap-4 mb-6">"""
grid_replace = features_block + "\n\n                      " + grid_search

content = content.replace(grid_search, grid_replace)

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)

