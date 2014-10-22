/**
 * Options for setting the animation mode of a vertex animator object.
 *
 * @see away.animators.VertexAnimator
 */
var VertexAnimationMode = (function () {
    function VertexAnimationMode() {
    }
    /**
     * Animation mode that adds all outputs from active vertex animation state to form the current vertex animation pose.
     */
    VertexAnimationMode.ADDITIVE = "additive";
    /**
     * Animation mode that picks the output from a single vertex animation state to form the current vertex animation pose.
     */
    VertexAnimationMode.ABSOLUTE = "absolute";
    return VertexAnimationMode;
})();
module.exports = VertexAnimationMode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9kYXRhL3ZlcnRleGFuaW1hdGlvbm1vZGUudHMiXSwibmFtZXMiOlsiVmVydGV4QW5pbWF0aW9uTW9kZSIsIlZlcnRleEFuaW1hdGlvbk1vZGUuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiJBQUFBLEFBS0E7Ozs7R0FERztJQUNHLG1CQUFtQjtJQUF6QkEsU0FBTUEsbUJBQW1CQTtJQVd6QkMsQ0FBQ0E7SUFUQUQ7O09BRUdBO0lBQ1dBLDRCQUFRQSxHQUFVQSxVQUFVQSxDQUFDQTtJQUUzQ0E7O09BRUdBO0lBQ1dBLDRCQUFRQSxHQUFVQSxVQUFVQSxDQUFDQTtJQUM1Q0EsMEJBQUNBO0FBQURBLENBWEEsQUFXQ0EsSUFBQTtBQUVELEFBQTZCLGlCQUFwQixtQkFBbUIsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvZGF0YS9WZXJ0ZXhBbmltYXRpb25Nb2RlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBPcHRpb25zIGZvciBzZXR0aW5nIHRoZSBhbmltYXRpb24gbW9kZSBvZiBhIHZlcnRleCBhbmltYXRvciBvYmplY3QuXG4gKlxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5WZXJ0ZXhBbmltYXRvclxuICovXG5jbGFzcyBWZXJ0ZXhBbmltYXRpb25Nb2RlXG57XG5cdC8qKlxuXHQgKiBBbmltYXRpb24gbW9kZSB0aGF0IGFkZHMgYWxsIG91dHB1dHMgZnJvbSBhY3RpdmUgdmVydGV4IGFuaW1hdGlvbiBzdGF0ZSB0byBmb3JtIHRoZSBjdXJyZW50IHZlcnRleCBhbmltYXRpb24gcG9zZS5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgQURESVRJVkU6c3RyaW5nID0gXCJhZGRpdGl2ZVwiO1xuXG5cdC8qKlxuXHQgKiBBbmltYXRpb24gbW9kZSB0aGF0IHBpY2tzIHRoZSBvdXRwdXQgZnJvbSBhIHNpbmdsZSB2ZXJ0ZXggYW5pbWF0aW9uIHN0YXRlIHRvIGZvcm0gdGhlIGN1cnJlbnQgdmVydGV4IGFuaW1hdGlvbiBwb3NlLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBBQlNPTFVURTpzdHJpbmcgPSBcImFic29sdXRlXCI7XG59XG5cbmV4cG9ydCA9IFZlcnRleEFuaW1hdGlvbk1vZGU7Il19