"use strict";

function inline_formatting(line) {
    // Ссылки
    line = line.replace(/\[([^\]]+)\]\(([^)]+)(?: \"([^\"]*)\")?\)/gim, '<a href="$2" title="$3">$1</a>');

    // Жирный и курсивный текст
    line = line.replace(/\*\*(.+?)\*\*/gim, '<strong>$1</strong>');
    line = line.replace(/\*(.+?)\*/gim, '<em>$1</em>');
    line = line.replace(/__(.+?)__/gim, '<strong>$1</strong>');
    line = line.replace(/_(.+?)_/gim, '<em>$1</em>');

    // Внутристрочный код
    line = line.replace(/`([^`]+)`/gim, '<code>$1</code>');
    return line;
}

function formatText(text) {
    // Разбиваем текст на абзацы по \n (или нескольким \n)
    const paragraphs = text.split(/\n+/);

    let isCodeBlock = false;
    let result = [];
    let listType = null;
    let codeLang = "";

    paragraphs.forEach(line => {
        let codeBlockMatch = line.match(/^```\s*(\w+)?/);
        if (codeBlockMatch) {
            if (isCodeBlock) {
                result.push('</code></pre>');
            } else {
                codeLang = codeBlockMatch[1] ? `language-${codeBlockMatch[1]}` : "";
                result.push(`<pre><code class="${codeLang}">`);
            }
            isCodeBlock = !isCodeBlock;
            return;
        }

        if (isCodeBlock) {
            result.push(line);
            return;
        }

        // Закрываем список перед началом нового блока
        if (listType && !/^\s*[-*\d+\.]/.test(line)) {
            result.push(`</${listType}>`);
            listType = null;
        }

        // Заголовки
        if (/^### (.*)/.test(line)) {
            result.push(line.replace(/^### (.*)/, (match, p1) => `<h3>${inline_formatting(p1)}</h3>`));
            return;
        }
        if (/^## (.*)/.test(line)) {
            result.push(line.replace(/^## (.*)/, (match, p1) => `<h2>${inline_formatting(p1)}</h2>`));
            return;
        }
        if (/^# (.*)/.test(line)) {
            result.push(line.replace(/^# (.*)/, (match, p1) => `<h1>${inline_formatting(p1)}</h1>`));
            return;
        }

        // Цитаты
        if (/^> (.*)/.test(line)) {
            result.push(line.replace(/^> (.*)/, (match, p1) => `<blockquote>${inline_formatting(p1)}</blockquote>`));
            return;
        }

        // Горизонтальные разделители
        if (/^(\*{3,}|-{3,}|={3,})$/.test(line)) {
            result.push('<hr>');
            return;
        }

        // Маркированные и нумерованные списки
        if (/^\* (.*)/.test(line) || /^- (.*)/.test(line)) {
            if (listType !== 'ul') {
                result.push('<ul>');
                listType = 'ul';
            }
            result.push(line.replace(/^[-*] (.*)/, (match, p1) => `<li>${inline_formatting(p1)}</li>`));
            return;
        }
        if (/^\d+\. (.*)/.test(line)) {
            if (listType !== 'ol') {
                result.push('<ol>');
                listType = 'ol';
            }
            result.push(line.replace(/^\d+\. (.*)/, (match, p1) => `<li>${inline_formatting(p1)}</li>`));
            return;
        }

        result.push(`<p>${inline_formatting(line)}</p>`);
    });

    if (listType) {
        result.push(`</${listType}>`);
    }

    return result.join('\n');
}
