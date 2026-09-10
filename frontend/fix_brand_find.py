import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

search = """const selectedBrand = catTypeInput === 'sub' && catBrandInput ? brands.find(b => b.name === catBrandInput) : null;"""
replace = """const selectedBrand = catTypeInput === 'sub' && catBrandInput ? brands.find(b => b.name.toLowerCase() === catBrandInput.trim().toLowerCase()) : null;"""
content = content.replace(search, replace)

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)
