import os, re

def update_card(path):
    with open(path, 'r') as f:
        content = f.read()
    
    # Reset border-radius to 8px
    content = re.sub(r'border-radius:\s*0;', 'border-radius: 8px;', content)
    # Remove uppercase transforms and monospace
    content = re.sub(r'text-transform:\s*uppercase;', '', content)
    content = re.sub(r'font-family:\s*\'Courier New\', Courier, monospace;', '', content)
    
    # Update hover state
    content = re.sub(r'transform:\s*translate\(-4px,\s*-4px\);', 'transform: translateY(-2px) scale(1.01);', content)
    content = re.sub(r'border-color:\s*var\(--text-primary\);', 'border-color: var(--border-hover);', content)
    content = re.sub(r'box-shadow:\s*var\(--brutalist-shadow\);', 'box-shadow: var(--vercel-shadow);', content)
    
    with open(path, 'w') as f:
        f.write(content)

components = [
    'src/components/NewsCard.astro',
    'src/components/FeatureCard.astro',
    'src/components/RepoCard.astro',
    'src/components/TrendCard.astro'
]

for c in components:
    update_card(c)
