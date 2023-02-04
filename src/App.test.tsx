import { render } from "@testing-library/react"
import App from "./App"

describe("App Container", () => {
  test("App", () => {
    const { container } = render(<App />)
    expect(container).toMatchSnapshot()
  })
})
