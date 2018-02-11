<?php
/*------------------------------------
Author: Anoop Santhanam
Date created: 15/1/18 19:29
Last modified: 15/1/18 19:29
Comments: Main class file user_master
table.
------------------------------------*/
class userMaster
{
    public $app=NULL;
    private $user_id=NULL;
    public $userValid=false;
    function __construct($userID=NULL)
    {
        $this->app=$GLOBALS['app'];
        if($userID!=NULL)
        {
            $this->user_id=secure($userID);
            $this->userValid=$this->verifyUser();
        }
    }
    function verifyUser()
    {
        if($this->user_id!=NULL)
        {
            $app=$this->app;
            $userID=$this->user_id;
            $um="SELECT iduser_master FROM user_master WHERE stat='1' AND iduser_master='$userID'";
            $um=$app['db']->fetchAssoc($um);
            if(validate($um))
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
    function getUserIDFromEmail($userEmail)
    {
        $app=$this->app;
        $userEmail=addslashes(htmlentities($userEmail));
        $um="SELECT iduser_master FROM user_master WHERE stat='1' AND user_email='$userEmail'";
        $um=$app['db']->fetchAssoc($um);
        if(($um!="")&&($um!=NULL))
        {
            return $um['iduser_master'];
        }
        else
        {
            return "INVALID_USER_EMAIL";
        }
    }
    function getUserPassword()
    {
        if($this->userValid)
        {
            $app=$this->app;
            $userID=$this->user_id;
            $um="SELECT user_password FROM user_master WHERE iduser_master='$userID'";
            $um=$app['db']->fetchAssoc($um);
            if(($um!="")&&($um!=NULL))
            {
                return $um['user_password'];
            }
            else
            {
                return "INVALID_USER_ID";
            }
        }
        else
        {
            return "INVALID_USER_ID";
        }
    }
    function authenticateUser($userEmail,$userPassword) //to log a user in
    {
        $userEmail=addslashes(htmlentities($userEmail));
        $userID=$this->getUserIDFromEmail($userEmail);
        $app=$this->app;
        if(is_numeric($userID))
        {
            $this->__construct($userID);
            $userPassword=md5($userPassword);
            $storedPassword=$this->getUserPassword();
            if($userPassword==$storedPassword)
            {
                $up="UPDATE user_master SET online_flag='1' WHERE iduser_master='$userID'";
                $up=$app['db']->executeUpdate($up);
                $app['session']->set('uid',$userID);
                return "AUTHENTICATE_USER";
            }
            else
            {
                return "INVALID_USER_CREDENTIALS";
            }
        }
        else
        {
            return "INVALID_USER_CREDENTIALS";
        }
    }
    function createAccount($userName,$userEmail,$userPassword,$userPassword2,$userRole=1) //to create an account, default userRole is 1 (shop clerk)
    {
        $app=$this->app;
        $userName=trim(addslashes(htmlentities($userName)));
        if(($userName!="")&&($userName!=NULL))
        {  
            $userEmail=trim(addslashes(htmlentities($userEmail)));
            if(filter_var($userEmail, FILTER_VALIDATE_EMAIL)){
                if(strlen($userPassword)>=8)
                {
                    if($userPassword===$userPassword2)
                    {
                        $um="SELECT iduser_master FROM user_master WHERE user_email='$userEmail' AND stat!='0'";
                        $um=$app['db']->fetchAssoc($um);
                        if(($um=="")||($um==NULL))
                        {
                            $userRole=secure($userRole);
                            if((validate($userRole))&&(is_numeric($userRole)))
                            {
                                $hashPassword=md5($userPassword);
                                $in="INSERT INTO user_master (timestamp,user_name,user_email,user_password,user_role) VALUES (NOW(),'$userName','$userEmail','$hashPassword','$userRole')";
                                $in=$app['db']->executeQuery($in);
                                return "ACCOUNT_CREATED";
                            }
                            else
                            {
                                return "INVALID_USER_ROLE";
                            }
                        }
                        else
                        {
                            return "ACCOUNT_ALREADY_EXISTS";
                        }
                    }
                    else
                    {
                        return "PASSWORD_MISMATCH";
                    }
                }
                else
                {
                    return "INVALID_PASSWORD";
                }
            }
            else
            {
                return "INVALID_USER_EMAIL";
            }
        }
        else
        {
            return "INVALID_USER_NAME";
        }
    }
    function logout() //to log a user out
    {
        if($this->userValid)
        {
            $app=$this->app;
            $userID=$this->user_id;
            $um="UPDATE user_master SET online_flag='0' WHERE iduser_master='$userID'";
            $um=$app['db']->executeUpdate($um);
            $app['session']->remove("uid");
            return "USER_LOGGED_OUT";
        }
        else
        {
            return "INVALID_USER_ID";
        }
    }
    function getUserRole()
    {
        if($this->userValid)
        {
            $app=$this->app;
            $userID=$this->user_id;
            $um="SELECT user_role FROM user_master WHERE iduser_master='$userID'";
            $um=$app['db']->fetchAssoc($um);
            if(validate($um))
            {
                return $um['user_role'];
            }
            else
            {
                return "INVALID_USER_ID";
            }
        }
        else
        {
            return "INVALID_USER_ID";
        }
    }
}
?>