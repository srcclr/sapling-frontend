FROM node:10.19
CMD npm ci && npm run build:o2 && cp src/env.js dist && echo '/* /index.html 200' > dist/_redirects
