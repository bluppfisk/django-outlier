{% load static %}
<div class="glue64">
  <input class="glue64_input" type="hidden" value="{{ base_data }}" id="{{ element_id }}" name="{{ name }}" />
  <div class="glue64_target">
  	{% if base_data %}
  		<img src="{{ base_data }}" class="glue64_preview">
  	{% else %}
  		<img src="{% static 'glue64/img/pastehere.png' %}" class="glue64_preview">
  	{% endif %}
  </div>
</div>
