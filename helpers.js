module.exports = {
    replace: function(string, mark, value) {
        return string.replace(`{{${mark}}}`, value);
    }
}