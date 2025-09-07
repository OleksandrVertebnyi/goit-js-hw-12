// import { defineConfig } from 'vite';

// export default defineConfig({
//   base: '/goit-js-hw-12/', 
//   server: {
//     port: 5173,
//   },
// });

import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',          
  base: '/goit-js-hw-12/', 
  build: {
    outDir: '../docs',  
  },
  define: {
    global: 'window',
  },
});

