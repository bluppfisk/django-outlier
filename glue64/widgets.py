from __future__ import unicode_literals

import os
from django.forms import widgets
from django.utils.safestring import mark_safe
from django.template.loader import render_to_string
from django.conf import settings

class Glue64Widget(widgets.TextInput):
    class Media:
        js = (
            'glue64/js/glue64.js',
        )
        css = {
            'all': (
                'glue64/css/glue64.css',
            )
        }
        img = {
            'pastehere': (
                'glue64/img/pastehere.png',
            )
        }

    def __init__(self, *args, **kwargs):
        self.dest = kwargs.pop('dest', None)
        super(Glue64Widget, self).__init__(*args, **kwargs)

    def render(self, name, value, attrs=None, **kwargs):
        image_url = "{}/{}/{}".format(
            settings.AWS_ACCESS_URL, settings.AWS_STORAGE_BUCKET_NAME, self.dest + value
        ) if value else None
        tpl = os.path.join('glue64', 'glue64-widget.tpl')
        output = render_to_string(tpl, {
            'element_id': self.build_attrs(attrs).get('id', '') if attrs else '',
            'filename': value or '',
            'image_url': image_url,
            'name': name,
        })

        return mark_safe(output)
