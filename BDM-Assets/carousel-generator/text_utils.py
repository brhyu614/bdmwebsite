"""Markup parsing utilities for carousel text."""
import re


def format_title(text: str) -> str:
    """Convert **bold** → <strong>, {{hl}} → <span class="acc">, \\n → <br>."""
    text = text.replace("\\n", "\n")
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"\{\{(.+?)\}\}", r'<span class="acc">\1</span>', text)
    text = text.replace("\n", "<br>")
    return text


def format_body(text: str) -> str:
    """Convert **bold** → <strong>, {{hl}} → <span class="hl">, \\n → <br>."""
    text = text.replace("\\n", "\n")
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"\{\{(.+?)\}\}", r'<span class="hl">\1</span>', text)
    text = text.replace("\n", "<br>")
    return text


def extract_keyword(tag: str, heading: str) -> str:
    """Extract English search keyword from tag + heading for Pexels query."""
    # Strip markup
    clean = re.sub(r"\*\*|{{|}}", "", heading)
    clean = clean.replace("\\n", " ").replace("\n", " ")
    # Extract English words
    eng_words = re.findall(r"[A-Za-z]{3,}", clean)
    if eng_words:
        return " ".join(eng_words[:3])
    # Use tag as fallback
    tag_clean = re.sub(r"[^A-Za-z\s]", "", tag).strip()
    if tag_clean:
        return tag_clean.lower()
    # Korean fallback: map common topics
    return "abstract technology"
