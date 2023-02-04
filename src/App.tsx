import useProseMirror from "./hooks/useProse"
import Editor, { Handle } from "./ProseMirror"

import { schema } from "prosemirror-schema-basic"
import { TextSelection } from "prosemirror-state"
import { useCallback, useMemo, useRef } from "react"

function App() {
  const [state, setState] = useProseMirror({
    schema,
    doc: schema.node(
      "doc",
      {},
      schema.node("paragraph", {}, schema.text("12 345 678 910"))
    ),
  })

  const ref = useRef<Handle>(null)

  const handleSelection = useCallback(() => {
    const { from, to } = state.selection

    let startPos = from // The start position of the selection
    let endPos = to - 1 // The end position of the selection

    if (endPos - startPos > 1) {
      const nodeBeforeText = state.doc.resolve(startPos).nodeBefore
      const nodeAfterText = state.doc.resolve(endPos).nodeAfter

      const nodeBeforeWordsArray = nodeBeforeText?.text?.split(" ")
      const nodeAfterWordsArray = nodeAfterText?.text?.split(" ")

      const lastWordBefore = nodeBeforeWordsArray?.pop()
      const lastWordAfter = nodeAfterWordsArray.shift()

      const updatedStart = startPos - lastWordBefore?.length
      const updatedEnd = endPos + lastWordAfter?.length

      if (ref.current?.view) {
        ref.current.view.dispatch(
          state.tr.setSelection(
            new TextSelection(
              state.doc.resolve(updatedStart),
              state.doc.resolve(updatedEnd)
            )
          )
        )
      }
    }
  }, [state.selection, state.doc, state.tr])

  const handleDOMEvents = useMemo(
    () => ({
      mouseup: handleSelection,
    }),
    [handleSelection]
  )

  return (
    <Editor
      ref={ref}
      handleDOMEvents={handleDOMEvents}
      state={state}
      onChange={setState}
    />
  )
}

export default App
