import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

search = """                        <datalist id="brands-datalist">
                          {brands.map(brand => (
                            <option key={brand.id} value={brand.name} />
                          ))}
                        </datalist>"""

replace = """                        <datalist id="brands-datalist">
                          {Array.from(new Set(brands.map(b => b.name))).map((brandName, idx) => (
                            <option key={idx} value={brandName} />
                          ))}
                        </datalist>"""

content = content.replace(search, replace)

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)
