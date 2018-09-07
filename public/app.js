var app = angular.module('myapp', ['ngRoute']);
var localStorage = window.localStorage;

app.config(function ($routeProvider) {
    $routeProvider.when("/", {

    })
        .when("/login", {
            template: `<div ng-controller='login'>
            <h1>LOGIN</h1>
            <form>
                <input type="text" name="username" placeholder="username" ng-model="login_user.username" required/>
                <br>
                <input type="text" name="password" placeholder="password" ng-model="login_user.password" required/>
                <br>
                <button type="button" ng-click='login()'>Login</button>
                <br>
                <br>
            </form>
        </div>`,
            controller: 'login'
        })
        .when("/register", {
            template: `<div ng-controller='register'>
            <h1>REGISTER</h1>
            <form>
                <input type="text" name="username" placeholder="username" ng-model="register_user.username" required/>
                <br>
                <input type="text" name="password" placeholder="password" ng-model="register_user.password" required/>
                <br>
                <input type="text" name="firstname" placeholder="firstname" ng-model="register_user.firstname" required/>
                <br>
                <input type="text" name="lastname" placeholder="lastname" ng-model="register_user.lastname" required/>
                <br>
                <input type="text" name="email" placeholder="email" ng-model="register_user.email" required/>
                <br>
                <input type="text" name="phone" placeholder="phone" ng-model="register_user.phone" required/>
                <br>
                <input type="text" name="location" placeholder="location" ng-model="register_user.location" required/>
                <br>
                <button type="button" ng-click='register()'>Register</button>
                <br>
                <br>
            </form>
        </div>`,
            controller: 'register'
        })
        .when("/profile", {
            template: `<br><button type="button" ng-click='logout()'>logout</button>
            <div> 
            <h1>PROFILE</h1>
            <form>
                <input type="text" name="username" placeholder="username" ng-model="data.username" readonly="true" required/>
                <br>
                <input type="text" name="password" placeholder="password" ng-model="data.password" required/>
                <br>
                <input type="text" name="firstname" placeholder="firstname" ng-model="data.firstname" required/>
                <br>
                <input type="text" name="lastname" placeholder="lastname" ng-model="data.lastname" required/>
                <br>
                <input type="text" name="email" placeholder="email" ng-model="data.email" required/>
                <br>
                <input type="text" name="phone" placeholder="phone" ng-model="data.phone" required/>
                <br>
                <input type="text" name="location" placeholder="location" ng-model="data.location" required/>
                <br>
                <button type="button" ng-click='save()'>save</button>
                <br>
                <br>
            </form>
        </div>`,
            controller: 'profile',
            resolve: {
                app: function ($rootScope, $q, $timeout, $location) {
                    var defer = $q.defer();
                    $timeout(function () {
                        if(localStorage.isLoggedIn){
                            defer.resolve(); 
                        }
                        else{
                            defer.reject();
                            $location.path('/login');

                        } 
                    }, 0);
                    return defer.promise;
                  }
            }
        })
        .when("/messages", {
            template: `<br><button type="button" ng-click='logout()'>logout</button>
            <div> 
            <h1>MESSAGES</h1>
            <form>
            <input type="text" name="receiver" placeholder="Recipient's Username" ng-model="data.receiver" required/>
            <br>
            <input type="text" name="title" placeholder="Title" ng-model="data.title" required/>
            <br>
            <input type="text" name="message" placeholder="Message" ng-model="data.message" required/>
            <br>
            <button ng-click='sendMessage()'>Send Message</button><br><br> 
            </form>
        </div>
        <table cellpadding="7">
        <tr>
            <th>Sender</th>
            <th>Recipient</th>
            <th>Title</th>
            <th>Time</th>
            <th>Important</th>
        </tr>
        <tr ng-repeat = "x in messages track by $index">
            <td>{{x.sender}}</td>
            <td>{{x.receiver}}</td>
            <td>{{x.title}}</td>
            <td>{{x.time}}</td>
            <td>{{x.imp}}</td>
            <td>
                <a href="#/viewmessage/{{$index}}">View Message</a>
            </td>
        </tr>
        </table><br><br>`,
            controller: 'messages',
            resolve: {
                app: function  ($rootScope, $q, $timeout, $location) {
                    var defer = $q.defer();
                    $timeout(function () {
                        if(localStorage.isLoggedIn){
                            defer.resolve(); 
                        }
                        else{
                            defer.reject();
                            $location.path('/login');

                        } 
                    }, 0);
                    return defer.promise;
                  }
            }
        })
        .when("/viewmessage/:id", {
            template: `<h1>Message</h1><br>
            <button ng-click='gotoMessages()'>Back</button>
            <button ng-click='imp()' ng-disabled=dsblBtn>Mark as Important</button>
            <button ng-click='delete()'>Delete</button><br>
            <p>To: {{msg.receiver}}</p>
            <p>From: {{msg.sender}}</p>
            <p>Time: {{msg.time}}</p>
            <p>Title: {{msg.title}}</p>
            <p>Message: {{msg.message}}</p><br><br>
            <h3>Replies</h3>
            <table cellpadding="7">
            <tr ng-repeat = "x in msg_replies">
            <td>{{x.from}}</td>
            <td>{{x.time}}</td>
            <td>{{x.title}}</td>
            <td>{{x.message}}</td>
            </tr>
            </table><br><br>
            <form>
            <input type="text" name="title" placeholder="Title" ng-model="reply.title" required/>
            <br>
            <input type="text" name="message" placeholder="Message" ng-model="reply.message" required/>
            <br>
            <button ng-click='sendreply()'>Send Reply</button><br><br><br> 
            </form>`,
            controller: 'viewmessage',
            resolve: {
                app: function ($rootScope, $q, $timeout, $location) {
                    var defer = $q.defer();
                    $timeout(function () {
                        if(localStorage.isLoggedIn){
                            defer.resolve(); 
                        }
                        else{
                            defer.reject();
                            $location.path('/login');

                        } 
                    }, 0);
                    return defer.promise;
                  }
            }
        });
});


