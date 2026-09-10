import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

# 1. Remove `flex-1 overflow-y-auto`
content = content.replace('className="flex-1 overflow-y-auto p-6"', 'className="p-6 lg:p-8"')

# 2. Fix the header
old_header = """            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-black text-slate-900">Product Details</h2>
              <button onClick={() => { setSelectedVariant(null); navigate('/seller/dashboard/all_products'); }} className="text-slate-400 hover:text-slate-600 bg-white shadow-sm p-1.5 rounded-full"><X size={20}/></button>
            </div>"""

new_header = """            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <button onClick={() => { setSelectedVariant(null); navigate('/seller/dashboard/all_products'); }} className="text-slate-400 hover:text-slate-700 bg-white shadow-sm p-2 rounded-xl border border-slate-200 transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-lg font-black text-slate-900">Product Details</h2>
              </div>
            </div>"""

content = content.replace(old_header, new_header)

# Make sure ChevronLeft is imported!
if "ChevronLeft" not in content:
    content = content.replace("ChevronRight,", "ChevronRight, ChevronLeft,")

# 3. Fix the image container. Currently it's `aspect-square bg-slate-100`. Let's make it `aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200`.
old_img = """<div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">"""
new_img = """<div className="aspect-[4/3] bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-200">"""
content = content.replace(old_img, new_img)

# 4. Fix grid layout to lg:grid-cols-[1fr_1.2fr]
content = content.replace('className="grid grid-cols-1 md:grid-cols-2 gap-8"', 'className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10"')

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)
