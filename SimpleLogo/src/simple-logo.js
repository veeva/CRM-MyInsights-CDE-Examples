const template = document.createElement('template');
template.innerHTML = `
<div id="imageContainer">
</div>
`

/**
 * @prop {string} imageWidth?
 * @prop {string} imageHeight?
 */
class SimpleLogo extends HTMLElement {
    #width = 0;
    #height = 0;
    #imageData = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.#width = this.imageWidth;
        this.#height = this.imageHeight;

        // Uploaded CDEs cannot contain additional source, data, or image files
        // Load the image as a base64 string instead
        this.#imageData = 'data:image/png;base64,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';
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.#update();
    }

    set imageWidth(newWidth) {
        this.#width = newWidth;
        this.#update();
    }

    set imageHeight(newHeight) {
        this.#height = newHeight;
        this.#update();
    }

    #update() {
        let widthString = (this.#width > 0) ? `width="${this.#width}px"` : "";
        let heightString = (this.#height > 0) ? `height="${this.#height}px"` : "";

        this.#updateTemplate(
            "imageContainer",
            `<img ${widthString} ${heightString} src="${this.#imageData}" />`
        );
    }

    #updateTemplate(id, value) {
        if (this.shadowRoot.getElementById(id)) {
            this.shadowRoot.getElementById(id).innerHTML = value;
        }
    }
}


customElements.define('simple-logo', SimpleLogo);