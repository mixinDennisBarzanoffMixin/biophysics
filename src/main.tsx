import { render } from 'preact'
import './index.css'
import './components.css'
import 'katex/dist/katex.min.css'
import { App } from './app.tsx'

render(<App />, document.getElementById('app')!)
