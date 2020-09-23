import html         from 'https://cdn.jsdelivr.net/npm/snabby@2/snabby.js';
import normalizeKey from './normalize-key.js';


/*
modal considerations:
* escape key closes
* clicking on background element closes
* scroll freeze while open
* trap key input/tab cycle
* focus after close element
* animated show/hide
*/


function init (options={}) {
    const scrollFreezeEl = document.createElement('style');
    scrollFreezeEl.innerHTML = 'body { overflow: hidden !important; }';

    return {
        state: 'closed',
        open: false,
        dialogEl: undefined,
        openerEl: undefined,
        scrollFreezeEl,
        top: options.top || 0,
        left: options.left || 0,
        width: options.width || 100,
        height: options.height || 100,
        overlayColor: options.overlayColor || 'rgba(255,255,255,0.3)'
    };
}


function view (model, content, update) {

    const _overlayKeyHandler = function (ev) {
        if (normalizeKey(ev.key) === 'Escape' && model.open) {
            model.open = false;
            update();
        }
    };


	// when the overlay is first created, hook up a document key listener to listen for close key events
    const _insertHook = function (vnode) {
        // move the overlay to the bottom of the document so it's on top of other elements
        document.body.appendChild(vnode.elm);
        model.dialogEl = vnode.elm;

        // can be closed with the escape key
        document.addEventListener('keyup', _overlayKeyHandler);
    };


    const _updateHook = function (vnode) {
        
        if (model.open && model.state === 'closed') {
            model.state = 'opening';

            const b = model.dialogEl;

            b.style.transition = '';

            const rect = model.openerEl.getBoundingClientRect();
            b.style.left = rect.left + 'px';
            b.style.top = rect.top + 'px';
            b.style.width = rect.width + 'px';
            b.style.height = rect.height + 'px';
            b.style.display = '';

            setTimeout(function () {
                b.style.transition = 'all 0.25s ease-in-out';    
                b.style.left = model.left + 'px';
                b.style.top = model.top + 'px';
                b.style.width = model.width + 'px';
                b.style.height = model.height + 'px';
                b.style.opacity = 1;
                   
            }, 0)
            
            b.ontransitionend = function () {
                b.style.transition = '';
                model.state = 'open';
                b.style.display = '';
            };
        }

        if (!model.open && model.state === 'open') {
            model.state = 'closing';

            const b = model.dialogEl;

            b.style.transition = 'all 0.25s ease-in-out';
            
            const rect = model.openerEl.getBoundingClientRect();
            b.style.left = rect.left + 'px';
            b.style.top = rect.top + 'px';
            b.style.width = rect.width + 'px';
            b.style.height = rect.height + 'px';
            
            b.style.opacity = 0;
            b.ontransitionend = function () {
                model.state = 'closed';
                b.style.display = 'none';
            };
        }

        if (model.open && !document.body.contains(model.scrollFreezeEl)) {
            document.body.appendChild(model.scrollFreezeEl);
            vnode.elm.focus();
        }
        else if (!model.open && document.body.contains(model.scrollFreezeEl)) {
            document.body.removeChild(model.scrollFreezeEl);
            // force the opening element to have focus upon closing
            if (model.openerEl)
                model.openerEl.focus();
        }
    };


    const _overlayInsertHook = function (vnode) {
        // move overlay to document body
        document.body.appendChild(vnode.elm);
    };

	
    const _close = function () {
        model.open = false;
        update();
    }

	return html`
		<div class="snabbdom-dialog"
             role="dialog"
             tabindex="-1"
             style="left:${model.left}px; top:${model.top}px; width:${model.width}px; height:${model.height}px;"
             @hook:insert=${_insertHook}
             @hook:update=${_updateHook}>
			${content}

            <div class="snabbdom-dialog-overlay"
                 @hook:insert=${_overlayInsertHook}
                 @on:click=${_close}
                 @class:snabbdom-dialog-visible=${model.open}
                 style="background-color: ${model.overlayColor}"></div>
		</div>`;
}


export default { view, init };
