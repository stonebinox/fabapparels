var app=angular.module("fab",[]);
app.controller("login",function($scope,$http,$compile){
    $scope.loginUser=function(){
        var email=$.trim($("#email").val());
        if(validate(email)){
            $("#email").parent().removeClass("has-error");
            var password=$("#password").val();
            if(password.length>=8){
                $("#password").parent().removeClass("has-error");
                document.login.submit();
            }
            else{
                $("#password").parent().addClass("has-error");
            }
        }
        else{
            $("#email").parent().addClass("has-error");
        }
    };
});
app.controller("createaccount",function($scope,$http,$compile){
    $scope.createUser=function(){
        var email=$.trim($("#email").val());
        if(validate(email)){
            var password=$("#password").val();
            if(password.length>=8){
                $("#password").parent().removeClass("has-error");
                var rPassword=$("#rpassword").val();
                if(password==rPassword){
                    $("#rpassword").parent().removeClass("has-error");        
                    var userName=$.trim($("#name").val());
                    if(validate(userName)){
                        $("#name").parent().removeClass("has-error");            
                        document.createaccount.submit();
                    }
                    else{
                        $("#name").parent().addClass("has-error");            
                    }
                }
                else{
                    $("#rpassword").parent().addClass("has-error");        
                }
            }
            else{
                $("#password").parent().addClass("has-error");
            }
        }
        else{
            $("#email").parent().addClass("has-error");
        }
    };
});
app.controller("dashboard",function($scope,$http,$compile){
    $scope.userType=null;
    $scope.getUserType=function(){
        $http.get("/api/getUserType")
        .then(function success(response){
            response=$.trim(response.data);
            switch(response){
                case "INVALID_PARAMETERS":
                default:
                if(!isNaN(response)){
                    $scope.userType=parseInt(response);
                    $scope.loadLayout();
                }
                else{
                    console.log(response);
                    messageBox("Problem","Something went wrong while loading user type.");
                    window.location='logout';
                }
                break;
            }
        },
        function error(response){
            console.log(response);
            messageBox("Problem","Something went wrong while loading user type. Please refresh the page and try again.");
        });
    };
    $scope.loadLayout=function(){
        if(validate($scope.userType)){
            if($scope.userType==1){
                $scope.loadInventoryDashboard();
            }
        }
        else{
            window.location='logout';
        }
    };
    $scope.loadInventoryDashboard=function(){
        $("#dashboard").load("views/dashboard.html",function(){
            console.log("here");
        });
    };
});