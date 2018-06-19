from django.db.models import Field
from django.conf import settings
from glue64.widgets import Glue64Widget


class Glue64Field(Field):
    def __init__(self, *args, **kwargs):
        self.widget = Glue64Widget()
        super(Glue64Field, self).__init__(*args, **kwargs)

    def get_internal_type(self):
        return 'TextField'

    def formfield(self, *args, **kwargs):
        kwargs['widget'] = self.widget
        return super(Glue64Field, self).formfield(*args, **kwargs)


if 'south' in settings.INSTALLED_APPS:
    from south.modelsinspector import add_introspection_rules
    add_introspection_rules([], ["^glue64\.fields\.Glue64Field"])
