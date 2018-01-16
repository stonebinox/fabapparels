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
            if(validate($im))
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
            if(validate($im))
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
    function getItems()
    {
        
    }
}
?>