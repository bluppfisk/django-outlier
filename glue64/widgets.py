from __future__ import unicode_literals

import os
from django.forms import widgets
from django.utils.safestring import mark_safe
from django.template.loader import render_to_string


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
        super(Glue64Widget, self).__init__(*args, **kwargs)

    def render(self, name, value, attrs=None, **kwargs):
        tpl = os.path.join('glue64', 'glue64-widget.tpl')
        print(value)
        output = render_to_string(tpl, {
            'element_id': self.build_attrs(attrs).get('id', '') if attrs else '',
            'base_data': value or '',
            'name': name,
            'style': self.build_attrs(attrs).get('style', '') if attrs else '',
        })

        return mark_safe(output)
