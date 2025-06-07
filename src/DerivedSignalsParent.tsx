import { createSignal } from 'solid-js';
import DerivedSignalsChild from './DerivedSignalsChild'

function DerivedSignalsParent() {
    const [name, setName] = createSignal('Initial Name');
    return (
        <>
            <button onClick={() => setName('Brenley Dueck')}>Set Parent Name</button>
            <DerivedSignalsChild name={name()} />
        </>
    )
}

export default DerivedSignalsParent;
