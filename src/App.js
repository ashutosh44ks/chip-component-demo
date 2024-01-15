import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [onFocus, setOnFocus] = useState(false);
  // data is the list of all the names
  const data = [
    "John Doe",
    "Johnny Bravo",
    "Jonathan Smith",
    "Joanne Doe",
    "Joan Rivers",
    "Joe Bloggs",
    "Johanna Johnson",
  ];
  // dataList is the list of names that are shown in the dropdown
  const [dataList, setDataList] = useState(data);
  // tags is the list of names that are selected
  const [tags, setTags] = useState([]);
  // input is the text that is typed in the div with contentEditable
  const [input, setInput] = useState("");

  // When the input changes, the dataList is filtered to show only the names that include the input text
  useEffect(() => {
    if (input)
      setDataList(
        data.filter((item) => item.toLowerCase().includes(input.toLowerCase()))
      );
    else setDataList(data);
  }, [input]);

  const editableDiv = useRef(null);

  const [highlightLastTag, setHighlightLastTag] = useState(false);

  return (
    <div className="App">
      <main>
        <div
          className={`container ${onFocus ? "focus" : ""}`}
          onFocus={() => setOnFocus(true)}
          onBlur={() => setOnFocus(false)}
          onClick={() => {
            editableDiv.current.focus();
          }}
        >
          {tags.map((item, index) => (
            <span
              className={`tag ${
                index === tags.length - 1 && highlightLastTag
                  ? "highlighted"
                  : ""
              }`}
              key={index}
            >
              <span className="tag-body">
                <span className="icon">{item[0]}</span>
                {item}
              </span>
              <span
                className="remove-icon"
                onClick={() => {
                  const newTags = [...tags];
                  newTags.splice(index, 1);
                  setTags(newTags);
                }}
              >
                x
              </span>
            </span>
          ))}
          <div
            contentEditable="true"
            onInput={(e) => {
              setInput(e.target.innerText);
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                if (highlightLastTag) {
                  const newTags = [...tags];
                  newTags.splice(newTags.length - 1, 1);
                  setTags(newTags);
                  setHighlightLastTag(false);
                } else setHighlightLastTag(true);
              }
            }}
            ref={editableDiv}
          ></div>
        </div>
        {onFocus && (
          <ul className="list">
            {dataList
              .filter((item) => !tags.includes(item))
              .map((item, index) => (
                <li
                  className="item"
                  key={index}
                  // Using onMouseDown instead of onClick to prevent the div from losing focus
                  onMouseDown={(e) => {
                    // Prevents the div from losing focus when clicking on the list
                    e.stopPropagation();
                    setTags([...tags, item]);
                    setHighlightLastTag(false);
                    setInput("");
                    editableDiv.current.innerText = "";
                  }}
                >
                  <span className="icon">{item[0]}</span>
                  {item}
                </li>
              ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
