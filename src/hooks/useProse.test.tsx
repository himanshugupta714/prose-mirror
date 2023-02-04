import { renderHook } from "@testing-library/react"
import useProse from "./useProse"

import { schema } from "prosemirror-schema-basic"

describe("useProse", () => {
  it("should return a state and a dispatch function", () => {
    const { result } = renderHook(() =>
      useProse({
        schema: schema,
      })
    )

    const [state] = result.current

    expect(state).toHaveProperty("toJSON")
    expect(state).toHaveProperty("doc")
  })

  it("should return a state with a doc", () => {
    const { result } = renderHook(() =>
      useProse({
        schema: schema,
        doc: schema.node(
          "doc",
          {},
          schema.node("paragraph", {}, schema.text("12 345 678 910"))
        ),
      })
    )

    const [state] = result.current

    expect(state.doc).toHaveProperty("type")
    expect(state.doc).toHaveProperty("content")
    expect(state.doc).toHaveProperty("textContent")
  })
})
