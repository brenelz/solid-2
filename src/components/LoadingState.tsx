type LoadingStateProps = {
  label: string
  detail?: string
}

export function LoadingState(props: LoadingStateProps) {
  return (
    <div class="loading-state" role="status" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true" />
      <span>
        <strong>{props.label}</strong>
        {props.detail && <small>{props.detail}</small>}
      </span>
    </div>
  )
}
