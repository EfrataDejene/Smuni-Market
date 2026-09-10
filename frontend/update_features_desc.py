import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

# 1. Add `prodFeatures` state
state_search = "  const [prodDesc, setProdDesc] = useState('');"
state_replace = "  const [prodDesc, setProdDesc] = useState('');\n  const [prodFeatures, setProdFeatures] = useState([]);"
content = content.replace(state_search, state_replace)

# 2. Add features to handleProductSubmit
submit_update_search = "        image: prodImage || editingProduct.image,\n        variants: variants\n      });"
submit_update_replace = "        image: prodImage || editingProduct.image,\n        variants: variants,\n        features: prodFeatures\n      });"
content = content.replace(submit_update_search, submit_update_replace)

submit_add_search = "        lowStockThreshold: 3,\n        variants: variants\n      });"
submit_add_replace = "        lowStockThreshold: 3,\n        variants: variants,\n        features: prodFeatures\n      });"
content = content.replace(submit_add_search, submit_add_replace)

# 3. Add to reset in handleProductSubmit
reset_search = "setProdName(''); setProdDesc(''); setProdPrice(''); setProdDiscount(0); setProdCatId(''); setProdSubCatId(''); setProdBrandId(''); setProdImage(''); setProdStock(''); setVariantType('none'); setVariants([]);"
reset_replace = "setProdName(''); setProdDesc(''); setProdPrice(''); setProdDiscount(0); setProdCatId(''); setProdSubCatId(''); setProdBrandId(''); setProdImage(''); setProdStock(''); setVariantType('none'); setVariants([]); setProdFeatures([]);"
content = content.replace(reset_search, reset_replace)

# 4. Add to startEditProduct
edit_search = "setProdDesc(prod.description);"
edit_replace = "setProdDesc(prod.description);\n    setProdFeatures(prod.features || []);"
content = content.replace(edit_search, edit_replace)

# 5. Add UI logic for description word count & features
# Need to find the Description textarea in the JSX

# First, define word count inside the render
render_search = "  const filteredOrders = getOrdersForTab(activeOrderTab);"
render_replace = "  const filteredOrders = getOrdersForTab(activeOrderTab);\n  const descWordCount = prodDesc.trim() ? prodDesc.trim().split(/\\s+/).length : 0;"
content = content.replace(render_search, render_replace)

# Find Description textarea
desc_regex = r"<div className=\"space-y-1\">\n\s*<label className=\"text-\[10px\] font-extrabold text-slate-400 uppercase\">Description(.*?)</label>\n\s*<textarea([\s\S]*?)<\/textarea>\n\s*<\/div>"

def desc_replacement(match):
    return """<div className="space-y-1">
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
                          // Allow editing (deleting) but prevent adding more words if already at 500
                          if (text.length < prodDesc.length) setProdDesc(text);
                        }
                      }} className={`w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 font-medium ${descWordCount > 500 ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}></textarea>
                    </div>"""

content = re.sub(desc_regex, desc_replacement, content)

# 6. Add Features UI block right after Description
features_ui = """
                    {/* Features List */}
                    <div className="space-y-2 mt-4 p-4 bg-white border border-slate-200 rounded-xl">
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
                    </div>
"""

# Insert features_ui right after the description div
# To find it, let's replace the whole description block with description + features
def desc_and_features(match):
    return desc_replacement(match) + features_ui

content = re.sub(desc_regex, desc_and_features, content)

# 7. Disable Submit if words > 500
submit_btn_regex = r"<button type=\"submit\" className=\"bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all\">([\s\S]*?)<\/button>"
submit_btn_replace = r"""<button type="submit" disabled={descWordCount > 500} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-extrabold text-xs py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all">
                    \1
                  </button>"""
content = re.sub(submit_btn_regex, submit_btn_replace, content)


with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)
