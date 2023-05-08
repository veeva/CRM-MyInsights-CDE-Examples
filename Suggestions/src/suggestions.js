const template = document.createElement('template');
template.innerHTML = `
<style>
* {
  box-sizing: border-box;
  font-family: sans-serif;
}

.rootDiv {
    min-width: 240px;
    min-height: 120px;
    background-color: #fff;
    padding: 8px;
    z-index: 0;
}

.modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transform: scale(1.1);
    transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
    z-index: 1;
}

.modal-content {
    position: absolute;
    justify-content: center;
    display: flex;
    flex-direction: column;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 1rem 1.5rem;
    width: 40rem;
    border-radius: 0.5rem;
    min-height: 240px;
    z-index: 3;
}

.modal-body p {
    font-size: 0.9rem;
    color: #111;
    margin: 0 0 0.2rem;
}

.modal-title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #000;
}

.modal-footer {
    display: flex;
    margin-top: auto;
}

.modal-footer-cell {
    display: flex;
    flex: auto;
    justify-content: center;
    align-items: center;
}

button {
    cursor: pointer;
    border: none;
    font-weight: 600;
}

.btn {
    display: inline-block;
    padding: 0.8rem 1.4rem;
    font-weight: 700;
    background-color: blue;
    color: white;
    border-radius: 5px;
    text-align: center;
    font-size: 1em;
}

.btn-open {
    position: absolute;
    bottom: 150px;
}

.btn-close {
    transform: translate(10px, -20px);
    padding: 0.5rem 0.7rem;
    background: #eee;
    border-radius: 50%;
    margin-top: 16px;
}

.hidden {
  display: none;
}

ul {
    display: block;
    list-style-image: none;
    list-style-position: outside;
    list-style-type: none;

}

li {
    border-bottom: 2px solid #DDD;
    box-sizing: border-box;
    display: list-item;
    text-align: left;
    align-items: flex-start;
}

.open-modal-btn {
    cursor: pointer;
    height: 30px;
}

.suggestion-image {
    flex: initial;
    margin: 6px 12px 12px 0px;
}
.suggestion-content {
    flex: auto;
    vertical-align: middle;
}
.suggestion-title {
    font-size: 1.2rem;
    font-weight: 800;
    margin: 4px 0px 6px 0px;
}
.suggestion-desc {
    margin: 0px 0px 6px 0px;
}
.suggestion-button {
    flex: initial;
    margin: 10px 20px 0px 0px;
}
</style>


<div class="rootDiv">
    <div id="suggestions-header">
        <h2 id="header-title">Suggestions</span>
    </div>
    <div id="suggestions-body"></div>

    <section id="modal" class="modal hidden">
        <div id="modal-content" class="modal-content">
            <div style="display: flex;">
                <div style="flex: auto;">
                    <span id="modal-title" class="modal-title">Suggestion Modal</span>
                </div>
                <div style="flex: initial;">
                    <button id="modal-hide-btn" class="btn-close">x</button>
                </div>
            </div>
            <div id="modal-body">
            </div>
            <div class="modal-footer">
                <div class="modal-footer-cell"><button id="dismiss-btn" class="btn">Dismiss</button></div>
                <div class="modal-footer-cell"><button id="mark-complete-btn" class="btn">Mark Complete</button></div>
            </div>
        </div>
    </div>

</div>
`


/**
 * Data input from Studio and associated Suggestion_vod__c fields
Array<{
    id: string,                 // Id
    title: string,              // Title_vod__c
    priority: string,           // Priority_vod__c
    expirationDate: string,     // Expiration_Date_vod__c
    postedDate: string,         // Posted_Date__vod_c
    reason: string,             // Reason_vod__c
    dismissed: number           // Dismissed_vod__c
    actioned: number            // Actioned_vod__c
    markedAsComplete: number    // Marked_As_Complete_vod__c
}>
**/

/**
 * @prop {Array<{id, title, priority, expirationDate, postedDate, reason, dismissed, actioned, markedAsComplete}>} suggestionList
 */
class Suggestions extends HTMLElement {
    #suggestions = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.#suggestions = this.suggestionList;

        this.activeSuggestionId = "";

        this.doneOnce = false;

