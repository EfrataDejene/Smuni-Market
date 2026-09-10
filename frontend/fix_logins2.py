import re

def fix_login2(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Link bottom "Create one now" / "register your store" to /register
    content = re.sub(
        r'onClick=\{\(\) => \{\n\s*setIsRegistering\(!isRegistering\);\n\s*setError\(\x27\x27\);\n\s*setSuccess\(\x27\x27\);\n\s*\}\}',
        r"onClick={() => navigate('/register')}",
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)

fix_login2('src/pages/auth/Login.jsx')
fix_login2('src/pages/auth/SellerLogin.jsx')
