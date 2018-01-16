<?php
/*------------------------------
Author: Anoop Santhanam
Date created: 15/1/18 19:56
Last modified: 15/1/18 19:56
Comments: Main class file for
inventory_master table.
------------------------------*/
class inventoryMaster extends userMaster
{
    public $app=NULL;
    private $inventory_id=NULL;
    public $inventoryValid=false;
    function __construct($inventoryID=NULL)
    {
        $this->app=$GLOBALS['app'];
        if($inventoryID!=NULL)
        {
            $this->inventory_id=secure($inventoryID);
            $this->inventoryValid=$this->verifyInventory();
        }
    }
    function verifyInventory()
    {
        if($this->inventory_id!=NULL)
        {
            $app=$this->app;
            $inventoryID=$this->inventory_id;
            $im="SELECT idinventory_master FROM inventory_master WHERE stat='1' AND idinventory_master='$inventoryID'";
            $im=$app['db']->fetchAssoc($im);
            if(validate($im))
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
    function getInventory()
    {
        if($this->inventoryValid)
        {
            $app=$this->app;
            $invID=$this->inventory_id;
            $im="SELECT * FROM inventory_master WHERE idinventory_master='$invID'";
            $im=$app['db']->fetchAssoc($im);
            if(validate($im))
            {
                return $im;
            }
            else
            {
                return "INVALID_INVENTORY_ID";
            }
        }
        else
        {
            return "INVALID_INVENTORY_ID";
        }
    }
}
?>