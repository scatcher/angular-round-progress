/*!
 * AngularJS Round Progress Directive
 * Original Work: Stephane Begaudeau
 * jQuery and IE8 compatibility enhancements: Scott Hatcher
 */
angular.module('angular-round-progress', []).directive('roundProgress', [function () {
    return {
        restrict: "A",
        replace: true,
        scope: {
            ngOptions: '=',
            ngModel: '='
        },
        link: function(scope, element, attrs) {
            var node = element[0];

            var defaults = {
                width: 400,
                height: 400,
                circle: {
                    inner: {
                        width: 5,
                        radius: 70,
                        foregroundColor: '#505769'
                    },
                    outer: {
                        width: 20,
                        radius: 100,
                        backgroundColor: '#505769',
                        foregroundColor: '#12eeb9'
                    }
                },
                label: {
                    color: '#12eeb9',
                    font: '50pt "Arial"' // Need to have the font name in extra layer of quotes in IE8
                }
            };

            var options = {};

            //Include any custom options
            jQuery.extend(true, options, defaults, scope.ngOptions || {});

            var canvas = document.createElement('canvas');

            node.appendChild(canvas);

            if (typeof(G_vmlCanvasManager) !== 'undefined') {
                G_vmlCanvasManager.initElement(canvas);
            }

            canvas.setAttribute('width', options.width.toString());
            canvas.setAttribute('height', options.height.toString());
            canvas.setAttribute('ng-model', scope.ngModel);

            scope.$watch('ngModel', function (newValue, oldValue) {
                // Create the content of the canvas
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, options.width, options.height);

                // The "background" circle
                var x = options.width / 2;
                var y = options.height / 2;
                ctx.beginPath();
                ctx.arc(x, y, options.circle.outer.radius, 0, Math.PI * 2, false);
                ctx.lineWidth = options.circle.outer.width;
                ctx.strokeStyle = options.circle.outer.backgroundColor;
                ctx.stroke();

                // The inner circle
                ctx.beginPath();
                ctx.arc(x, y, options.circle.inner.radius, 0, Math.PI * 2, false);
                ctx.lineWidth = options.circle.inner.width;
                ctx.strokeStyle = options.circle.inner.foregroundColor;
                ctx.stroke();

                // The inner number
                ctx.font = options.label.font;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = options.label.color;
                ctx.fillText(newValue.label, x, y);

                // The "foreground" circle
                var startAngle = -(Math.PI / 2);
                var endAngle = ((Math.PI * 2 ) * newValue.percentage) - (Math.PI / 2);
                var anticlockwise = false;
                ctx.beginPath();
                ctx.arc(x, y, options.circle.outer.radius, startAngle, endAngle, anticlockwise);
                ctx.lineWidth = options.circle.outer.width;
                ctx.strokeStyle = options.circle.outer.foregroundColor;
                ctx.stroke();
            }, true);
        }
    };
}]);
