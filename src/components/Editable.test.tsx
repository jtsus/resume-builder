import React, {useState} from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import Editable from "./Editable";
import BulletList from "./BulletList";

const Field = ({onChange = jest.fn(), onEnter, onDeleteEmpty, value = "Hello"}: {
    onChange?: (value: string) => void
    onEnter?: () => void
    onDeleteEmpty?: () => void
    value?: string
}) => (
    <Editable
        value={value}
        onChange={onChange}
        onEnter={onEnter}
        onDeleteEmpty={onDeleteEmpty}
        testId="field"
    />
)

test("marks the field as contenteditable without native spellcheck", () => {
    render(<Field />)
    const field = screen.getByTestId("field")
    expect(field).toHaveAttribute("contenteditable", "true")
    expect(field).toHaveAttribute("spellcheck", "false")
})

test("enter on a field does not insert a newline and notifies the parent", () => {
    const onEnter = jest.fn()
    render(<Field onEnter={onEnter} />)
    fireEvent.keyDown(screen.getByTestId("field"), {key: "Enter", keyCode: 13})
    expect(onEnter).toHaveBeenCalledTimes(1)
})

test("delete and backspace on an empty field remove it", () => {
    const onDeleteEmpty = jest.fn()
    render(<Field value="" onDeleteEmpty={onDeleteEmpty} />)
    fireEvent.keyDown(screen.getByTestId("field"), {key: "Backspace"})
    fireEvent.keyDown(screen.getByTestId("field"), {key: "Delete"})
    expect(onDeleteEmpty).toHaveBeenCalledTimes(2)
})

test("delete on a non-empty field does not remove it", () => {
    const onDeleteEmpty = jest.fn()
    render(<Field value="keep" onDeleteEmpty={onDeleteEmpty} />)
    fireEvent.keyDown(screen.getByTestId("field"), {key: "Delete"})
    expect(onDeleteEmpty).not.toHaveBeenCalled()
})

const ListHarness = () => {
    const [items, setItems] = useState(["first", "second"])
    return <BulletList items={items} onChange={setItems} itemClassName="action" testIdPrefix="bullet" />
}

test("enter on a bullet inserts a new empty bullet after it", () => {
    render(<ListHarness />)
    expect(screen.getAllByTestId(/bullet-/)).toHaveLength(2)
    fireEvent.keyDown(screen.getByTestId("bullet-0"), {key: "Enter"})
    expect(screen.getAllByTestId(/bullet-/)).toHaveLength(3)
    expect(screen.getByTestId("bullet-1")).toHaveTextContent("")
    expect(screen.getByTestId("bullet-2")).toHaveTextContent("second")
})

test("delete on an empty bullet removes that line", () => {
    render(<ListHarness />)
    fireEvent.keyDown(screen.getByTestId("bullet-0"), {key: "Enter"})
    fireEvent.keyDown(screen.getByTestId("bullet-1"), {key: "Delete"})
    expect(screen.getAllByTestId(/bullet-/)).toHaveLength(2)
    expect(screen.getByTestId("bullet-0")).toHaveTextContent("first")
    expect(screen.getByTestId("bullet-1")).toHaveTextContent("second")
})
