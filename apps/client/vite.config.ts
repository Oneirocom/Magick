
      import { defineConfig } from 'vite';
      import react from '@vitejs/plugin-react';
      import viteTsConfigPaths from 'vite-tsconfig-paths';
      
      
      export default defineConfig({
        
    server:{
      port: 4200,
      host: 'localhost',
    },
        
    plugins: [
      
      react(),
      viteTsConfigPaths({
        root: '../../',
      }),
    ],
    
        
    // Uncomment this if you are using workers. 
    // worker: {
    //  viteTsConfigPaths({
    //    root: '../../',
    //  }),
    // },
        
        
        
      });