import os, re

def apply_aarhus(path):
    with open(path, 'r') as f:
        content = f.read()
    
    # 1. Backgrounds & Borders
    content = content.replace('var(--surface-color)', 'var(--card-bg)')
    content = content.replace('var(--border-color)', 'var(--card-border)')
    
    # 2. Text Colors
    # Replace any hardcoded #fff or #ffffff
    content = re.sub(r'#fff(fff)?', 'var(--card-text)', content, flags=re.IGNORECASE)
    # Replace inherit with card-text
    content = content.replace('color: inherit;', 'color: var(--card-text);')
    
    # Replace text-secondary with card-text but we might want opacity
    # Let's just safely replace var(--text-secondary) with var(--card-text)
    content = content.replace('var(--text-secondary)', 'var(--card-text)')

    # Ensure the card itself has the color set
    if 'color: var(--card-text);' not in content:
        # try injecting it after background
        content = content.replace('background: var(--card-bg);', 'background: var(--card-bg);\n    color: var(--card-text);')

    with open(path, 'w') as f:
        f.write(content)

components = [
    'src/components/NewsCard.astro',
    'src/components/FeatureCard.astro',
    'src/components/RepoCard.astro',
    'src/components/TrendCard.astro'
]

for c in components:
    apply_aarhus(c)