        // Images encoded as base64
        this.normalPriorityImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAAABAAAAAQAAAAEAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAB6gAwAEAAAAAQAAAB4AAAAALQBmAQAAAAlwSFlzAAAAJwAAACcBKgmRTwAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KGV7hBwAABmJJREFUSA2VVllsVFUY/s+5d9aWtmMttSxKoYi0CRH7AGoItYnRZ037qPEFfUASQykJJHZGwgNTFkWQQGL0xSWUd4RIbExcQpSYSEmQqW2BsJWZKV2ms917/P5zZ7nTRcpJO/c/59/Xc4iecLWFlZdZno0mI89FE/s0+1llPKEYkoswCAork5QSc/FD8Zg+S5NqTAvRqPHXaB6d5mUZi6z5isNhPlMUFnmKQKCzL7G3rHdAScJjKOUpIdwA82heyOC1gAOVFoWVhEJ747HxppRldI71iG9KjEIohmOJFou/plCXpJBZhrFs54PfggwAnI53PCLzw7AQD7TyggymrfS41QlZnUpPWDZFVkQTJ0oCGWDLWzkaQ97be5769mZP3Tk6Da+Zj3Euz5gX1nz8vK/xUYWMRTeFvLx89FZgZTQxujKaPMy0q7BflKeIOK58DDIPeG92fKX8GrVA8c0vCqZk5cjxpv6p5VPS2j6yu25AC8DPmmj8zZyi15WQzQI+4u9fUxg/jvbUXnBolFgbTbwVIN8vQ73V94qyivzF78KKGRv+Ccpfc4oD25Yj8a0pS5y0fMteIoMLHof4F0iWsPIkM1NXgkLtjO2p/43Z9So4UNy6v4srBhX37FBYZNdG42+nDN852wyQnZ7MSVJIH/x1FjbKkIE6U2ZnKEDZrpGe+nMtx2/4YrvWZ9zK3HCRubLkufo4L93CajmS3DytjCt51I+0srOKBHJdZivo5pNZZXgDhp2nag+1xz6qu9KGIhwKt2XdRQd7dXc47cTV2D0gqa1L0dAAZMCJbqdFUpb6zPZXk5ydmEVeA6UYu80HzAYJK5O2A3X+1OyjYzjarpWyAxFOChbLVpAN5QyIohUa6fpZd3iifVqYf9j5LPdpZeu56EqgIAvlZkgpKWjntozsffpyCecGMGBMVrouOvlqivIHkauMgT1M3z/c0/BnxrI7KRAkWqpiGKdI5chf47HSE69A1+Xm/sSmjKJPYXkGQQ4GhblvuLfmFx1qW1q3EYzvLEWWoYRNUj5gA5UQTU6M3Ob+D4x4Mxv/wokVTGlnrXHlMb63lLJMaZi2gC4s7gsxIsQY4NN8oBeHfzfXrSqOxCJmyV+0W46Jx/Y33MXnTAUj5OtQ6zxHBp2rbWhctXweM2MIDZDXmRueI4LM+lj/mUCSjaCRuMEceqTeHVTU2qHo2qCgvg6LPXKqmgUjk5oQP7E2PR7IZ+cvpNMTs0QGWgjT+/EFZgnDY1L60VStoS7dYoF3Ya1rEFGYDxcT1MfEQ97rexvumIJOyKoapkXYOYWLL7SHLX3V5CV15uru+lv04Q0fWmjBMM2XVBgcRfE86K+PJ//Ke6s3iMxMFjHXL5AivvzF3esNmGZ29p8XAw83nXdPrTkymaeyN10Eq/vjXzdHE9sG3xNpvxQ7ZA5vDoIz3KtzF6YB8m9KK0dVkt5npWv6kx2roskvNSkmIC6LCl3lDVcyE2CtPBS/qJTc+II/dJlfICM9oZ9NlT+Fecz1NSd0CDAqWFaFyFS5L2J7QoOspGrmzq9AtK2KJpxbCw8MXcQFo8uKC1W9+lD8EyFk7e3e0Jbzu0RmBe3Qd6rPpFM0O4EC5E7QXrMB7CnaH5FIJTF41EmW295EBo9LPBa2YrtsdTRxkM8pcq30VJqX4+aD9xtH9jfe14R8rfVBCaoeSzT1J69ahrcVk4y7jI3mKyqjvMGAkU39va05tHmgEDX3tbom+uCZ0d7l92AkyHUHzckxECWlXWcN4gcfm4bQCSg3SM3ImiqS/lqPDIYMhFeSrypg1PpICpouKeW0cQsV8qqV8llBKTvl9DFDevGgAAErG3DyrYn7EMwwUdDjfTebTDbjlsqChqmAJlvEZ/w+aQ7rPXvlzAXwIK+8D0f4jOdAac1RjPMiU4mkoAD7TD7fjSS3YzLNYCt1vGyBlxCFiHK/4+yA45XbOzgTnluQ8zwuaytDEBuBxTAd0WhCQDbAtinsDL6xgc0iDfXAj5Z5Hg/N93geT9nikGEeJUqftoWZx/WpZ7udV3kUthdvr+mxEq9TQKXtAsASFIOrC3WFnMet3Ck71NBpp/Jk55znlDQ9ZNR4ScaTF0H5hs4pwrBAyirUl/u44njOpi3CotCs5geByYlOT3bygB5WfJafjpgPH3Z6fMZOzbUEpUz3Hxm+yC4H02KxAAAAAElFTkSuQmCC";
        this.urgentPriorityImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV8/pCIVh1YQccjQOlkQFXHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6uKk6CIl/i8ptIjx4Lgf7+497t4B/maVqWZwHFA1y8ikkkIuvyqEXhFEABHEMSgxU58TxTQ8x9c9fHy9S/As73N/jn6lYDLAJxDPMt2wiDeIpzctnfM+cZSVJYX4nHjMoAsSP3JddvmNc8lhP8+MGtnMPHGUWCh1sdzFrGyoxFPEMUXVKN+fc1nhvMVZrdZZ+578heGCtrLMdZojSGERSxAhQEYdFVRhIUGrRoqJDO0nPfzDjl8kl0yuChg5FlCDCsnxg//B727N4uSEmxROAj0vtv0RB0K7QKth29/Htt06AQLPwJXW8deawMwn6Y2OFjsCBraBi+uOJu8BlzvA0JMuGZIjBWj6i0Xg/Yy+KQ9EboG+Nbe39j5OH4AsdZW+AQ4OgdESZa97vLu3u7d/z7T7+wFDgHKU5wYlegAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAe9JREFUSMftlz9IHEEUxr/Z21u9FdElXqqoKBEFiQieWki2EFFPLA7EKrGTKAiSztJAGgsVAjYqloKFYqJypFADlsErLCSChX+QgAquOe+8/XO7YycYDO7szikBXzkM78eb7828bwilFE8RAp4o/j9w6sMnWf+56xlMvGisVUankLKGIAoHJFygFu8sn7DmEJkr7R8NImWVA1hD1gG9MuoBnOS0Yq26uxppawimXXG7SJHGi9BXZW91ISdgrbSjH7r9BQTyvRsCJA6H9iqn69fcmksr64jBsGf/CQUAm3YhQBa5dfVlTUyG6cy4ypalUa208x0XMP2T7oRDw67FM7N9fI46X1SZ2lUKqHzAaSvEBDbsEB9woRRmvaOZsTnRPzhplrGC9emlOl/glatTQCBv2B9y87UvsNo8UA9KJWawJER8gel5qsvT6AmQmD+N84T3nsC6XXVZ1d3E/FbrS5vIjIy3IGnWeh64BeIxfhsJxfhx7gqsz8eR+Ti5BYK3HIzGNXRHVZKbiQePOjM8EeEEBQAZecKAO40vjF+gOOJmriznu2uNtaLWEkhCDwj8ed8s3VMuNra4eC7tZds2gIa/liPK2Xoity5TDn6769rIYbCtcedxXOar9s8wnSiCwhlkcVDZjx8/Cvj5C+MlbgD8C7X+WZqujgAAAABJRU5ErkJggg==";
        this.chevronRightImg = "data:image/png;base64,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";
    }

    // Standard web component callback that is called when this component is appended into the document
    // In here, load the template content, and set up any internal event handling
    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.#update();
    }

    // Setters
    // These will be called when Studio updates the various inputs
    set suggestionList(sList) {
        this.#suggestions = sList;
        this.#update();
    }

    #handleOpen () {
        let sugg = this.#suggestions.find(s => s.id == this.activeSuggestionId);

        let imageData = (sugg.priority == "Urgent_vod") ? this.urgentPriorityImg : this.normalPriorityImg;

        this.shadowRoot.getElementById("modal-title").innerHTML =`
                <img src="${imageData}" style="vertical-align: middle;" />
                <span style="vertical-align: middle;">${sugg.title}</span>`;

        // Only show these lines if there is text
        let sReason = (sugg.reason != "") ? `<p>${sugg.reason}</p>` : "";

        let postedDate = new Date(Date.parse(sugg.postedDate)).toLocaleDateString("en-US", {day: "numeric", month: "short", year: "numeric"});

        this.shadowRoot.getElementById("modal-body").innerHTML = `
                    ${sReason}
                    <p>Posted on ${postedDate}</p>`;
    
        // Show the modal
        this.shadowRoot.getElementById("modal").classList.remove("hidden");
    }

    #closeModal () {
        this.shadowRoot.getElementById("modal").classList.add("hidden");
    }

    #markCompleteCallback (sId, resp) {
        // Call this when `executeSuggestionAction` finishes
        // If the response indicates success, stop showing the suggestion that was marked complete
        // i.e. remove it from the private suggestion list
        if (resp && resp.success && resp.success === true) {

            this.#suggestions = this.#suggestions.filter(s => s.id != sId);
            
            this.#update();
        }
    }

    #handleMarkComplete (actionType) {
        let id = this.activeSuggestionId;
        console.log(`Applying action ${actionType} to suggestion id# ${id}...`);

        if (window.ds && window.ds.executeSuggestionAction) {

            let self = this;

            window.ds.executeSuggestionAction(id, actionType).then(resp => {
                // console.log(`Completed "executeSuggestionAction", got response: ${resp}`);
                self.#markCompleteCallback(id, resp);
            });

        }

        this.#closeModal();
    }

    #update() {

        // If the connectedCallback hasn't run yet and the component hasn't been loaded, we won't
        // be able to access the elements -- check that we can query the element (and get a non-null result)

        let suggestionElement = this.shadowRoot.getElementById("suggestions-body");

        if (suggestionElement === null)
            return;

        // Start with a blank <li> for a bottom border at the beginning
        let suggHTML = "<ul><li></li>";

        for (let s of this.#suggestions) {

            // Skip suggestions that have been dismissed or completed
            if ((s.dismissed !== null && s.dismissed > 0) || (s.markedAsComplete !== null && s.markedAsComplete > 0)) {
                continue;
            }

            let imageData = (s.priority == "Urgent_vod") ? this.urgentPriorityImg : this.normalPriorityImg;

            let postedDate = new Date(Date.parse(s.postedDate)).toLocaleDateString("en-US", {day: "numeric", month: "short", year: "numeric"});

            let timeToExpiry = Date.parse(s.expirationDate) - Date.now();
            let daysToExpiry = Math.floor(timeToExpiry / (1000 * 60 * 60 * 24));    // ms to days

            let expiryString = `Expires in ${daysToExpiry} days`;
            if (daysToExpiry == 1)
                expiryString = "Expires in 1 day";
            if (daysToExpiry < 0)
                expiryString = `<span style="color: #B00;">Expired ${Math.abs(daysToExpiry)} days ago!</span>`;

            suggHTML += `<li>
                <div style="display: flex;" class="do-open-modal" data-sid="${s.id}">
                    <div class="suggestion-image">
                        <img src="${imageData}" />
                    </div>
                    <div class="suggestion-content">
                        <p class="suggestion-title">${s.title}</p>
                        <p class="suggestion-desc">Posted on ${postedDate} &middot; ${expiryString}</p>
                    </div>
                    <div class="suggestion-button">
                        <img class="do-open-modal open-modal-btn" data-sid="${s.id}" src="${this.chevronRightImg}" />
                    </div>
                </div>
            </li>`;
        }

        suggHTML += "</ul>";


        suggestionElement.innerHTML = suggHTML;

        // After pushing the suggestion list into the DOM, add event handlers for the buttons
        let self = this;

        let buttonList = this.shadowRoot.querySelectorAll(".do-open-modal");

        for (let b of buttonList) {
            b.addEventListener("click", () => {
                self.activeSuggestionId = b.dataset.sid;
                self.#handleOpen();
            });
        }


        // Event handlers -- only run these once
        if (!this.doneOnce) {

            // These still need to be an anonymous function that calls the handler for "this"/scope reasons
            // Otherwise the handler is called with the button itself as the context rather than the whole component

            // Close the modal when clicking outside (or the close button)
            this.shadowRoot.getElementById("modal").addEventListener("click", () => { self.#closeModal() });
            this.shadowRoot.getElementById("modal-hide-btn").addEventListener("click", () => { self.#closeModal() });
            // But prevent clicking inside the modal from bubbling to the background and triggering a close
            this.shadowRoot.getElementById("modal-content").addEventListener("click", (e) => { e.stopPropagation(); });

            this.shadowRoot.getElementById("mark-complete-btn").addEventListener("click", () => { self.#handleMarkComplete("complete") });
            this.shadowRoot.getElementById("dismiss-btn").addEventListener("click", () => { self.#handleMarkComplete("dismiss") });

            this.doneOnce = true;
        }
    }

    #updateSpan(id, value) {
        if (this.shadowRoot.getElementById(id)) {
            this.shadowRoot.getElementById(id).innerHTML = value;
        }
    }
}


customElements.define('suggestions-cde', Suggestions);