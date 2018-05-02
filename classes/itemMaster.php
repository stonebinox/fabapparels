<?php
/*-----------------------------
Author: Anoop Santhanam
Date Created: 15/1/18 20:37
Last modified: 15/1/18 20:37
Comments: Main class file for
item_master table.
------------------------------*/
class itemMaster extends inventoryMaster
{
    public $app=NULL;
    public $itemValid=false;
    private $item_id=NULL;
    function __construct($itemID=NULL)
    {
        $this->app=$GLOBALS['app'];
        if($itemID!=NULL)
        {
            $this->item_id=secure($itemID);
            $this->itemValid=$this->verifyItem();
        }
    }
    function verifyItem()
    {
        if($this->item_id!=NULL)
        {
            $app=$this->app;
            $itemID=$this->item_id;
            $im="SELECT inventory_master_idinventory_master,user_master_iduser_master FROM item_master WHERE stat='1' AND iditem_master='$itemID'";
            $im=$app['db']->fetchAssoc($im);
            if(!empty($im))
            {
                $invID=$im['inventory_master_idinventory_master'];
                inventoryMaster::__construct($invID);
                if($this->inventoryValid)
                {
                    $userID=$im['user_master_iduser_master'];
                    userMaster::__construct($userID);
                    if($this->userValid)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    function getItem()
    {
        if($this->itemValid)
        {
            $app=$this->app;
            $itemID=$this->item_id;
            $im="SELECT * FROM item_master WHERE iditem_master='$itemID'";
            $im=$app['db']->fetchAssoc($im);
            if(!empty($im))
            {
                $inventoryID=$im['inventory_master_idinventory_master'];
                inventoryMaster::__construct($inventoryID);
                $inventory=inventoryMaster::getInventory();
                if(is_array($inventory))
                {
                    $im['inventory_master_idinventory_master']=$inventory;
                }
                $userID=$im['user_master_iduser_master'];
                userMaster::__construct($userID);
                $user=userMaster::getUser();
                if(is_array($user))
                {
                    $im['user_master_iduser_master']=$user;
                }
                return $im;
            }
            else
            {
                return "INVALID_ITEM_ID";
            }
        }
        else
        {
            return "INVALID_ITEM_ID";
        }
    }
    function getItems($inventoryID=NULL,$offset=0)
    {
        $app=$this->app;
        $offset=secure($offset);
        if((is_numeric($offset))&&($offset>=0))
        {
            $im="SELECT iditem_master FROM item_master WHERE stat='1'";
            if(!empty($inventoryID))
            {
                $inventoryID=secure($inventoryID);
                inventoryMaster::__construct($inventoryID);
                if($this->inventoryValid)
                {
                    $im.=" AND inventory_master_idinventory_master='$inventoryID'";
                }
            }
            $im.=" ORDER BY iditem_master ASC LIMIT $offset,1000";
            $im=$app['db']->fetchAll($im);
            $itemArray=array();
            foreach($im as $item)
            {
                $itemID=$item['iditem_master'];
                $this->__construct($itemID);
                $itemData=$this->getItem();
                if(is_array($itemData))
                {
                    array_push($itemArray,$itemData);
                }
            }
            if(empty($itemArray))
            {
                return "NO_ITEMS_FOUND";
            }
            return $itemArray;
        }
        else
        {
            return "INVALID_OFFSET_VALUE";
        }
    }
    function searchItem($text)
    {
        $text=trim(secure($text));
        if(!empty($text))
        {
            $im="SELECT iditem_master FROM item_master WHERE stat='1' AND item_name='$text' ORDER BY item_name ASC";
            $app=$this->app;
            $im=$app['db']->fetchAssoc($im);
            $itemArray=array();
            foreach($im as $item)
            {
                $itemID=$item['iditem_master'];
                $this->__construct($itemID);
                $itemData=$this->getItem();
                if(is_array($itemData))
                {
                    array_push($itemArray,$itemData);
                }
            }
            if(empty($itemArray))
            {
                return "NO_ITEMS_FOUND";
            }
            return $itemArray;
        }
        else
        {
            return "INVALID_SEARCH_TEXT";
        }
    }
    function addItems($inventoryID,$userID,$name,$price=0,$quantity=0,$discount=0)
    {
        $inventoryID=secure($inventoryID);
        inventoryMaster::__construct($inventoryID);
        if($this->inventoryValid)
        {
            $userID=secure($userID);
            userMaster::__construct($userID);
            if($this->userValid)
            {
                $name=secure($name);
                if(!empty($name))
                {
                    $price=secure($price);
                    if((is_numeric($price))&&($price>=0))
                    {
                        $quantity=secure($quantity);
                        if((is_numeric($quantity))&&($quantity>0))
                        {
                            $discount=secure($discount)   ;
                            if($discount=="zero")
                            {
                                $discount=0;
                            }
                            if((is_numeric($discount))&&($discount>=0))
                            {
                                $app=$this->app;
                                for($i=0;$i<$quantity;$i++)
                                {
                                    $in="INSERT INTO item_master (timestamp,item_name,item_price,item_discount,user_master_iduser_master,inventory_master_idinventory_master) VALUES (NOW(),'$name','$price','$discount','$userID','$inventoryID')";
                                    $in=$app['db']->executeQuery($in);
                                }
                                return "ITEMS_ADDED";
                            }   
                            return "INVALID_ITEM_DISCOUNT";
                        }
                        return "INVALID_ITEM_QUANTITY";
                    }
                    return "INVALID_ITEM_PRICE";
                }
                return "INVALID_ITEM_NAME";
            }
            return "INVALID_USER_ID";
        }
        return "INVALID_INVENTORY_ID";
    }
    function deleteItem()
    {
        if($this->itemValid)
        {
            $app=$this->app;
            $itemID=$this->item_id;
            $im="UPDATE item_master SET stat='0' WHERE iditem_master='$itemID'";
            $im=$app['db']->executeUpdate($im);
            return "ITEM_DELETED";
        }
        return "INVALID_ITEM_ID";
    }
    function sellItem()
    {
        if($this->itemValid)
        {
            $app=$this->app;
            $itemID=$this->item_id;
            $im="UPDATE item_master SET stat='2' WHERE iditem_master='$itemID'";
            $im=$app['db']->executeUpdate($im);
            return "ITEM_SOLD";
        }
        return "INVALID_ITEM_ID";
    }
}
?>