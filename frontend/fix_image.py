import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

replacement = """{p.image ? (
                              <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                <Package size={20} />
                              </div>
                            )}"""

content = content.replace('<img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />', replacement)

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)

