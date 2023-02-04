import { useState, SetStateAction, Dispatch } from "react"
import { EditorState } from "prosemirror-state"

type Config = Parameters<typeof EditorState.create>[0]

function useProseMirror(
  config: Config
): [EditorState, Dispatch<SetStateAction<EditorState>>] {
  const [editorState, setEditorState] = useState(() =>
    EditorState.create(config)
  )

  return [editorState, setEditorState]
}

export default useProseMirror
