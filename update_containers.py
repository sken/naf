import os, re

def inject_container_css(path, css_to_inject):
    with open(path, 'r') as f:
        content = f.read()
    
    if '@container' in content:
        return
        
    content = content.replace('</style>', f'{css_to_inject}\n</style>')
    with open(path, 'w') as f:
        f.write(content)

# RepoCard: Hide description normally, reveal it beautifully on large boxes
repo_css = """
  .description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  /* Phase 2: Elastic Component */
  @container bento (min-width: 450px) {
    .description {
      -webkit-line-clamp: 4;
      font-size: 1rem;
    }
    h3 {
      font-size: 1.5rem;
    }
  }
"""
inject_container_css('src/components/RepoCard.astro', repo_css)

# NewsCard: Hide source metadata normally, reveal large typography
news_css = """
  /* Phase 2: Elastic Component */
  @container bento (min-width: 450px) {
    h3 {
      font-size: 1.4rem;
      line-height: 1.4;
    }
  }
"""
inject_container_css('src/components/NewsCard.astro', news_css)

# FeatureCard: Clamp summary
feature_css = """
  .summary {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  /* Phase 2: Elastic Component */
  @container bento (min-width: 450px) {
    .summary {
      -webkit-line-clamp: 6;
      font-size: 1rem;
    }
    h3 {
      font-size: 1.5rem;
    }
  }
"""
inject_container_css('src/components/FeatureCard.astro', feature_css)

