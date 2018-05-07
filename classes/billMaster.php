<?php
/*------------------------------
Author: Anoop Santhanam
Date Created: 7/5/18 14:51
Last Modified: 7/5/18 14:51
Comments: Main class file for 
bill_master table.
------------------------------*/
class billMaster extends itemMaster
{
    public $app=NULL;
    private $bill_id=NULL;
    public $billValid=false;
    function __construct($billID=NULL)
    {
        $this->app=$GLOBALS['app'];
        if(!empty($billID))
        {
            $this->bill_id=secure($billID);
            $this->billValid=$this->verifyBill();
        }
    }
    function verifyBill()
    {
        $app=$this->app;
        if($this->bill_id!=NULL)
        {
            $billID=$this->bill_id;
            $bm="SELECT user_master_iduser_master FROM bill_master WHERE stat='1' AND idbill_master='$billID'";
            $bm=$app['db']->fetchAssoc($bm);
            if(!empty($bm))
            {
                $user=$bm['user_master_iduser_master'];
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
    function getBill()
    {
        $app=$this->app;
        $billID=$this->bill_id;
        if($this->billValid)
        {
            $bm="SELECT * FROM bill_master WHERE idbill_master='$billID'";
            $bm=$app['db']->fetchAssoc($bm);
            if(!empty($bm))
            {
                $userID=$bm['user_master_iduser_master'];
                userMaster::__construct($userID);
                $user=userMaster::getUser();
                if(is_array($user))
                {
                    $bm['user_master_iduser_master']=$user;
                }
                return $bm;
            }
            return "INVALID_BILL_ID";
        }
        return "INVALID_BILL_ID";
    }
    function getBills($offset=0)
    {
        $app=$this->app;
        $bm="SELECT idbill_master FROM bill_master WHERE stat='1' ORDER BY idbill_master DESC LIMIT 50,$offset";
        $bm=$app['db']->fetchAll($bm);
        $billArray=array();
        foreach($bm as $bill)
        {
            $billID=$bill['idbill_master'];
            $this->__construct($billID);
            $billData=$this->getBill();
            if(is_array($billData))
            {
                array_push($billArray,$billData);
            }
        }
        if(empty($billArray))
        {
            return "NO_BILLS_FOUND";
        }
        return $billArray;
    }
}
?>