var CrossfadeTransitionNode = require("awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode");
/**
 *
 */
var CrossfadeTransition = (function () {
    function CrossfadeTransition(blendSpeed) {
        this.blendSpeed = 0.5;
        this.blendSpeed = blendSpeed;
    }
    CrossfadeTransition.prototype.getAnimationNode = function (animator, startNode, endNode, startBlend /*int*/) {
        var crossFadeTransitionNode = new CrossfadeTransitionNode();
        crossFadeTransitionNode.inputA = startNode;
        crossFadeTransitionNode.inputB = endNode;
        crossFadeTransitionNode.blendSpeed = this.blendSpeed;
        crossFadeTransitionNode.startBlend = startBlend;
        return crossFadeTransitionNode;
    };
    return CrossfadeTransition;
})();
module.exports = CrossfadeTransition;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy90cmFuc2l0aW9ucy9jcm9zc2ZhZGV0cmFuc2l0aW9uLnRzIl0sIm5hbWVzIjpbIkNyb3NzZmFkZVRyYW5zaXRpb24iLCJDcm9zc2ZhZGVUcmFuc2l0aW9uLmNvbnN0cnVjdG9yIiwiQ3Jvc3NmYWRlVHJhbnNpdGlvbi5nZXRBbmltYXRpb25Ob2RlIl0sIm1hcHBpbmdzIjoiQUFJQSxJQUFPLHVCQUF1QixXQUFhLHFFQUFxRSxDQUFDLENBQUM7QUFHbEgsQUFHQTs7R0FERztJQUNHLG1CQUFtQjtJQUl4QkEsU0FKS0EsbUJBQW1CQSxDQUlaQSxVQUFpQkE7UUFGdEJDLGVBQVVBLEdBQVVBLEdBQUdBLENBQUNBO1FBSTlCQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxDQUFDQTtJQUM5QkEsQ0FBQ0E7SUFFTUQsOENBQWdCQSxHQUF2QkEsVUFBd0JBLFFBQXFCQSxFQUFFQSxTQUEyQkEsRUFBRUEsT0FBeUJBLEVBQUVBLFVBQVVBLENBQVFBLE9BQURBLEFBQVFBO1FBRS9IRSxJQUFJQSx1QkFBdUJBLEdBQTJCQSxJQUFJQSx1QkFBdUJBLEVBQUVBLENBQUNBO1FBQ3BGQSx1QkFBdUJBLENBQUNBLE1BQU1BLEdBQUdBLFNBQVNBLENBQUNBO1FBQzNDQSx1QkFBdUJBLENBQUNBLE1BQU1BLEdBQUdBLE9BQU9BLENBQUNBO1FBQ3pDQSx1QkFBdUJBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBO1FBQ3JEQSx1QkFBdUJBLENBQUNBLFVBQVVBLEdBQUdBLFVBQVVBLENBQUNBO1FBRWhEQSxNQUFNQSxDQUFxQkEsdUJBQXVCQSxDQUFDQTtJQUNwREEsQ0FBQ0E7SUFDRkYsMEJBQUNBO0FBQURBLENBbkJBLEFBbUJDQSxJQUFBO0FBRUQsQUFBNkIsaUJBQXBCLG1CQUFtQixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy90cmFuc2l0aW9ucy9Dcm9zc2ZhZGVUcmFuc2l0aW9uLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFuaW1hdGlvbk5vZGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5cbmltcG9ydCBDcm9zc2ZhZGVUcmFuc2l0aW9uTm9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvdHJhbnNpdGlvbnMvQ3Jvc3NmYWRlVHJhbnNpdGlvbk5vZGVcIik7XG5pbXBvcnQgSUFuaW1hdGlvblRyYW5zaXRpb25cdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvdHJhbnNpdGlvbnMvSUFuaW1hdGlvblRyYW5zaXRpb25cIik7XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgQ3Jvc3NmYWRlVHJhbnNpdGlvbiBpbXBsZW1lbnRzIElBbmltYXRpb25UcmFuc2l0aW9uXG57XG5cdHB1YmxpYyBibGVuZFNwZWVkOm51bWJlciA9IDAuNTtcblxuXHRjb25zdHJ1Y3RvcihibGVuZFNwZWVkOm51bWJlcilcblx0e1xuXHRcdHRoaXMuYmxlbmRTcGVlZCA9IGJsZW5kU3BlZWQ7XG5cdH1cblxuXHRwdWJsaWMgZ2V0QW5pbWF0aW9uTm9kZShhbmltYXRvcjpBbmltYXRvckJhc2UsIHN0YXJ0Tm9kZTpBbmltYXRpb25Ob2RlQmFzZSwgZW5kTm9kZTpBbmltYXRpb25Ob2RlQmFzZSwgc3RhcnRCbGVuZDpudW1iZXIgLyppbnQqLyk6QW5pbWF0aW9uTm9kZUJhc2Vcblx0e1xuXHRcdHZhciBjcm9zc0ZhZGVUcmFuc2l0aW9uTm9kZTpDcm9zc2ZhZGVUcmFuc2l0aW9uTm9kZSA9IG5ldyBDcm9zc2ZhZGVUcmFuc2l0aW9uTm9kZSgpO1xuXHRcdGNyb3NzRmFkZVRyYW5zaXRpb25Ob2RlLmlucHV0QSA9IHN0YXJ0Tm9kZTtcblx0XHRjcm9zc0ZhZGVUcmFuc2l0aW9uTm9kZS5pbnB1dEIgPSBlbmROb2RlO1xuXHRcdGNyb3NzRmFkZVRyYW5zaXRpb25Ob2RlLmJsZW5kU3BlZWQgPSB0aGlzLmJsZW5kU3BlZWQ7XG5cdFx0Y3Jvc3NGYWRlVHJhbnNpdGlvbk5vZGUuc3RhcnRCbGVuZCA9IHN0YXJ0QmxlbmQ7XG5cblx0XHRyZXR1cm4gPEFuaW1hdGlvbk5vZGVCYXNlPiBjcm9zc0ZhZGVUcmFuc2l0aW9uTm9kZTtcblx0fVxufVxuXG5leHBvcnQgPSBDcm9zc2ZhZGVUcmFuc2l0aW9uOyJdfQ==