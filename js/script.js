const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        onInput: null,
        onClose: null
    },

    properties: {
        value: "",
        capslock: false
    },

    init() {
        //this is to create div elements in js using DOM structure
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // this is used to add classname to DOM structure
        this.elements.main.classList.add("keyboard","keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard-keys");
        this.elements.keysContainer.appendChild(this.createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard-key");
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus",() => {
                this.open(element.value,currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1","2","3","4","5","6","7","8","9","0","backspace",
            "q","w","e","r","t","y","u","i","o","p",
            "caps","a","s","d","f","g","h","j","k","l","enter",
            "done","z","x","c","v","b","n","m",",",".","?",
            "space"
        ];

        const createIconHTML = (iconName) => {
            return `<i class="material-icons">${iconName}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace","p","enter","?"].indexOf(key) !== -1;
            keyElement.setAttribute("type","button");
            keyElement.classList.add("keyboard-key");
            switch(key) {
                case "backspace" : 
                    keyElement.classList.add("keyboard-key-wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    keyElement.addEventListener("click",() => {
                        this.properties.value = this.properties.value.substring(0,this.properties.value.length-1);
                        this.triggerEvent("onInput");
                    });
                    break;
                case "caps" : 
                    keyElement.classList.add("keyboard-key-wide","keyboard-key-activable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    keyElement.addEventListener("click",() => {
                        this.toggleCapsLock();
                        keyElement.classList.toggle("keyboard-key-active",this.properties.capslock);
                    });
                    break;
                case "enter" : 
                    keyElement.classList.add("keyboard-key-wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    keyElement.addEventListener("click",() => {
                        this.properties.value += "\n";
                        this.triggerEvent("onInput");
                    });
                    break;
                case "space" : 
                    keyElement.classList.add("keyboard-key-extra-wide");
                    keyElement.innerHTML = createIconHTML("space_back");
                    keyElement.addEventListener("click",() => {
                        this.properties.value += " ";
                        this.triggerEvent("onInput");
                    });
                    break;
                case "done" : 
                    keyElement.classList.add("keyboard-key-wide","keyboard-key-dark");
                    keyElement.innerHTML = createIconHTML("check_circle");
                    keyElement.addEventListener("click",() => {
                        this.close();
                        this.triggerEvent("onClose");
                    });
                    break;
                default :  
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener("click",() => {
                        this.properties.value += this.properties.capslock?key.toUpperCase() : key.toLowerCase();
                        this.triggerEvent("onInput");
                    });
                    break;
            }
            fragment.appendChild(keyElement);
            if(insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });
    },

    triggerEvent(handlerName) {
        if(typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },
    
    toggleCapsLock() {
        this.properties.capslock = !this.properties.capslock;
        for(const key of this.elements.keys) {
            if(key.childElementCount === 0) {
                key.textContent = this.properties.capslock?key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue,onInput,onClose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.onInput = onInput;
        this.eventHandlers.onClose = onClose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.onInput = onInput;
        this.eventHandlers.onClose = onClose;
        this.elements.main.classList.add("keyboard--hidden");
    },
};

window.addEventListener("DOMContentLoaded",function() {
    Keyboard.init();
});
