///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (entities) {
        var EntityTest = (function () {
            //        private entity : away.entities.Entity;
            function EntityTest() {
                //            this.entity = new away.entities.Entity();
                //            this.entity.x = 10;
                //            this.entity.y = 10;
                //            this.entity.z = 10;
                //
                //            this.entity.getIgnoreTransform();
                //
                //            console.log( this.entity );
            }
            return EntityTest;
        })();
        entities.EntityTest = EntityTest;
    })(tests.entities || (tests.entities = {}));
    var entities = tests.entities;
})(tests || (tests = {}));
//# sourceMappingURL=EntityTest.js.map
