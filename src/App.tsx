import { createMemo, Loading } from "solid-js"

export default function App() {
  const asyncValue = createMemo(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return "Hello World"
  })
  return (
    <Loading fallback="Loading...">
      {asyncValue()}
    </Loading>
  )
}