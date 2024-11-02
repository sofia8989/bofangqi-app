import { setImgSrc } from "@/utils/convertImg";
let observer = null;
export const  videoCoverMap ={}
function createObserver() {
    observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                let url = img.getAttribute('data-src');
                if (url) {
                    setImgSrc(img, url)
                } 
                observer.unobserve(img);
            }
        });
    },{
        rootMargin:"200px" 
    });
}

export function observe(img) {
    console.log();
    if (!observer) {
        createObserver();
    }
    observer.observe(img);
}