// ImHUI.js

const ImHUI = (function() {
    let currentWindow = null;
    let zIndex = 1000;

    function createDraggableElement(title) {
        const el = document.createElement('div');
        el.className = 'imhui-window';
        el.style.position = 'absolute';
        el.style.top = '50px';
        el.style.left = '50px';
        el.style.minWidth = '200px';
        el.style.minHeight = '100px';
        el.style.backgroundColor = '#3c3c3c';
        el.style.color = '#f0f0f0';
        el.style.fontFamily = 'Arial, sans-serif';
        el.style.borderRadius = '3px';
        el.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
        el.style.zIndex = zIndex++;

        const titleBar = document.createElement('div');
        titleBar.className = 'imhui-titlebar';
        titleBar.style.padding = '5px';
        titleBar.style.backgroundColor = '#1e1e1e';
        titleBar.style.cursor = 'move';
        titleBar.textContent = title;

        el.appendChild(titleBar);

        const content = document.createElement('div');
        content.className = 'imhui-content';
        content.style.padding = '10px';

        el.appendChild(content);

        makeDraggable(el, titleBar);

        return el;
    }

    function makeDraggable(el, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            el.style.zIndex = zIndex++;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    return {
        begin: function(title) {
            if (currentWindow) {
                console.error('ImHUI: Cannot begin a new window before ending the previous one.');
                return;
            }
            currentWindow = createDraggableElement(title);
            document.body.appendChild(currentWindow);
        },

        end: function() {
            currentWindow = null;
        },

        button: function(label) {
            if (!currentWindow) {
                console.error('ImHUI: Cannot create button outside of a window.');
                return false;
            }
            const button = document.createElement('button');
            button.textContent = label;
            button.style.margin = '5px';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#4CAF50';
            button.style.border = 'none';
            button.style.color = 'white';
            button.style.cursor = 'pointer';

            const content = currentWindow.querySelector('.imhui-content');
            content.appendChild(button);

            return new Promise(resolve => {
                button.onclick = () => resolve(true);
            });
        },

        slider: function(label, value, min, max) {
            if (!currentWindow) {
                console.error('ImHUI: Cannot create slider outside of a window.');
                return value;
            }
            const container = document.createElement('div');
            container.style.margin = '5px 0';

            const labelEl = document.createElement('label');
            labelEl.textContent = label;
            container.appendChild(labelEl);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = min;
            slider.max = max;
            slider.value = value;
            slider.style.width = '100%';
            container.appendChild(slider);

            const valueDisplay = document.createElement('span');
            valueDisplay.textContent = value;
            valueDisplay.style.marginLeft = '10px';
            container.appendChild(valueDisplay);

            const content = currentWindow.querySelector('.imhui-content');
            content.appendChild(container);

            return new Promise(resolve => {
                slider.oninput = () => {
                    valueDisplay.textContent = slider.value;
                    resolve(Number(slider.value));
                };
            });
        },

        text: function(text) {
            if (!currentWindow) {
                console.error('ImHUI: Cannot add text outside of a window.');
                return;
            }
            const p = document.createElement('p');
            p.textContent = text;
            p.style.margin = '5px 0';

            const content = currentWindow.querySelector('.imhui-content');
            content.appendChild(p);
        }
    };
})();
