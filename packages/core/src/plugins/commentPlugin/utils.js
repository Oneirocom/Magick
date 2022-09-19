const min = (arr) => arr.length === 0 ? 0 : Math.min(...arr);
const max = (arr) => arr.length === 0 ? 0 : Math.max(...arr);

export function intersectRect(r1, r2) {
    return !(
        r2.left > r1.right || 
        r2.right < r1.left || 
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}

export function containsRect(r1, r2) {
    return (
        r2.left > r1.left && 
        r2.right < r1.right && 
        r2.top > r1.top &&
        r2.bottom < r1.bottom
    );
}

export function nodesBBox(editor, nodes, margin) {
    const left = min(nodes.map(node => node.position[0])) - margin;
    const top = min(nodes.map(node => node.position[1])) - margin;
    const right = max(nodes.map(node => node.position[0] + editor.view.nodes.get(node).el.clientWidth)) + 2 * margin;
    const bottom = max(nodes.map(node => node.position[1] + editor.view.nodes.get(node).el.clientHeight)) + 2 * margin;
    
    return {
        left,
        right,
        top,
        bottom,
        width: Math.abs(left - right),
        height: Math.abs(top - bottom),
        getCenter: () => {
            return [
                (left + right) / 2,
                (top + bottom) / 2
            ];
        }
    };
}

export function listenWindow(event, handler) {
    window.addEventListener(event, handler);
    
    return () => {
        window.removeEventListener(event, handler);
    }
}