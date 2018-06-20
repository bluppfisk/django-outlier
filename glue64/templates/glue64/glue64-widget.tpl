{% load static %}
<div class="glue64">
  <input class="glue64_input" type="hidden" value="{{ filename }}" id="{{ element_id }}" name="{{ name }}" />
  <div class="glue64_target">
  	{% if image_url %}
  		<img src="{{ image_url }}" class="glue64_preview">
  	{% else %}
  		<img src="{% static 'glue64/img/pastehere.png' %}" class="glue64_preview">
  	{% endif %}
  </div>
</div>
