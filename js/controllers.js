app.controller('HomeCtrl', ['$scope', '$routeParams', 'Tweets', function($scope, $routeParams, Tweets) {
        $scope.tweets = Tweets.compiled;
        $scope.text = "";
        $scope.$watch("text", function() {
            $scope.tmp_text = $scope.text;
        });

        $scope.visible = false;

        $scope.save = function() {
            var text = $scope.tmp_text;
            var el = document.createElement('div');
            el.innerHTML = text;
            var child, href;
            for (var i = 0, i_m = el.children.length; i < i_m; i++) {
                if (el.children[i].tagName === "BLOCKQUOTE") {
                    child = el.children[i];
                    if ((href = child.querySelector('a.author')) !== null) {
                        el.insertBefore(href, child);
                        el.removeChild(child);
                    }
                }
            }
            text = el.innerHTML;
            var data = {
                text: text.replace(/(<a\s*[^>]*(?:href=["']([^\'\"]+))\s*[^>]*>(?:[\S\s]*?)<\/a>)/gi, " $2 "),
                author: _.random(1, 20)
            };
            Tweets.add(data);
            $scope.text = "";
            $scope.tmp_text = "";

            $scope.visible = false;
        };
    }]);