import { createSignal } from "solid-js"

export default function DerivedSignalsChild(props: { name: string }) {
    const [innerName, setInnerName] = createSignal(() => props.name);
    return (
        <>
            <button onClick={() => setInnerName('Dev Agrawal')}>Inner Name</button>
            <p>Inner Name: {innerName()}</p>
        </>
    )
}