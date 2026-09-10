import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

# Replace the select with an input + datalist
search_select = """                      <select
                        value={catBrandInput}
                        onChange={e => setCatBrandInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                      >
                        <option value="">Select associated brand (Optional)</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>"""

replace_input = """                      <div className="relative">
                        <input
                          list="brands-datalist"
                          value={catBrandInput}
                          onChange={e => setCatBrandInput(e.target.value)}
                          placeholder="Type or select associated brand (Optional)"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                        />
                        <datalist id="brands-datalist">
                          {brands.map(brand => (
                            <option key={brand.id} value={brand.name} />
                          ))}
                        </datalist>
                      </div>"""
content = content.replace(search_select, replace_input)

# Update handleAddCategorySubmit to look up the ID
search_submit = """      if (isEditing) {
        const category = categories.find(item => item.id === editingCategoryId);
        await updateCategory(editingCategoryId, catNameInput, catTypeInput === 'sub' ? catParentInput : '', category?.status || 'Active', catTypeInput === 'sub' ? catBrandInput : '');
      } else {
        await addCategory(catNameInput, 'Layers', catTypeInput === 'sub' ? catParentInput : '', catTypeInput === 'sub' ? catBrandInput : '');
      }"""

replace_submit = """      const selectedBrand = catTypeInput === 'sub' && catBrandInput ? brands.find(b => b.name === catBrandInput) : null;
      const brandIdToSend = selectedBrand ? selectedBrand.id : '';

      if (isEditing) {
        const category = categories.find(item => item.id === editingCategoryId);
        await updateCategory(editingCategoryId, catNameInput, catTypeInput === 'sub' ? catParentInput : '', category?.status || 'Active', brandIdToSend);
      } else {
        await addCategory(catNameInput, 'Layers', catTypeInput === 'sub' ? catParentInput : '', brandIdToSend);
      }"""
content = content.replace(search_submit, replace_submit)

# Update edit button to set the brand name instead of ID
search_edit_btn = """<button onClick={() => { setEditingCategoryId(c.id); setCatNameInput(c.name); setCatTypeInput(c.parent_id ? 'sub' : 'main'); setCatParentInput(c.parent_id ? String(c.parent_id) : ''); setCatBrandInput(c.brand_id ? String(c.brand_id) : ''); setShowAddCategoryModal(true); }} className="text-indigo-500 hover:text-indigo-700">"""
replace_edit_btn = """<button onClick={() => { setEditingCategoryId(c.id); setCatNameInput(c.name); setCatTypeInput(c.parent_id ? 'sub' : 'main'); setCatParentInput(c.parent_id ? String(c.parent_id) : ''); setCatBrandInput(c.brand_id ? (brands.find(b => b.id === c.brand_id)?.name || '') : ''); setShowAddCategoryModal(true); }} className="text-indigo-500 hover:text-indigo-700">"""
content = content.replace(search_edit_btn, replace_edit_btn)

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)
