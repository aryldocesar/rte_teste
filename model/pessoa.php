<?php
require('../controllers/Bd.php');
include('../config/config.php');



    if(isset($_GET)){
        if(isset($_GET['action']) && $_GET['action']=='ler'){
           $bd = new Bd;

           $con = $bd->conectar($host, $user, $pass, $banco);
           $pessoas = $bd->ler($con);
        }

        if(isset($_GET['action']) && $_GET['action']=='gravar'){
            if(isset($_POST) && !empty($_POST)){
                $json = $_POST['json'];
                
                $bd = new Bd;
                $con = $bd->conectar($host, $user, $pass, $banco);
                if($bd->gravar($con, $json)){
                    return "OK";
                }else{
                    return "NO";
                }
            }
           
            //$pessoas = $bd->ler($con);
         }
    }




?>