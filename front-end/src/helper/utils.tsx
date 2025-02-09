import React from "react";
import {convertToTable, processText} from "./text-manipulation-tool";


export const scrollToBottom = (container: HTMLElement) => {
    if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
};

export const letterInitCalc = (
    data: string,
    botMessageDiv: HTMLElement | null,
    chatContainerRef: React.RefObject<HTMLElement>,
    atTheEnd: () => void,
    stopTypingRef: React.RefObject<boolean>,
) => {
    data = data.replaceAll(/(?:\r\n|\r)/g, '\n');

    if (botMessageDiv) {
        botMessageDiv.innerHTML = "";
        let index = 0;
        requestAnimationFrame(() => addLetter(data, botMessageDiv, chatContainerRef.current, index, stopTypingRef, atTheEnd));
    }
};

export const addLetter = (
    data: string,
    botMessageDiv: HTMLElement,
    container: HTMLElement | null,
    index: number,
    stopTypingRef: React.RefObject<boolean>,
    atTheEnd: () => void
) => {
    if (stopTypingRef.current) {
        return;
    }
    if (index < data.length) {
        let char = data[index];

        if (char === "*" && data[index + 1] === "*") {
            botMessageDiv.innerHTML += "<strong>";
            index += 2;
            while (index < data.length && !(data[index] === "*" && data[index + 1] === "*")) {
                char = data[index];
                botMessageDiv.innerHTML += char;
                index++;
            }
            botMessageDiv.innerHTML += "</strong>";
            index += 2;

        } else if (char === "*") {
            index++;
            let listItemText = "";

            while (index < data.length && data[index] !== "\n" && data[index] !== "*") {
                char = data[index];
                listItemText += char;
                index++;
            }

            if (listItemText.trim()) {
                botMessageDiv.innerHTML += `<ul><li>${listItemText.trim()}</li></ul>`;
            }

        } else if (char === "\n") {
            botMessageDiv.innerHTML += "<br>";
        } else {
            botMessageDiv.innerHTML += char;
        }

        if (container) {
            scrollToBottom(container as HTMLElement);
        }

        index++;
        requestAnimationFrame(() => addLetter(data, botMessageDiv, container, index, stopTypingRef, atTheEnd));
    } else {
        atTheEnd();
    }
};

export const formatMessageContent = (data: string): string => {
    return processText(data);
};
