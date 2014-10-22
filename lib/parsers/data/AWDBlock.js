/**
 *
 */
var AWDBlock = (function () {
    function AWDBlock() {
    }
    AWDBlock.prototype.dispose = function () {
        this.id = null;
        this.bytes = null;
        this.errorMessages = null;
        this.uvsForVertexAnimation = null;
    };
    AWDBlock.prototype.addError = function (errorMsg) {
        if (!this.errorMessages)
            this.errorMessages = new Array();
        this.errorMessages.push(errorMsg);
    };
    return AWDBlock;
})();
module.exports = AWDBlock;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvZGF0YS9hd2RibG9jay50cyJdLCJuYW1lcyI6WyJBV0RCbG9jayIsIkFXREJsb2NrLmNvbnN0cnVjdG9yIiwiQVdEQmxvY2suZGlzcG9zZSIsIkFXREJsb2NrLmFkZEVycm9yIl0sIm1hcHBpbmdzIjoiQUFFQSxBQUdBOztHQURHO0lBQ0csUUFBUTtJQVliQSxTQVpLQSxRQUFRQTtJQWNiQyxDQUFDQTtJQUVNRCwwQkFBT0EsR0FBZEE7UUFHQ0UsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDZkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDbEJBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxxQkFBcUJBLEdBQUdBLElBQUlBLENBQUNBO0lBRW5DQSxDQUFDQTtJQUVNRiwyQkFBUUEsR0FBZkEsVUFBZ0JBLFFBQWVBO1FBRTlCRyxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBVUEsQ0FBQ0E7UUFFMUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO0lBQ25DQSxDQUFDQTtJQUNGSCxlQUFDQTtBQUFEQSxDQWpDQSxBQWlDQ0EsSUFBQTtBQUVELEFBQWtCLGlCQUFULFFBQVEsQ0FBQyIsImZpbGUiOiJwYXJzZXJzL2RhdGEvQVdEQmxvY2suanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnl0ZUFycmF5XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0J5dGVBcnJheVwiKTtcblxuLyoqXG4gKlxuICovXG5jbGFzcyBBV0RCbG9ja1xue1xuXHRwdWJsaWMgaWQ6bnVtYmVyO1xuXHRwdWJsaWMgbmFtZTpzdHJpbmc7XG5cdHB1YmxpYyBkYXRhOmFueTtcblx0cHVibGljIGxlbjphbnk7XG5cdHB1YmxpYyBnZW9JRDpudW1iZXI7XG5cdHB1YmxpYyBleHRyYXM6T2JqZWN0O1xuXHRwdWJsaWMgYnl0ZXM6Qnl0ZUFycmF5O1xuXHRwdWJsaWMgZXJyb3JNZXNzYWdlczpBcnJheTxzdHJpbmc+O1xuXHRwdWJsaWMgdXZzRm9yVmVydGV4QW5pbWF0aW9uOkFycmF5PEFycmF5PG51bWJlcj4+O1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHR9XG5cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cblx0XHR0aGlzLmlkID0gbnVsbDtcblx0XHR0aGlzLmJ5dGVzID0gbnVsbDtcblx0XHR0aGlzLmVycm9yTWVzc2FnZXMgPSBudWxsO1xuXHRcdHRoaXMudXZzRm9yVmVydGV4QW5pbWF0aW9uID0gbnVsbDtcblxuXHR9XG5cblx0cHVibGljIGFkZEVycm9yKGVycm9yTXNnOnN0cmluZyk6dm9pZFxuXHR7XG5cdFx0aWYgKCF0aGlzLmVycm9yTWVzc2FnZXMpXG5cdFx0XHR0aGlzLmVycm9yTWVzc2FnZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG5cdFx0dGhpcy5lcnJvck1lc3NhZ2VzLnB1c2goZXJyb3JNc2cpO1xuXHR9XG59XG5cbmV4cG9ydCA9IEFXREJsb2NrOyJdfQ==