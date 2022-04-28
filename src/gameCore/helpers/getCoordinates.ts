export const getCoordinates = (el: HTMLElement) => {
    const coords = el.getBoundingClientRect();
    return {
        left: coords.left + window.pageXOffset,
        right: coords.right + window.pageXOffset,
        top: coords.top + window.pageYOffset,
        bottom: coords.bottom + window.pageYOffset,
    };
};
