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

Posts are in `.mdx` with imports when using components directly, it's advised to install the mdx extension for vscode. 

```mdoc
%{ aside title='title' }

  content goes here

%{ /aside }
```

Disqus seems to be supported by the blog template but has not been investigated or enabled for the site. 