function Parallax(options) {
    options = options || {};
    return new ParallaxConstructor(options);
}

var ParallaxConstructor = function (options) {
    this.config = null;
    this.$template = null;
    this.timer = null;
    this.init(options);
};

ParallaxConstructor.DEFAULT = {
    handle: '.parallax',
    angle: 45
};

ParallaxConstructor.prototype = {
    getDefault() {
        return ParallaxConstructor.DEFAULT;
    },
    getOptions(options) {
        return $.extend({}, this.getDefault(), options);
    },
    wrapContent() {
        $(this.config.handle).children().wrapAll('<div class="parallax-content"></div>');
    },
    floatable(panel) {
        let el = panel.querySelector(".parallax-content");

        el.addEventListener('mousemove', (e) => {
            let thisPX = el.getBoundingClientRect().left
            let thisPY = el.getBoundingClientRect().top
            let boxWidth = el.getBoundingClientRect().width
            let boxHeight = el.getBoundingClientRect().height

            let mouseX = e.pageX - thisPX
            let mouseY = e.pageY - thisPY
            let X
            let Y

            X = mouseX - boxWidth / 2
            Y = boxHeight / 2 - mouseY

            el.style.transform = `perspective(300px) rotateY(${X / 10}deg) rotateX(${Y / 10}deg)`
            // el.style.boxShadow = `${-X / 20}px ${Y / 20}px 50px rgba(0, 0, 0, 0.3)`
        });

        el.addEventListener('mouseout', () => {
            el.style.transform = `perspective(300px) rotateY(0deg) rotateX(0deg)`
            el.style.boxShadow = ''
        })
    },
    init(options) {
        this.config = this.getOptions(options);
        this.wrapContent();

        let parallax = document.querySelectorAll(this.config.handle);
        parallax.forEach((element) => {
            this.floatable(element);
        });
    }
};

module.exports = {
    parallax: Parallax
};