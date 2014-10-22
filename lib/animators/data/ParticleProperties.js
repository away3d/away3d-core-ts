/**
 * Dynamic class for holding the local properties of a particle, used for processing the static properties
 * of particles in the particle animation set before beginning upload to the GPU.
 */
var ParticleProperties = (function () {
    function ParticleProperties() {
    }
    return ParticleProperties;
})();
module.exports = ParticleProperties;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9kYXRhL3BhcnRpY2xlcHJvcGVydGllcy50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZVByb3BlcnRpZXMiLCJQYXJ0aWNsZVByb3BlcnRpZXMuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiJBQUFBLEFBSUE7OztHQURHO0lBQ0csa0JBQWtCO0lBQXhCQSxTQUFNQSxrQkFBa0JBO0lBOEJ4QkMsQ0FBQ0E7SUFBREQseUJBQUNBO0FBQURBLENBOUJBLEFBOEJDQSxJQUFBO0FBRUQsQUFBNEIsaUJBQW5CLGtCQUFrQixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9kYXRhL1BhcnRpY2xlUHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvcm9iYmF0ZW1hbi9XZWJzdG9ybVByb2plY3RzL2F3YXlqcy1yZW5kZXJlcmdsLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRHluYW1pYyBjbGFzcyBmb3IgaG9sZGluZyB0aGUgbG9jYWwgcHJvcGVydGllcyBvZiBhIHBhcnRpY2xlLCB1c2VkIGZvciBwcm9jZXNzaW5nIHRoZSBzdGF0aWMgcHJvcGVydGllc1xuICogb2YgcGFydGljbGVzIGluIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0IGJlZm9yZSBiZWdpbm5pbmcgdXBsb2FkIHRvIHRoZSBHUFUuXG4gKi9cbmNsYXNzIFBhcnRpY2xlUHJvcGVydGllc1xue1xuXHQvKipcblx0ICogVGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IHBhcnRpY2xlIGJlaW5nIHNldC5cblx0ICovXG5cdHB1YmxpYyBpbmRleDpudW1iZXIgLyp1aW50Ki87XG5cblx0LyoqXG5cdCAqIFRoZSB0b3RhbCBudW1iZXIgb2YgcGFydGljbGVzIGJlaW5nIHByb2Nlc3NlZCBieSB0aGUgcGFydGljbGUgYW5pbWF0aW9uIHNldC5cblx0ICovXG5cdHB1YmxpYyB0b3RhbDpudW1iZXIgLyp1aW50Ki87XG5cblx0LyoqXG5cdCAqIFRoZSBzdGFydCB0aW1lIG9mIHRoZSBwYXJ0aWNsZS5cblx0ICovXG5cdHB1YmxpYyBzdGFydFRpbWU6bnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgZHVyYXRpb24gb2YgdGhlIHBhcnRpY2xlLCBhbiBvcHRpb25hbCB2YWx1ZSB1c2VkIHdoZW4gdGhlIHBhcnRpY2xlIGFuaWFtdGlvbiBzZXQgc2V0dGluZ3MgZm9yIDxjb2RlPnVzZUR1cmF0aW9uPC9jb2RlPiBhcmUgZW5hYmxlZCBpbiB0aGUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5hbmltYXRvcnMuUGFydGljbGVBbmltYXRpb25TZXRcblx0ICovXG5cdHB1YmxpYyBkdXJhdGlvbjpudW1iZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBkZWxheSBiZXR3ZWVuIGN5Y2xlcyBvZiB0aGUgcGFydGljbGUsIGFuIG9wdGlvbmFsIHZhbHVlIHVzZWQgd2hlbiB0aGUgcGFydGljbGUgYW5pYW10aW9uIHNldCBzZXR0aW5ncyBmb3IgPGNvZGU+dXNlTG9vcGluZzwvY29kZT4gYW5kICA8Y29kZT51c2VEZWxheTwvY29kZT4gYXJlIGVuYWJsZWQgaW4gdGhlIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlQW5pbWF0aW9uU2V0XG5cdCAqL1xuXHRwdWJsaWMgZGVsYXk6bnVtYmVyO1xufVxuXG5leHBvcnQgPSBQYXJ0aWNsZVByb3BlcnRpZXM7Il19