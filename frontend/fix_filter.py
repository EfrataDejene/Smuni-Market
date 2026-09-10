import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

# Remove the duplicated state declaration
content = content.replace('  const [prodStock, setProdStock] = useState("");\n  const [prodStock, setProdStock] = useState("");', '  const [prodStock, setProdStock] = useState("");')
content = content.replace("  const [prodStock, setProdStock] = useState('');\n  const [prodStock, setProdStock] = useState('');", "  const [prodStock, setProdStock] = useState('');")
# Try a simpler regex to remove the duplicate
content = re.sub(r'const \[prodStock, setProdStock\] = useState\((.*?)\);\n\s*const \[prodStock, setProdStock\] = useState\((.*?)\);', r'const [prodStock, setProdStock] = useState(\1);', content)

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)
