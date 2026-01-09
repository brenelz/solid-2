import { createEffect, createMemo, createSignal, Errored, isPending, isRefreshing, Loading, refresh, Show } from "solid-js";

const users = {
  0: 'John Doe',
  1: 'Jane Doe',
  2: 'Jim Doe',
}

async function fetchUser(userId: number) {
  console.log('fetching user', userId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const user = users[userId as keyof typeof users];
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

export default function App() {
  const [id, setId] = createSignal(0);
  const [user, setUser] = createSignal(() => fetchUser(id()));
  const upper = createMemo(() => user().toUpperCase());

  return (

    <Loading fallback={<div>Loading...</div>}>
      <Errored fallback={<div>Error</div>}>
        <div style={{ opacity: isPending(upper) ? 0.5 : 1 }}>{upper()}</div>
      </Errored>
      <p>
        <button onClick={() => setId(id() - 1)}>Previous</button>
        <button onClick={() => setId(id() + 1)}>Next</button>
        <button onClick={() => refresh(user)}>Refresh</button>
        <button onClick={() => setUser('My User')}>Set User</button>
      </p>
    </Loading >
  )
}