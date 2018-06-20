from django.db.models import Field
from django.conf import settings
from glue64.widgets import Glue64Widget


class Glue64Field(Field):
    def __init__(self, *args, **kwargs):
        dest = kwargs.pop('dest', None)
        self.widget = Glue64Widget(dest=dest)
        super(Glue64Field, self).__init__(*args, **kwargs)

    def get_internal_type(self):
        return 'TextField'

    def formfield(self, *args, **kwargs):
        kwargs['widget'] = self.widget
        return super(Glue64Field, self).formfield(*args, **kwargs)
