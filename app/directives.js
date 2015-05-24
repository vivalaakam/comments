app.directive("editable", ["Data", function(Data) {
        return function(scope, elem, attr) {
            var oldword = [];
            elem.bind('keyup', function() {
                var text = elem.html();
                scope.$apply(function() {
                    scope.tmp_text = text;
                });
                var words = text.match(/(?:\B#)(?:([a-zA-Zа-яА-ЯёЁ0-9]+(?:\s+(?:\[a-zA-Zа-яА-ЯёЁ0-9]+(?:\s+(?:\[a-zA-Zа-яА-ЯёЁ0-9]+)?)?)?)?)|(.*)\s#)/ig);
                var diff = _.difference(words, oldword);
                oldword = words;
                if (diff && diff.length > 0) {
                    var current = diff.pop();
                    if (!current.match(/#\w+_\d/ig)) {
                        Data.search(current.substring(1), function(responce) {
                            scope.data = responce;
                            scope.current = current;
                        });
                    } else {
                        current = '';
                    }
                }
            });
        };
    }]);

app.directive("blockquote", [function() {
        return function(scope, elem, attr) {
            elem.bind('click', function(e) {
                e.preventDefault();
                var obj = scope.$eval(attr.blockquote);
                var block = "<blockquote class=\"bs-callout bs-callout-info comment\"><a class=\"author\" href=\"#comment_" + obj.id + "\"> " + obj.author_name.name + " says:</a>" + obj.text + "</blockquote><br > ";
                scope.$apply(function() {
                    scope.$parent.text = scope.tmp_text + block;
                });
                var rng, sel, n = document.getElementById('message');
                if (document.createRange) {
                    rng = document.createRange();
                    rng.selectNodeContents(n);
                    rng.collapse(false);
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(rng);
                } else {
                    var rng = document.body.createTextRange();
                    rng.moveToElementText(n);
                    rng.collapseToEnd();
                    rng.select();
                }
            });
        }
    }])

app.directive('chng', [function() {
        return function(scope, elem, attr) {
            elem.bind('click', function(e) {
                e.preventDefault();
                var obj = scope.$eval(attr.chng);
                var link = "<a class='help' href='#" + obj.type + "_" + obj.id + "' >" + obj.name + "</a>";

                scope.$apply(function() {
                    scope.$parent.text = scope.tmp_text.replace(scope.current, link);
                    scope.$parent.data = [];
                    scope.$parent.current = [];
                });

                var rng, sel, n = document.getElementById('message');
                if (document.createRange) {
                    rng = document.createRange();
                    rng.selectNodeContents(n);
                    rng.collapse(false);
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(rng);
                } else {
                    var rng = document.body.createTextRange();
                    rng.moveToElementText(n);
                    rng.collapseToEnd();
                    rng.select();
                }

            });
        };
    }]);
