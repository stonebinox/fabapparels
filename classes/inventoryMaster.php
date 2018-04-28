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
    function getAllInventory()
    {
        $app=$this->app;
        $im="SELECT idinventory_master FROM inventory_master WHERE stat='1' ORDER BY inventory_name ASC";
        $im=$app['db']->fetchAll($im);
        $invArray=[];
        foreach($im as $inventoryRow)
        {
            $invID=$inventoryRow['idinventory_master'];
            $this->__construct($invID);
            $inventory=$this->getInventory();
            if(is_array($inventory))
            {
                array_push($invArray,$inventory);
            }
        }
        if(empty($invArray))
        {
            return "NO_INVENTORY_TYPES_FOUND";
        }
        return $invArray;
    }
    function addInventory($name)
    {
        $name=ucwords(trim(secure($name)));
        if(validate($name))
        {
            $app=$this->app;
            $im="SELECT idinventory_master FROM inventory_master WHERE stat='1' AND inventory_name='$name'";
            $im=$app['db']->fetchAssoc($im);
            if(empty($im))
            {  
                $in="INSERT INTO inventory_master (timestamp,inventory_name) VALUES (NOW(),'$name')";
                $in=$app['db']->executeQuery($in);
                return "INVENTORY_ADDED";
            }
            return "INVENTORY_NAME_ALREADY_EXISTS";
        }
        return "INVALID_INVENTORY_NAME";
    }
}
?>