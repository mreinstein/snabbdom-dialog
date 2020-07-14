export default function normalizeKey (key) {
    const keys = {
        Win: 'Meta',
        Scroll: 'ScrollLock',
        Spacebar: ' ',

        Down: 'ArrowDown',
        Left: 'ArrowLeft',
        Right: 'ArrowRight',
        Up: 'ArrowUp',

        Del: 'Delete',
        Apps: 'ContextMenu',
        Esc: 'Escape',

        Multiply: '*',
        Add: '+',
        Subtract: '-',
        Decimal: '.',
        Divide: '/'
    };

    return keys.hasOwnProperty(key) ? keys[key] : key;
}
