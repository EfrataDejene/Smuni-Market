import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

search = """<p className="text-[10px] text-slate-400">{c.parent?.name ? `Subcategory of ${c.parent.name}` : 'Main category'} · ID #{c.id}</p>"""
replace = """<p className="text-[10px] text-slate-400">
  {c.parent?.name ? `Subcategory of ${c.parent.name}` : 'Main category'} 
  {c.brand_id ? ` · Brand: ${brands.find(b => b.id === c.brand_id)?.name || 'Unknown'}` : ''}
  · ID #{c.id}
</p>"""

content = content.replace(search, replace)

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)
