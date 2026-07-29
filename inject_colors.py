import os, re

def inject_colors(path):
    with open(path, 'r') as f:
        content = f.read()
    
    # 1. Update hover borders to use the specific --card-accent
    content = re.sub(r'border-color:\s*var\(--border-hover\);', 'border-color: var(--card-accent);', content)
    
    # 2. Add glowing box-shadow to hover state
    content = re.sub(r'box-shadow:\s*var\(--vercel-shadow\);', 'box-shadow: 0 8px 30px var(--card-glow);', content)
    
    # 3. Update internal badges/text to use accent color
    # RepoCard (language text, stars)
    if 'RepoCard' in path:
        content = re.sub(r'color:\s*var\(--text-primary\);\s*/\*\s*language\s*\*/', 'color: var(--card-accent);', content)
        # Assuming we can just replace text-primary in meta with card-accent
        content = content.replace('color: var(--text-primary);', 'color: var(--card-accent);')

    # FeatureCard (status text)
    if 'FeatureCard' in path:
        content = content.replace('color: var(--text-primary);', 'color: var(--card-accent);')

    # NewsCard (source text)
    if 'NewsCard' in path:
        content = content.replace('color: var(--text-primary);', 'color: var(--card-accent);')

    # TrendCard (framework text)
    if 'TrendCard' in path:
        content = content.replace('color: var(--text-primary);', 'color: var(--card-accent);')
        
    with open(path, 'w') as f:
        f.write(content)

components = [
    'src/components/NewsCard.astro',
    'src/components/FeatureCard.astro',
    'src/components/RepoCard.astro',
    'src/components/TrendCard.astro'
]

for c in components:
    inject_colors(c)
