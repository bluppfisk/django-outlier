from django.test import TestCase
from .models import AltChar, Source, Char


class altCharTestCase(TestCase):
    def setUp(self):
        self.altchar = AltChar(
            name="name",
            canonical=Char(name="char"),
            sequence_no=1,
            source_obj="source_obj",
            source=Source(title="source"),
            page=20,
            image="image"
        )

    def test_get_filename(self):
        filename = "{}-evolution-{}-{}-{}-{}.png".format(
            self.altchar.canonical.name,
            self.altchar.sequence_no,
            self.altchar.source.title,
            self.altchar.page,
            self.altchar.source_obj
        )
        self.assertEqual(self.altchar.get_filename(), "char-evolution-1-source-20-source_obj.png")

    def test_get_filename_safe(self):
        self.altchar.canonical.name = "\"\\{總是.-31|#找朱先生請"
        self.assertEqual(self.altchar.get_filename(), "總是.-31找朱先生請-evolution-1-source-20-source_obj.png")
