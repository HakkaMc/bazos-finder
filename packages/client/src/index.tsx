import './index.scss'

import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { IntlProvider } from 'react-intl'

import { apolloClient } from './api/apollo'
import { App } from './modules'
import reportWebVitals from './reportWebVitals'
import { theme } from './styles'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <IntlProvider defaultLocale="en" locale="cs">
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </IntlProvider>
    </ApolloProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
