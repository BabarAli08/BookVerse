import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from "@radix-ui/themes";
import './index.css'
import AppRouter from './Router.tsx'
import { Provider } from 'react-redux'
import store from './Store/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Theme>

    <AppRouter />
      </Theme>
    </Provider>
  </StrictMode>,
)
