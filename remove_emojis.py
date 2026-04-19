import os
import re

# Regex for emojis (basic approach)
import emoji

def remove_emojis(text):
    # We want to preserve specific emojis in app.js
    preserve = ['🎯', '📊', '📁', '🏆', '⏰', '🧠', '💬', '⚙️', '🔒']
    
    def repl(match):
        chars = match.group(0)
        return "".join([c if c in preserve else "" for c in chars])
        
    # emoji.replace_emoji can replace with a string or callable
    # Actually let's just use emoji.replace_emoji with a function
    
    def replace_func(e, data):
        c = e
        # If it's one of the preserved icons, keep it, else remove
        if c in preserve:
            return c
        return ""
    
    return emoji.replace_emoji(text, replace=replace_func)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = remove_emojis(content)
    
    # Let's do a second pass for things like ⚙️ which are actually two code points: U+2699 U+FE0F
    # Some standalone dingbats might not be caught depending on the emoji library version.
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('.'):
    for idx, file in enumerate(files):
        if file.endswith('.js') or file.endswith('.html'):
            process_file(os.path.join(root, file))

print("Done")