app.controller('mycontroller', function ($scope, $rootScope, $location) {
    if (localStorage.isLoggedIn == "true") {
        $rootScope.status = true;
    } else {
        $rootScope.status = false;
    }
});


app.controller('login', function ($scope, $rootScope, $http, $location, $window) {
    $scope.login = function () {
        $http.post('http://localhost:1234/login', $scope.login_user).then(function (resp) {
            if (resp.data.docs.length == 1) {
                $window.localStorage.setItem("isLoggedIn", true);
                $rootScope.status = true;
                localStorage.usr = JSON.stringify(resp.data.docs[0]);
                $location.path("/profile");
            }
            else {
                alert('Login failed! Please check username and password.')
            }
        });
    };
});

app.controller('register', function ($scope, $rootScope, $http, $location) {
    $scope.register = function () {
        $http.post('http://localhost:1234/register', $scope.register_user).then(function (resp) {
            if (resp.data.success) {
                alert('Successfully Registered!');
                $location.path('/login');
            } else {
                alert('Registration Unsuccessful! Please try registering using a different username.')
            }
        });

    };
});

app.controller('profile', function ($scope, $rootScope, $http, $window, $location) {
    $scope.logout = function () {
        localStorage.removeItem('usr');
        localStorage.removeItem('isLoggedIn');
        $rootScope.status = false;
        $location.path("/login");
    };
    $scope.data = JSON.parse(localStorage.usr);

    $scope.save = function () {

        if ($scope.data.password == null || $scope.data.firstname == null || $scope.data.lastname == null || $scope.data.email == null || $scope.data.phone == null || $scope.data.location == null) {
            alert('please fill all the fields!');
        } else {
            $http.post('http://localhost:1234/profile', $scope.data).then(function (resp) {
                if (resp.data.success) {
                    alert('data updated!');
                    localStorage.usr = JSON.stringify($scope.data);
                } else {
                    alert('update failed!');
                }
            });
        }
    };
});

app.controller('messages', function ($scope, $rootScope, $http, $window, $location, $route) {
    $scope.usr = JSON.parse(localStorage.usr);
    $scope.logout = function () {
        localStorage.removeItem('usr');
        localStorage.removeItem('isLoggedIn');
        $rootScope.status = false;
        $location.path("/login");
    };

    $http.post('http://localhost:1234/messages', $scope.usr).then(function (resp) {
        if (resp.data.success) {
            $rootScope.messages = resp.data.docs;
            console.log($rootScope.messages);
        }
    });

    $scope.sendMessage = function () {
        $scope.data.sender = $scope.usr.username;
        $scope.data.time = new Date();
        $scope.data.imp = "false";
        $scope.data.replies = [];
        $http.post('http://localhost:1234/sendmessage', $scope.data).then(function (resp) {
            if (resp.data.success) {
                $route.reload();
            } else {
                alert('Could not send your message!');
                $location.path('/messages')
            }
        });
    };
});

app.controller('viewmessage', function ($scope, $rootScope, $routeParams, $location, $http, $route) {
    $scope.msg = ($rootScope.messages[$routeParams.id]);
    $scope.msg_replies = ($scope.msg.replies);
    if ($scope.msg.imp == true) {
        $scope.dsblBtn = true;
    }
    $scope.gotoMessages = function () {
        $location.path('/messages');
    };
    $scope.delete = function () {
        $http.post('http://localhost:1234/deletemessage', $scope.msg).then(function (resp) {
            if (resp.data.success) {
                console.log('message deleted!');
            } else {
                console.log('Could not delete your message!')
            }
        });
        $location.path('/messages');
    };
    $scope.imp = function () {
        $http.post('http://localhost:1234/markmessage', $scope.msg).then(function (resp) {
            if (resp.data.success) {
                $rootScope.messages[$routeParams.id].imp = true;
                console.log('message marked as important!');
                $route.reload();
            } else {
                console.log('Could not mark message!')
            }
        });
    };
    $scope.sendreply = function () {
        $scope.usr = JSON.parse(localStorage.usr);
        $scope.reply.from = $scope.usr.username;
        $scope.reply.time = new Date();
        $scope.msg.replies.push($scope.reply);
        $http.post('http://localhost:1234/sendreply', $scope.msg).then(function (resp) {
            if (resp.data.success) {
                $rootScope.messages[$routeParams.id] = $scope.msg;
                $route.reload();
            } else {
                alert('Could not send your reply!');
                $location.path('/messages')
            }
        });
    }

});