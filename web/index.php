<?php

ini_set('display_errors', 1);
require_once __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../src/app.php';
require __DIR__.'/../config/prod.php';
require __DIR__.'/../src/controllers.php';
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => 'php://stderr',
));
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));
$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
      'driver' => 'pdo_mysql',
      'dbname' => 'heroku_e71d741b2d637b9',
      'user' => 'ba568b6304e0b8',
      'password' => '898d6344',
      'host'=> "us-cdbr-iron-east-05.cleardb.net",
    )
));
$app->register(new Silex\Provider\SessionServiceProvider, array(
    'session.storage.save_path' => dirname(__DIR__) . '/tmp/sessions'
));
$app->before(function(Request $request) use($app){
    $request->getSession()->start();
});
$app->get("/",function() use($app){
    return $app['twig']->render("index.html.twig");
});
$app->post("/login",function(Request $request) use($app){
    if(($request->get("email"))&&($request->get("password")))
    {
        require("../classes/userMaster.php");
        $user=new userMaster;
        $response=$user->authenticateUser($request->get("email"),$request->get("password"));
        if($response=="AUTHENTICATE_USER")
        {
            return $app->redirect("/authenticate");
        }
        else
        {
            return $app->redirect("/?err=".$response);
        }
    }
    else
    {
        return "INVALID_PARAMETERS";
    }
});
$app->get("/authenticate",function() use($app){
    if($app['session']->get("uid"))
    {
        require("../classes/userMaster.php");
        $user=new userMaster($app['session']->get("uid"));
        $role=$user->getUserRole();
        if(is_numeric($role))
        {
            $app['session']->set("role",$role);
            return $app->redirect("/dashboard");
        }
        else
        {
            return $app->redirect("/logout");
        }
    }
    else
    {
        return $app->redirect("/");
    }
});
$app->get("/createaccount",function() use($app){
    return $app['twig']->render("createaccount.html.twig");
});
$app->post("/register",function(Request $request) use($app){
    if(($request->get("name"))&&($request->get("email"))&&($request->get("password"))&&($request->get("rpassword")))
    {
        require("../classes/userMaster.php");
        $user=new userMaster;
        $response=$user->createAccount($request->get("name"),$request->get("email"),$request->get("password"),$request->get("rpassword"));
        if($response=="ACCOUNT_CREATED"){
            return $app->redirect("/?suc=".$response);
        }
        else{
            return $app->redirect("/?err=".$response);
        }
    }
    else
    {
        return $app->redirect("/?err=INVALID_PARAMETERS");
    }
});
$app->run();
?>