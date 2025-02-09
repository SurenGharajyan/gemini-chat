export const processText = (data: string): string => {
    let formattedContent = "";
    let index = 0;

    while (index < data.length) {
        let char = data[index];

        if (char === "*" && data[index + 1] === "*") {
            formattedContent += "<strong>";
            index += 2; // Skip over '**'
            while (index < data.length && !(data[index] === "*" && data[index + 1] === "*")) {
                char = data[index];
                formattedContent += char;
                index++;
            }
            formattedContent += "</strong>";
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
                formattedContent += `<ul><li>${listItemText.trim()}</li></ul>`;
            }

        } else if (char === "\n") {
            formattedContent += "<br>";
        } else {
            formattedContent += char;
        }

        index++;
    }

    return formattedContent;
};

export const convertToTable = (data: string): string => {
    const lines = data.split('\n');
    let tableHtml = '<table><thead><tr>';

    // Extract headers
    const headers = lines[1].split('|').map(header => header.trim());
    headers.forEach(header => {
        tableHtml += `<th>${header}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    // Extract rows
    for (let i = 3; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        const cells = lines[i].split('|').map(cell => cell.trim());
        tableHtml += '<tr>';
        cells.forEach(cell => {
            tableHtml += `<td>${cell}</td>`;
        });
        tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table>';

    return tableHtml;
};

export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
