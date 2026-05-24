/* @refresh reload */
import { Loading, render } from '@solidjs/web'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')

render(() => <Loading><App /></Loading>, root!)
