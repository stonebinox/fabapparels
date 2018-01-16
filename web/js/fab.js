var app=angular.module("fab",[]);
app.controller("login",function($scope,$http,$compile){
    $scope.loginUser=function(){
        var email=$.trim($("#email").val());
        if(validate(email)){
            $("#email").parent().removeClass("has-error");
            var password=$("#password").val();
            if(password.length>=8){
                $("#password").parent().removeClass("has-error");
                
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