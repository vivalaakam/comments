app.factory('Data', ['$http', function($http) {
        var tmp = null;
        var result = [];
        function loadData() {
            $http.get('json/data.json').success(function(responce) {
                tmp = responce;
            });
        }

        loadData();

        return {
            search: function(substr, callback) {
                var t = [], regex = new RegExp(substr, 'i');

                _.each(tmp.users, function(user) {
                    if (regex.test(user.login) || regex.test(user.name)) {
                        user.word = substr;
                        user.type = 'user';
                        t.push(user);
                    }
                });

                _.each(tmp.products, function(product) {
                    if (regex.test(product.name)) {
                        product.word = substr;
                        product.type = 'product';
                        t.push(product);
                    }
                });
                _.each(tmp.suppliers, function(supplier) {
                    if (regex.test(supplier.name)) {
                        supplier.word = substr;
                        supplier.type = 'supplier';
                        t.push(supplier);
                    }
                });
                callback(t);
            },
            getProduct: function(value) {
                result = null;
                _.each(tmp.products, function(product) {
                    if (parseInt(product.id) === parseInt(value)) {
                        result = product;
                    }
                });
                return result;
            },
            getSupplier: function(value) {
                result = null;
                _.each(tmp.suppliers, function(supplier) {
                    if (parseInt(supplier.id) === parseInt(value)) {
                        result = supplier;
                    }
                });
                return result;

            },
            getUser: function(value) {
                result = null;
                _.each(tmp.users, function(user) {
                    if (parseInt(user.id) === parseInt(value)) {
                        result = user;
                    }
                });
                return result;
            }
        };
    }]);


app.factory("Tweets", ["$http", "Data", function($http, Data) {
        var compiled = [];
        var tweets = [];

        function loadTweets() {
            $http.get('json/comments.json').success(function(responce) {
                tweets = responce.comments;
                _.each(tweets, function(tweet, i) {
                    compiled[i] = tweet;
                    compiled[i].author_name = Data.getUser(tweet.author);
                    compiled[i].text = compile(tweet.text);
                });
            });
        }

        function compile(tweet) {
            var reg = /(?:\B#)(?:(\w+)|(.*)\s#)/ig;
            return tweet.replace(reg, function($0, $1) {
                var $a = $1.split('_');
                switch ($a[0]) {
                    case 'product':
                        var product = Data.getProduct($a[1]);
                        return '<a href="#' + $1 + '">' + product.name + '</a>';
                        break;
                    case 'supplier':
                        var supplier = Data.getSupplier($a[1]);
                        return '<a href="#' + $1 + '">' + supplier.name + '</a>';
                        break;
                    case 'user':
                        var user = Data.getUser($a[1]);
                        return '<a href="#' + $1 + '">' + user.name + '</a>';
                        break;
                    case 'comment':
                        var t;
                        _.each(compiled, function(c) {
                            if (parseInt(c.id) === parseInt($a[1])) {
                                t = c;
                            }
                        });
                        return "<blockquote class=\"bs-callout bs-callout-info comment\"><span class=\"author\" > " + t.author_name.name + " says:</span>" + t.text + "</blockquote>";
                        break;
                    default:
                        return '#' + $1 + ' ';
                        break;
                }
            });
        }

        loadTweets();

        return {
            fetchAll: function(callback) {
                callback(compiled);
            },
            add: function(tweet) {
                var i = tweets.length;
                tweet.id = i + 1;
                tweets[i] = tweet;
                compiled[i] = tweet;
                compiled[i].author_name = Data.getUser(tweet.author);
                compiled[i].text = compile(tweet.text);
            },
            compiled: compiled
        };
    }]);