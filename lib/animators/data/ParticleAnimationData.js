/**
 * ...
 */
var ParticleAnimationData = (function () {
    function ParticleAnimationData(index /*uint*/, startTime, duration, delay, particle) {
        this.index = index;
        this.startTime = startTime;
        this.totalTime = duration + delay;
        this.duration = duration;
        this.delay = delay;
        this.startVertexIndex = particle.startVertexIndex;
        this.numVertices = particle.numVertices;
    }
    return ParticleAnimationData;
})();
module.exports = ParticleAnimationData;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9kYXRhL3BhcnRpY2xlYW5pbWF0aW9uZGF0YS50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZUFuaW1hdGlvbkRhdGEiLCJQYXJ0aWNsZUFuaW1hdGlvbkRhdGEuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiJBQUVBLEFBR0E7O0dBREc7SUFDRyxxQkFBcUI7SUFVMUJBLFNBVktBLHFCQUFxQkEsQ0FVZEEsS0FBS0EsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsU0FBZ0JBLEVBQUVBLFFBQWVBLEVBQUVBLEtBQVlBLEVBQUVBLFFBQXFCQTtRQUV4R0MsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDbkJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFNBQVNBLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUNsQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDekJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ25CQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLFFBQVFBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7UUFDbERBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLFFBQVFBLENBQUNBLFdBQVdBLENBQUNBO0lBQ3pDQSxDQUFDQTtJQUNGRCw0QkFBQ0E7QUFBREEsQ0FwQkEsQUFvQkNBLElBQUE7QUFFRCxBQUErQixpQkFBdEIscUJBQXFCLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL2RhdGEvUGFydGljbGVBbmltYXRpb25EYXRhLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhcnRpY2xlRGF0YVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZURhdGFcIik7XG5cbi8qKlxuICogLi4uXG4gKi9cbmNsYXNzIFBhcnRpY2xlQW5pbWF0aW9uRGF0YVxue1xuXHRwdWJsaWMgaW5kZXg6bnVtYmVyIC8qdWludCovO1xuXHRwdWJsaWMgc3RhcnRUaW1lOm51bWJlcjtcblx0cHVibGljIHRvdGFsVGltZTpudW1iZXI7XG5cdHB1YmxpYyBkdXJhdGlvbjpudW1iZXI7XG5cdHB1YmxpYyBkZWxheTpudW1iZXI7XG5cdHB1YmxpYyBzdGFydFZlcnRleEluZGV4Om51bWJlciAvKnVpbnQqLztcblx0cHVibGljIG51bVZlcnRpY2VzOm51bWJlciAvKnVpbnQqLztcblxuXHRjb25zdHJ1Y3RvcihpbmRleDpudW1iZXIgLyp1aW50Ki8sIHN0YXJ0VGltZTpudW1iZXIsIGR1cmF0aW9uOm51bWJlciwgZGVsYXk6bnVtYmVyLCBwYXJ0aWNsZTpQYXJ0aWNsZURhdGEpXG5cdHtcblx0XHR0aGlzLmluZGV4ID0gaW5kZXg7XG5cdFx0dGhpcy5zdGFydFRpbWUgPSBzdGFydFRpbWU7XG5cdFx0dGhpcy50b3RhbFRpbWUgPSBkdXJhdGlvbiArIGRlbGF5O1xuXHRcdHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcblx0XHR0aGlzLmRlbGF5ID0gZGVsYXk7XG5cdFx0dGhpcy5zdGFydFZlcnRleEluZGV4ID0gcGFydGljbGUuc3RhcnRWZXJ0ZXhJbmRleDtcblx0XHR0aGlzLm51bVZlcnRpY2VzID0gcGFydGljbGUubnVtVmVydGljZXM7XG5cdH1cbn1cblxuZXhwb3J0ID0gUGFydGljbGVBbmltYXRpb25EYXRhOyJdfQ==