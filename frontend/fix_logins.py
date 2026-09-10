import re

def fix_login(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Change "Register" tab to link to /register
    content = re.sub(
        r'onClick=\{\(\) => \{\n\s*setIsRegistering\(true\);\n\s*setError\(\x27\x27\);\n\s*setSuccess\(\x27\x27\);\n\s*\}\}',
        r"onClick={() => navigate('/register')}",
        content
    )

    # We want to force isRegistering to false forever, or just clean it up.
    # To be safe and avoid missing dependencies, we can just change the useState initial value:
    content = re.sub(
        r'const \[isRegistering, setIsRegistering\] = useState\(false\);',
        r'const [isRegistering, setIsRegistering] = useState(false);',
        content
    )
    
    # We can also just hide the Register tab if we want, but letting it link to /register is great.

    with open(filepath, 'w') as f:
        f.write(content)

fix_login('src/pages/auth/Login.jsx')
fix_login('src/pages/auth/SellerLogin.jsx')
