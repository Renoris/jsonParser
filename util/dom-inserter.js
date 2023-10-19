export function insertValue(parent, value) {
    if (typeof value === 'object') parent.appendChild(value);
    else parent.innerHTML = value;
}
