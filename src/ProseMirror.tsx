import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  CSSProperties,
} from "react"
import { EditorView, EditorProps, DirectEditorProps } from "prosemirror-view"
import { EditorState, Transaction } from "prosemirror-state"

export interface Handle {
  view: EditorView | null
}

interface PropsBase extends EditorProps {
  state: EditorState
  style?: CSSProperties
  className?: string
  editorViewFactory?: (
    el: HTMLDivElement,
    editorProps: DirectEditorProps,
    props: Props
  ) => EditorView
}

interface PropsWithOnChange {
  onChange: (state: EditorState) => void
  dispatchTransaction?: never
}

interface PropsWithDispatchTransaction {
  dispatchTransaction: (transaction: Transaction) => void
  onChange?: never
}

type Props = PropsBase & (PropsWithOnChange | PropsWithDispatchTransaction)

export default forwardRef<Handle, Props>(function ProseMirror(
  props,
  ref
): JSX.Element {
  const root = useRef<HTMLDivElement>(null!)
  const initialProps = useRef(props)
  const viewRef = useRef<EditorView | null>(null)
  const { state, ...restProps } = props

  // update the view
  viewRef.current?.updateState(state)
  viewRef.current?.setProps(buildProps(restProps))

  // initialize the view
  useEffect(() => {
    const { editorViewFactory: factory } = initialProps.current
    const config = {
      state: initialProps.current.state,
      ...buildProps(initialProps.current),
    }

    const view =
      factory?.(root.current, config, initialProps.current) ||
      new EditorView(root.current, config)

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [])

  // modifying the viewRef.current object directly will not trigger a re-render
  useImperativeHandle(ref, () => ({
    get view() {
      return viewRef.current
    },
  }))

  function buildProps(props: Partial<Props>): Partial<DirectEditorProps> {
    return {
      ...props,
      dispatchTransaction: (transaction: Transaction) => {
        // `dispatchTransaction` takes precedence.
        if (props.dispatchTransaction) {
          props.dispatchTransaction(transaction)
        } else if (props.onChange && viewRef.current) {
          props.onChange(viewRef.current.state.apply(transaction))
        }
      },
    }
  }

  return <div ref={root} style={props.style} className={props.className} />
})
