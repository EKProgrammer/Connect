from markdown.extensions import Extension
from markdown.preprocessors import Preprocessor
import re


class CodeHeaderExtension(Extension):
    def extendMarkdown(self, md):
        md.preprocessors.register(CodeHeaderPreprocessor(md), 'code_header', 25)


class CodeHeaderPreprocessor(Preprocessor):
    CODE_BLOCK_RE = re.compile(r'```\s*(\w*)\n(.*?)\n```', re.DOTALL)

    def run(self, lines):
        text = "\n".join(lines)
        result = self.CODE_BLOCK_RE.sub(self._add_header, text)
        return result.split("\n")

    def _add_header(self, match):
        lang = match.group(1) if match.group(1) else "code"
        code_block = match.group(2)
        header = f'''
<div class="code-header">
    <span class="lang-name">{lang}</span>
    <button class="copy-code" title="Копировать">
        <img src="/static/main/img/copy_code.svg" alt="Копировать">
    </button>
</div>
'''
        return f'{header}\n<pre class="codehilite"><code class="language-{lang} hljs">{code_block}</code></pre>'
