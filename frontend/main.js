import "./style.css";
const dialog = document.querySelector(".dialog");
const guesses = document.querySelector(".guesses div");
const hint = document.querySelector(".hint");
const hintBtn = document.querySelector("input[type=button]");
const form = document.querySelector("form");

const quotes = [];
const characterLetters = ["X", "Y", "Z", "M", "N", "O", "P"];
let answered = false;

function findAll(sourceStr, searchStr) {
    return [...sourceStr.matchAll(new RegExp(searchStr, "gi"))].map(
        (a) => a.index
    );
}

function sanitizeQuotes(data) {
    data.map((quote) => {
        const speakers = [];
        quote.lines.map((line) => {
            if (line.hasSpeaker && !speakers.includes(line.speaker)) {
                speakers.push(line.speaker);
            }
            const letterIndex = speakers.indexOf(line.speaker);
            line.characterLetter = characterLetters[letterIndex];
        });
        quote.speakers = speakers;

        const splitNames = [...speakers];
        speakers.forEach((speaker) => splitNames.push(...speaker.split(" ")));
        quote.lines.map((line) => {
            line.replacements = [];
            line.replacementDexies = [];
            splitNames.forEach((name) => {
                if (line.text.includes(name)) {
                    let letter = "";
                    speakers.forEach((speaker, i) =>
                        speaker.includes(name)
                            ? (letter = characterLetters[i])
                            : letter
                    );
                    line.text = line.text.replace(name, letter);
                    line.replacementDexies.push(findAll(line.text, letter));
                    line.replacements.push(name);
                }
            });
        });
    });
    return data; //not really necessary because arrays are passed by reference
}

async function getQuotes() {
    const res = await fetch("http://localhost:3000/getQuotes");
    let data = await res.json();
    sanitizeQuotes(data);
    quotes.push(...data);
}

async function renderQuotes() {
    if (quotes.length === 0) {
        await getQuotes();
    }
    const quote = quotes[quotes.length - 1];
    console.log(quote);
    quote.lines.forEach((line) => {
        const div = document.createElement("div");
        div.classList.add("line");
        const p = document.createElement("p");
        p.classList.add("quote");
        p.textContent = line.text;
        const tag = document.createElement("p");
        tag.classList.add("tag");
        if (!line.hasSpeaker) {
            div.appendChild(tag);
            div.appendChild(p);
            dialog.appendChild(div);
            return;
        }
        tag.textContent = line.characterLetter;
        div.appendChild(tag);
        div.appendChild(p);
        dialog.appendChild(div);
    });
}

function renderInputs() {
    const quote = quotes[quotes.length - 1];
    quote.speakers.forEach((speaker, i) => {
        const field = document.createElement("div");
        field.classList.add("field");
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `character ${characterLetters[i]}`;
        field.appendChild(input);
        guesses.appendChild(field);
    });
}

await renderQuotes();
renderInputs();

form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(event);
    if (!answered) {
        const quote = quotes.pop();
        for (let i = 0; i < quote.speakers.length; i++) {
            const input = event.target[i + ""];
            if (input.value.toLowerCase() === quote.speakers[i].toLowerCase()) {
                input.classList.add("correct");
                input.insertAdjacentHTML(
                    "afterend",
                    "<span class='correct'>✓</span>"
                );
            } else {
                input.classList.add("wrong");
                input.insertAdjacentHTML(
                    "afterend",
                    "<span class='wrong'>x</span>"
                );
            }
        }
        event.submitter.value = "Next";
        answered = true;
        return;
    }
    event.submitter.value = "Answer";
    dialog.innerHTML = "";
    guesses.innerHTML = "";
    hint.classList.remove("fadeInFromTop");
    renderQuotes();
    renderInputs();
    answered = false;
});

hintBtn.addEventListener("click", () => {
    console.log("run");
    hint.classList.add("fadeInFromTop");
});

// Reveling of Characters
//Auto Complete
//
