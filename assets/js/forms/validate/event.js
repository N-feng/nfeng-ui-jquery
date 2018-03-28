let Event = {
    emitter (event) {
        let $target = $(event.target);
        let name = $target.attr('name');
        this.verify.call(this, name);
    }
};

module.exports = Event;
