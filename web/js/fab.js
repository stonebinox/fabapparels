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