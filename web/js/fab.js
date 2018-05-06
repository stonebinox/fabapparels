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
    $scope.inventory_id=null;
    $scope.itemArray=[];
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
        $("#invtypes").html('<div class="text-center"><img src="images/ajax-loader.gif" width=40></div>');
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
            var text='<div class="list-group">';
            for(var i=0;i<$scope.inventoryArray.length;i++){
                var inv=$scope.inventoryArray[i];
                var invID=inv.idinventory_master;
                var invName=inv.inventory_name;
                text+='<a href="javascript:void(0)" class="list-group-item" ng-click="getInventoryItems('+invID+')" id="'+invID+'inv">'+invName+'&nbsp;&nbsp;<span class="glyphicon glyphicon-pencil text-success" data-toggle="tooltip" title="Rename this inventory" data-placement="auto" ng-click="showRenameInventory('+invID+')"></span>&nbsp;&nbsp;<span class="glyphicon glyphicon-remove text-danger" data-toggle="tooltip" title="Delete this inventory" data-placement="auto" ng-click="deleteInventory('+invID+')"></span></a>';
            }
            text+='</div>';
            $("#invtypes").html(text);
            $compile("#invtypes")($scope);
            $('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover'
            });
            $scope.getInventoryItems($scope.inventoryArray[0].idinventory_master);
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
    $scope.getInventoryItems=function(inventoryID){
        if(validate(inventoryID)){
            $scope.inventory_id=inventoryID;
            $("#invtypes").find("a").removeClass("active");
            $("#"+inventoryID+"inv").addClass("active");
            $("#itemdata").html('<div class="text-center"><img src="images/ajax-loader.gif" width=30></div>');
            $http.get("api/getItems/"+$scope.inventory_id)
            .then(function success(response){
                response=response.data;
                if(typeof(response)=="object"){
                    $scope.itemArray=response;
                    $scope.displayItemData();
                }
                else{
                    response=$.trim(response);
                    switch(response){
                        case "INVALID_PARAMETERS":
                        default:
                        messageBox("Problem","Something went wrong while getting items. This is the error we see: "+response);
                        break;
                        case "NO_ITEMS_FOUND":
                        $("#itemdata").html('<div class="well"><button type="button" class="btn btn-primary btn-sm" ng-click="addItemsView()">Add items</button><br><hr>No items added.</div>');
                        $compile("#itemdata")($scope);
                        break;
                    }
                }
            },
            function error(response){
                console.log(response);
                messageBox("Problem","Something went wrong while getting items.");
            });
        }
    };
    $scope.displayItemData=function(){
        var text='<div class="panel panel-default"><div class="panel-heading"><strong>'+$scope.itemArray.length+' items</strong>&nbsp;&nbsp;<button type="button" class="btn btn-primary btn-sm" ng-click="addItemsView()">Add items</button>&nbsp;<button type="button" class="btn btn-danger btn-sm" ng-click="deleteItems()">Delete all items</button></div><div class="panel-body"><table class="table"><thead><tr><th><strong>Sl no</strong></th><th><strong>Name</strong></th><th><strong>Price</strong></th><th><strong>Discount</strong></th><th><strong>Actions</strong></th></thead><tbody>';
        for(var i=0;i<$scope.itemArray.length;i++){
            var item=$scope.itemArray[i];
            var itemID=item.iditem_master;
            var itemName=item.item_name;
            var itemPrice=item.item_price;
            var itemDiscount=item.item_discount;
            var user=item.user_master_iduser_master;
            var userID=user.iduser_master;
            var userName=user.user_name;
            text+='<tr id="item'+itemID+'"><td>'+(i+1)+'</td><td>'+itemName+'</td><td>'+itemPrice+'</td><td>'+itemDiscount+'</td><td><button type="button" class="btn btn-danger btn-sm" ng-click="deleteItem('+itemID+')">Delete</button></td></tr>';
        }
        text+='</tbody></table></div></div>';
        $("#itemdata").html(text);
        $compile("#itemdata")($scope);
    };
    $scope.addItemsView=function(){
        if(validate($scope.inventory_id)){
            var pos=null;
            for(var i=0;i<$scope.inventoryArray.length;i++){
                var inv=$scope.inventoryArray[i];
                if(inv.idinventory_master==$scope.inventory_id){
                    pos=i;
                    break;
                }
            }
            var inventory=$scope.inventoryArray[pos];
            var invName=inventory.inventory_name;
            var text='<form name="items"><div class="form-group"><label for="itemname">Item name</label><input type="text" name="itemname" id="itemname" class="form-control" placeholder="Enter a valid name" required value="'+invName+'"></div><div class="form-group"><label for="itemprice">Price</label><input type="number" class="form-control" name="itemprice" id="itemprice" required placeholder="0"></div><div class="form-group"><label for="itemquantity">Quantity</label><input type="number" class="form-control" name="itemquantity" id="itemquantity" placeholder=0 required></div><div class="form-group"><label for="discount">Discount</label><input type="number" class="form-control" name="discount" id="discount" placeholder="0%" value=0></div><button type="button" class="btn btn-primary" ng-click="addItems()">Add Item(s)</button></form>';
            messageBox("Add Items To "+invName,text);
            $compile("#myModal")($scope);
        }
    };
    $scope.addItems=function(){
        var itemname=$.trim($("#itemname").val());
        if(validate(itemname)){
            $("#itemname").parent().removeClass("has-error");
            var itemPrice=$.trim($("#itemprice").val());
            if((validate(itemPrice))&&(!isNaN(itemPrice))&&(itemPrice>=0)){
                $("#itemprice").parent().removeClass("has-error");
                var itemQuantity=$.trim($("#itemquantity").val());
                if((validate(itemQuantity))&&(!isNaN(itemQuantity))&&(itemQuantity>0)){
                    $("#itemquantity").parent().removeClass("has-error");
                    var discount=$.trim($("#discount").val());
                    if((validate(discount))&&(!isNaN(discount))&&(discount>=0)){
                        if(discount==0){
                            discount="zero";
                        }
                        $("#discount").parent().removeClass("has-error");
                        $.ajax({
                            url: "api/addItems",
                            method: "post",
                            data:{
                                name: itemname,
                                price: itemPrice,
                                quantity: itemQuantity,
                                discount: discount,
                                inventory_id: $scope.inventory_id
                            },
                            error: function(err){
                                console.log(err);
                                messageBox("Problem","Something went wrong while adding items. Please try again later.");
                            },
                            success: function(responseText){
                                responseText=$.trim(responseText);
                                if((validate(responseText))&&(responseText!="INVALID_PARAMETERS")){
                                    switch(responseText){
                                        default:
                                        messageBox("Problem","Something went wrong while adding items. Please try again later. This is the error we see: "+responseText);
                                        break;
                                        case "ITEMS_ADDED":
                                        messageBox("Items Added","The items were added successfully!");
                                        $scope.getInventoryItems($scope.inventory_id);
                                        break;
                                    }
                                }
                                else{
                                    messageBox("Problem","Something went wrong while adding items. Please try again later.");
                                }
                            }
                        });
                    }
                    else{
                        $("#discount").parent().addClass("has-error");
                    }
                }
                else{
                    $("#itemquantity").parent().addClass("has-error");
                }
            }
            else{
                $("#itemprice").parent().addClass("has-error");
            }
        }
        else{
            $("#itemname").parent().addClass("has-error");
        }
    };
    $scope.deleteItem=function(itemID){
        if((validate(itemID))&&(confirm("Are you sure you want to delete this item?"))){
            $http.get("api/deleteItem/"+itemID)
            .then(function success(response){
                response=$.trim(response.data);
                switch(response){
                    case "INVALID_PARAMETERS":
                    default:
                    messageBox("Problem","Something went wrong while trying to delete this item. Please try again later. This is the error we see: "+response);    
                    break;
                    case "INVALID_ITEM_ID":
                    messageBox("Invalid Item","The item you are trying to delete is invalid or doesn't exist.");
                    break;
                    case "ITEM_DELETED":
                    $scope.getInventoryItems($scope.inventory_id);
                    break;
                }
            },
            function error(response){
                console.log(response);
                messageBox("Problem","Something went wrong while trying to delete this item. Please try again later.");
            }); 
        }
    };
    $scope.deleteItems=function(){
        if(confirm("Are you sure you want to delete ALL items in this category?")){
            $http.get("api/deleteItems/"+$scope.inventory_id)
            .then(function success(response){
                response=$.trim(response.data);
                switch(response){
                    case "INVALID_PARAMETERS":
                    default:
                    messageBox("Problem","Something went wrong while trying to delete all items from this category. Please try again later. This is the error we see: "+response);
                    break;
                    case "INVALID_INVENTORY_ID":
                    messageBox("Invalid Category","The category you are deleting from is invalid or doesn't.");
                    break;
                    case "ITEMS_DELETED":
                    messageBox("Items Deleted","All items in this category have been deleted.");
                    $scope.getInventoryItems($scope.inventory_id);
                    break;
                }
            },
            function error(response){
                console.log(response);
                messageBox("Problem","Something went wrong while trying to delete all items from this category. Please try again later.");
            });
        }
    };
    $scope.showRenameInventory=function(inventoryID){
        var text='<form><div class="form-group"><label for="name">Name</label><input type="text" name="name" id="name" class="form-control" placeholder="Enter a valid name"></div><button type="button" class="btn btn-primary" ng-click="renameInventory('+inventoryID+')">Rename</button></form>';
        messageBox("Rename Inventory",text);
        $compile("#myModal")($scope);
    };
    $scope.renameInventory=function(inventoryID){
        if(validate(inventoryID)){
            var name=$.trim($("#name").val());
            if(validate(name)){
                $("#name").parent().removeClass("has-error");
                $http.get("api/renameInventory?name="+name+"&inventory_id="+inventoryID)
                .then(function success(response){
                    response=response.data;
                    switch(response){
                        case "INVALID_PARAMETERS":
                        default:
                        messageBox("Problem","Something went wrong while renaming this inventory. Please try again later. This is the error we see: "+response);
                        break;
                        case "INVALID_INVENTORY_NAME":
                        messageBox("Invalid Name","Please enter a valid name and try again.");
                        break;
                        case "INVENTORY_NAME_UPDATED":
                        messageBox("Inventory Renamed","This inventory was renamed successfully.");
                        $scope.getInventoryTypes();
                        break;
                    }
                },
                function error(response){
                    console.log(response);
                    messageBox("Problem","Something went wrong while renaming this inventory. Please try again later.");
                });
            }
            else{
                $("#name").parent().addClass("has-error");
            }
        }
    };
    $scope.deleteInventory=function(inventoryID){
        if((validate(inventoryID))&&(confirm("Are you sure you want to delete this inventory? This will remove all items in this inventory as well."))){
            $http.get("api/deleteInventory/"+inventoryID)
            .then(function success(response){
                response=$.trim(response.data);
                switch(response){
                    case "INVALID_PARAMETERS":
                    default:
                    messageBox("Problem","Something went wrong when trying to delete this item. Please try again later. This is the error we see: "+response);
                    break;
                    case "INVALID_INVENTORY_ID":
                    messageBox("Invalid Inventory","This inventory doesn't exist or is invalid.");
                    break;
                    case "INVENTORY_DELETED":
                    messageBox("Inventory Deleted","The inventory was deleted successfully.");
                    $scope.getInventoryTypes();
                    break;
                }
            },
            function error(response){
                console.log(response);
                messageBox("Problem","Something went wrong when trying to delete this item. Please try again later.");
            });
        }
    };
});