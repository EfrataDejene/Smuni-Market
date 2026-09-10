import re

with open('src/pages/seller/SellerDashboard.jsx', 'r') as f:
    content = f.read()

# 1. We need to extract the activeSection === 'product' block.
block_regex = r"(\s*\{activeSection === 'product' && id && \(\(\) => \{[\s\S]*?\}\)\(\)\})"
match = re.search(block_regex, content)
if match:
    product_block = match.group(1)
    
    # 2. Remove it from its current position
    content = content.replace(product_block, "")
    
    # 3. Insert it inside the main layout.
    # We look for the categories section or settings section and append it there.
    # Or find the end of the <main> block.
    # The last activeSection inside the main block is probably 'settings'.
    settings_regex = r"(\{\/\* ─── 7\. SETTINGS ─── \*\/\}\n\s*\{activeSection === 'settings' && \([\s\S]*?<\/div>\n\s*\)\})"
    
    def replacement(m):
        return m.group(1) + "\n\n          {/* ─── 8. PRODUCT DETAIL ─── */}\n" + product_block
    
    content = re.sub(settings_regex, replacement, content)

with open('src/pages/seller/SellerDashboard.jsx', 'w') as f:
    f.write(content)
