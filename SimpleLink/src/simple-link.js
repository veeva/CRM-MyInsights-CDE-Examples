const template = document.createElement('template');
template.innerHTML = `
<div>
    <span id="linkContainer"></span>
</div>
`

/**
 * @prop {string} linkURL
 * @prop {string} diplayText
 */
class SimpleLink extends HTMLElement {
    #url = "";
    #display = "";

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.#url = this.linkURL;
        this.#display = this.diplayText;
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.#update();
    }

    set linkURL(newURL) {
        this.#url = newURL;
        this.#update();
    }

    set displayText(newDisplay) {
        this.#display = newDisplay;
        this.#update();
    }

    #update() {
        this.#updateSpan(
            "linkContainer",
            `<a href="${this.#url}" style="line-height: 1.5; text-decoration: none">${this.#display}</a>`
        );
    }

    #updateSpan(id, value) {
        if (this.shadowRoot.getElementById(id)) {
            this.shadowRoot.getElementById(id).innerHTML = value;
        }
    }
}


customElements.define('simple-link', SimpleLink);