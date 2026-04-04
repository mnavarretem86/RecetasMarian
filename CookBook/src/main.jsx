import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

toastr.options = {
  closeButton: false,
  progressBar: true,
  newestOnTop: true,
  preventDuplicates: true,
  positionClass: 'toast-top-right',
  timeOut: '3000',
  extendedTimeOut: '1000',
  showDuration: '300',
  hideDuration: '300',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)