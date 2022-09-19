export function kebab(str) {
    const replace = s => s.toLowerCase().replace(/ /g, '-');

    return Array.isArray(str) ? str.map(replace) : replace(str);
}