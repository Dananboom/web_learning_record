const bunner = function () {
    function creatslide() {
        const slide = document.createElement('div')
        slide.style.position = 'absolute'
        slide.style.left = '0'
        slide.style.top = '0'
        slide.style.width = '100%'
        slide.style.display = 'flex'
    }
    function bindImages  (slide, imgs, width) {
        const newImgs = [...imgs, imgs[0]]
        newImgs.forEach((url) => {
            const img = document.createElement('img')
            img.src = url
            img.width = width
            slide.appendChild(img)
        })
    }
    return function (dom, imgs) {
        dom.style.position = 'relative'
        dom.style.overflow = 'hidden'
        const slide = creatslide
        bindImages(this.slide, imgs, dom.offsetWitch)
        dom.appendChild(slide)

        this.index = 0;
        this.length = imgs.length
        this.width = imgs.length
    }
}