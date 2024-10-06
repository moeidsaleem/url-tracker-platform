// Screen size 

export const getScreenSize = () => {
    if (typeof window !== 'undefined') {
        return {
            width: window.screen.width,
            height: window.screen.height
        };
    }
    return { width: 0, height: 0 };
}