import {misspellingsIn} from "./engine"

test("uses the injected checker", () => {
    const checker = {correct: (word: string) => word.toLowerCase() !== "teh"}
    expect(misspellingsIn("Fix teh typo", checker).map((span) => span.word)).toEqual(["teh"])
})
