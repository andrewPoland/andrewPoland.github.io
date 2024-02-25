# Blog



## deployment
Workflow deploys astro site to github pagees.

## package manager

Using pnpm for managing packages and running locally. 

```ps1
pnpm run dev
```

## posts

posts are located under [blog folder](./src/content/blog) and then displayed on the site based on categories. 

list of all categories is under [content file](./src/data/categories.ts) and ever blog post must have fontmatter defining it's category. 

Tags can be added to blog posts to associate with each other and allow list all `Azure` related content. 

Posts are in `.mdoc` which stands for markdoc. This allows adding .astro components into markdown using the style below. Primary benefit is the aside style notes which allow visual clean ways to call out information that's important to understand to reduce the chance of copy pasting without reading important details. 

```mdoc
%{ aside title='title' }

  content goes here

%{ /aside }
```

Disqus seems to be supported by the blog template but has not been investigated or enabled for the site. 