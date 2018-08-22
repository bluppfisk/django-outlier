    const pasteHandler = function(event) {
        const element     = event.target.parentElement.parentElement,
              preview     = element.querySelector('.glue64_preview'),
              input       = element.querySelector('.glue64_input');

        for (var i = 0 ; i < event.clipboardData.items.length ; i++) {
            var item = event.clipboardData.items[i];
            console.log(item);
            if (item.type.indexOf("image") != -1) {
              var blob = item.getAsFile();
            } else {
                console.log("Discarding non-image paste data");
            }

            if (blob !== null) {
              var reader = new FileReader();
              reader.onload = function(event) {
                var data = event.target.result;
                preview.setAttribute('src', data);
                input.value = data;
              }
              reader.readAsDataURL(blob);
            }
        }
    };

    const highlightHandler = function (event) {
        const pasteTargets = document.querySelectorAll('.glue64_target');

        pasteTargets.forEach((e) => {
          e.style.border = '2px dashed black';
        });

        event.target.style.border = "2px dashed red";
    }

    const addHandlers = function (el) {
        console.log('Adding glue64 handlers…');
        const paste = el.querySelector('.glue64_target');
        paste.addEventListener('click', highlightHandler, false)
        paste.addEventListener('paste', pasteHandler, false)
    };

    document.addEventListener('DOMContentLoaded', function(event) {
        [].forEach.call(document.querySelectorAll('.glue64'), addHandlers)
    });

    document.addEventListener('DOMNodeInserted', function(event){
        if(event.target.tagName) {
            const el = event.target.querySelectorAll('.glue64_target');
            [].forEach.call(el, function (element, index, array) {
                addHandlers(element);
            });
        }
    })