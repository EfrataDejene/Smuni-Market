with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

target = """                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase">Product Name *</label>
                        <input type="text" required value={prodName} onChange={e => setProdName(e.target.value)} placeholder="e.g. Classic Wrist Watch" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold bg-white" />
                      </div>"""

replacement = """                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase">Product Name *</label>
                        <input type="text" required value={prodName} onChange={e => setProdName(e.target.value)} placeholder="e.g. Classic Wrist Watch" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold bg-white" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase flex justify-between">
                          <span>Description</span>
                          <span className={descWordCount > 500 ? 'text-red-500' : 'text-slate-400'}>{descWordCount} / 500 words</span>
                        </label>
                        <textarea placeholder="Write a detailed description..." rows="3" value={prodDesc} onChange={e => {
                          const text = e.target.value;
                          const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                          if (words <= 500) {
                            setProdDesc(text);
                          } else {
                            if (text.length < prodDesc.length) setProdDesc(text);
                          }
                        }} className={`w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-medium ${descWordCount > 500 ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}></textarea>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2 mt-2 p-4 bg-white border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase">Product Features (Max 15)</label>
                          <span className="text-[10px] font-bold text-slate-400">{prodFeatures.length} / 15 added</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            id="newFeatureInput"
                            placeholder="e.g. Waterproof up to 50m" 
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium text-xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = e.target.value.trim();
                                if (val && prodFeatures.length < 15) {
                                  setProdFeatures([...prodFeatures, val]);
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('newFeatureInput');
                              const val = input.value.trim();
                              if (val && prodFeatures.length < 15) {
                                setProdFeatures([...prodFeatures, val]);
                                input.value = '';
                              }
                            }}
                            disabled={prodFeatures.length >= 15}
                            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold disabled:bg-slate-300 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        
                        {prodFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                            {prodFeatures.map((feat, idx) => (
                              <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                                {feat}
                                <button type="button" onClick={() => setProdFeatures(prodFeatures.filter((_, i) => i !== idx))} className="hover:bg-blue-200 rounded-full p-0.5 text-blue-800"><X size={10}/></button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>"""

content = content.replace(target, replacement)

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)
