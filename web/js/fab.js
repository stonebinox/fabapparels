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
    $scope.user=null;
    $scope.inventoryArray=[];
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
            $compile("#dashboard")($scope);
        });
    };
    $scope.getUser=function(){
        $http.get("api/getUser")
        .then(function success(response){
            response=response.data;
            if(typeof(response)=="object"){
                $scope.user=response;
            }
            else{
                response=$.trim(response);
                messageBox("Problem","Something went wrong while loading your user details. Please try again later. This is the error we see: "+response);
            }
        },
        function error(response){
            console.log(response);
            messageBox("Problem","Something went wrong while loading your user details. Please try again later.");
        });
    };
    $scope.getInventoryTypes=function(){
        $http.get("api/getInventoryTypes")
        .then(function success(response){
            response=response.data;
            if(typeof(response)=="object"){
                $scope.inventoryArray=response;
                $scope.displayInventoryTypes();
            }
            else{
                response=$.trim(response);
                switch(response){
                    case "INVALID_PARAMETERS":
                    default:
                    messageBox("Problem","Something went wrong while trying to load the inventory types. Please try again later. This is the error we see: "+response);
                    break;
                    case "NO_INVENTORY_TYPES_FOUND":
                    $("#invtypes").html('<div class="well">No inventory types found</div>');
                    break;
                }
            }
        },
        function error(response){
            console.log(response);
            messageBox("Problem","Something went wrong while trying to load the inventory types. Please try again later.");
        });
    };
    $scope.displayInventoryTypes=function(){
        if($scope.inventoryArray.length>0){
            console.log($scope.inventoryArray);
        }
    };
    $scope.loadAddInventoryView=function(){
        var text='<form name="addinv"><div class="form-group"><label for="invname">Inventory name</label><input type="text" name="invname" id="invname" class="form-control" placeholder="Enter a name for this inventory type" required></div><button type="button" class="btn btn-primary" ng-click="addInventoryType()">Add</button></form>';
        messageBox("Add Inventory Type",text);
        $compile("#myModal")($scope);
    };
    $scope.addInventoryType=function(){
        var name=$.trim($("#invname").val());
        if(validate(name)){
            $("#invname").parent().removeClass("has-error");
            $http.get("api/addInventoryType?invname="+name)
            .then(function success(response){
                response=$.trim(response.data);
                switch(response){
                    case "INVALID_PARAMETERS":
                    default:
                    messageBox("Problem","Something went wrong while trying to add this inventory type. This is the error we see: "+response);
                    break;
                    case "INVENTORY_ADDED":
                    messageBox("Inventory Type Added","The inventory type <strong>"+name+"</strong> was added successfully.");
                    $scope.getInventoryTypes();
                    break;
                }
            },
            function error(response){
                console.log(response);
                messageBox("Problem","Something went wrong while trying to add this inventory type.");
            });
        }
        else{
            $("#invname").parent().addClass("has-error");
        }
    };
    $scope.logout=function(){
        if(confirm("Are you sure you want to logout?")){
            window.location="logout";
        }
    };
});