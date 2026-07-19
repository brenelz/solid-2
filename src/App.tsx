import { createMemo, Loading } from "solid-js"

const hello = async () => {
  "use server";
  console.log('on server');
  await new Promise(resolve => setTimeout(resolve, 1000))
  return "Hello World2"
}

export default function App() {
  const asyncValue = createMemo(hello)
  return (
    <Loading fallback="Loading...">
      {asyncValue()}
    </Loading>
  )
}