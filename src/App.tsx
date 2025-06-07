import { createSignal } from 'solid-js'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      {count()}
      <button onClick={() => setCount(count() + 1)}>Increment</button>
    </>
  )
}

export default App
