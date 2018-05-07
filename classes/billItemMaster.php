<?php
/*----------------------------
Author: Anoop Santhanam
Date Created: 7/5/18 15:10
Last Modified: 7/5/18 15:10
Comments: Main class file for 
bill_item_master table.
----------------------------*/
class billItemMaster extends billMaster
{
    public $app=NULL;
    public $billItemValid=false;
    private $bill_item_id=NULL;
    function __construct($billItemID=NULL)
    {
        $this->app=$GLOBALS['app'];
        if(!empty($billItemID))
        {
            $this->bill_item_id=secure($billItemID);
            $this->billItemValid=$this->verifyBillItem();
        }
    }
    function verifyBillItem()
    {
        $app=$this->app;
        if($this->bill_item_id!=NULL)
        {
            $billItemID=$this->bill_item_id;
            $bim="SELECT item_master_iditem_master,bill_master_idbill_master FROM bill_item_master WHERE stat='1' AND idbill_item_master='$billItemID'";
            $bim=$app['db']->fetchAssoc($bim);
            if(!empty($bim))
            {
                $billID=$bim['bill_master_idbill_master'];
                billMaster::__construct($billID);
                if($this->billValid)
                {
                    $userID=$bim['user_master_iduser_master'];
                    userMaster::__construct($userID);
                    if($this->userValid)
                    {
                        return true;
                    }
                    return false;
                }
                return false;
            }
            return false;
        }
        return false;
    }
}
?>