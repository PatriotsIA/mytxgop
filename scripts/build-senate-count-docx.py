"""Build an editable Word letter from the exact source, using only Python's stdlib."""

from pathlib import Path
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/data/senate-count-template.txt"
OUTPUT = ROOT / "public/forms/Senate_Manual_Count_Request_Template.docx"
WORD_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
paragraphs = SOURCE.read_text(encoding="utf-8").strip().split("\n\n")


def paragraph(text, index):
    page_break = "<w:pageBreakBefore/>" if index == 12 else ""
    bold = "<w:b/>" if index == 0 or text.startswith("Re:") else ""
    return (
        f"<w:p><w:pPr>{page_break}</w:pPr><w:r><w:rPr>{bold}</w:rPr>"
        f'<w:t xml:space="preserve">{escape(text)}</w:t></w:r></w:p>'
    )


files = {
    "[Content_Types].xml": '''<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
      <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
      <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
    </Types>''',
    "_rels/.rels": '''<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
      <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
    </Relationships>''',
    "word/_rels/document.xml.rels": '''<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
    </Relationships>''',
    "docProps/core.xml": '''<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:title>U.S. Senate Manual Count Request Template</dc:title>
      <dc:creator>My Local GOP</dc:creator>
    </cp:coreProperties>''',
    "word/styles.xml": f'''<w:styles xmlns:w="{WORD_NS}">
      <w:docDefaults><w:rPrDefault><w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="23"/><w:szCs w:val="23"/><w:lang w:val="en-US"/>
      </w:rPr></w:rPrDefault><w:pPrDefault><w:pPr>
        <w:spacing w:after="220" w:line="336" w:lineRule="auto"/><w:widowControl/>
      </w:pPr></w:pPrDefault></w:docDefaults>
      <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
    </w:styles>''',
    "word/document.xml": f'''<w:document xmlns:w="{WORD_NS}"><w:body>
      {''.join(paragraph(text, index) for index, text in enumerate(paragraphs))}
      <w:sectPr><w:pgSz w:w="12240" w:h="15840"/>
        <w:pgMar w:top="936" w:right="1080" w:bottom="936" w:left="1080" w:header="0" w:footer="0" w:gutter="0"/>
      </w:sectPr>
    </w:body></w:document>''',
}

with ZipFile(OUTPUT, "w", compression=ZIP_DEFLATED) as archive:
    for name, content in files.items():
        ET.fromstring(content)
        archive.writestr(name, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + content)

with ZipFile(OUTPUT) as archive:
    assert archive.testzip() is None
    document = ET.fromstring(archive.read("word/document.xml"))
    extracted = ["".join(p.itertext()) for p in document.findall(f".//{{{WORD_NS}}}p")]
    assert extracted == paragraphs, "Word document differs from Dan's supplied letter"
    assert not document.findall(f".//{{{WORD_NS}}}documentProtection"), "Letter must remain editable"

print("Word document matches Dan’s letter exactly. Chair notes are excluded.")
