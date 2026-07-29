import os, re

def update_card(path):
    with open(path, 'r') as f:
        content = f.read()
    
    # Remove border-radius
    content = re.sub(r'border-radius:\s*[0-9]+px;', 'border-radius: 0;', content)
    # Update hover transforms
    content = re.sub(r'transform:\s*translateY\([^)]+\);', 'transform: translate(-4px, -4px);', content)
    # Update shadow
    content = re.sub(r'box-shadow:\s*var\(--coss-shadow\);', '', content)
    content = re.sub(r'box-shadow:[^;]+--accent-glow\);', 'box-shadow: var(--brutalist-shadow);', content)
    # Hard border on hover
    content = re.sub(r'border-color:[^;]+;', 'border-color: var(--text-primary);', content)
    
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
