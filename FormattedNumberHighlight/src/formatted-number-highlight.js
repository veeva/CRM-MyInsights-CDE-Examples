const formattedNumberHighlightTemplate = document.createElement('template');
formattedNumberHighlightTemplate.innerHTML = `
<div style="margin: 1px">
    <div style="color: #3e3e3c; font-size: .75rem;">
        <span id="title"></span>
    </div>
    <div style="font-weight: 300; font-size: 1.75rem; line-height: 1.25;">
        <span id="value"></span>
    </div>
</div>
`

/**
 * @prop {string} title
 * @prop {number} value
 * @prop {string} currencyCode?
 */
class FormattedNumberHighlight extends HTMLElement {
    #title = "";
    #value = undefined;
    #currencyCode = undefined;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.#title = this.title;
        this.#value = this.value;
        this.#currencyCode = this.currencyCode;
    }

    connectedCallback() {
        this.shadowRoot.appendChild(formattedNumberHighlightTemplate.content.cloneNode(true));
        this.#update();
    }

    set title(newTitle) {
        this.#title = newTitle;
        this.#update();
    }

    set value(newValue) {
        this.#value = newValue;
        this.#update();
    }

    set currencyCode(newCurrencyCode) {
        this.#currencyCode = newCurrencyCode;
        this.#update();
    }

    #update() {
        const formatOptions = {};
        if (!!this.#currencyCode) {
            formatOptions.style = "currency";
            formatOptions.currency = this.#currencyCode
        }
        let formatter;
        try {
            formatter = new Intl.NumberFormat(undefined, formatOptions);
        } catch (error) {
            formatter = new Intl.NumberFormat();
        }
        const formattedValue = formatter.format(this.#value);

        this.#updateSpan("title", this.#title);
        this.#updateSpan("value", formattedValue);
    }

    #updateSpan(id, value) {
        if (this.shadowRoot.getElementById(id)) {
            this.shadowRoot.getElementById(id).innerHTML = value;
        }
    }

}


customElements.define('formattednumber-highlight', FormattedNumberHighlight);