import unittest
from html.parser import HTMLParser
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CONTACT_EMAIL = "shenghez.zheng@gmail.com"


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self._current_link = None

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self._current_link = {"attrs": dict(attrs), "text": []}

    def handle_data(self, data):
        if self._current_link is not None:
            self._current_link["text"].append(data)

    def handle_endtag(self, tag):
        if tag == "a" and self._current_link is not None:
            self._current_link["text"] = " ".join(
                " ".join(self._current_link["text"]).split()
            )
            self.links.append(self._current_link)
            self._current_link = None


class ContactCalloutTest(unittest.TestCase):
    def test_page_exposes_visible_email_link(self):
        parser = LinkParser()
        parser.feed((PROJECT_ROOT / "index.html").read_text(encoding="utf-8"))

        matching_links = [
            link
            for link in parser.links
            if link["attrs"].get("href") == f"mailto:{CONTACT_EMAIL}"
        ]

        self.assertEqual(len(matching_links), 1, "contact mailto link is missing")
        self.assertIn(CONTACT_EMAIL, matching_links[0]["text"])


if __name__ == "__main__":
    unittest.main()
