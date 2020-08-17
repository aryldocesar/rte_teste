<?php

    class Bd {

       public function criarBanco($host, $user, $pass, $banco){
            try {

                $con = new PDO("mysql:host=$host", "$user","$pass", array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));  
                $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                if( $con ->query("CREATE DATABASE IF NOT EXISTS $banco") == true){
                    $con = new PDO("mysql:host=$host;dbname=$banco", "$user","$pass", array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));  
                    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                    $con ->query("CREATE table IF NOT EXISTS pessoa(
                                    id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
                                    nome VARCHAR(255) NOT NULL
                                )");
                    $con ->query("CREATE table IF NOT EXISTS filho(
                                id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
                                pessoa_id INT(11) NOT NULL,
                                nome VARCHAR(255) NOT NULL
                        )");
                }
               

              

                } catch (PDOException $e) {
                echo  $e->getMessage();
                }
       }

       public function conectar($host, $user, $pass, $banco){
        try {
            $this->criarBanco($host, $user, $pass, $banco);
            $con = new PDO("mysql:host=$host;dbname=$banco", "$user","$pass", array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));  
            $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $con;

            } catch (PDOException $e) {
                echo  $e->getMessage();
            }
        
        }


       public function gravar($con, $json){
            $pessoas = json_decode($json);
            $pessoas = json_decode($pessoas, true);
            $con = $con;
            try {
                $sqlLimpaTabela = "DELETE pessoa, filho
                                        FROM pessoa
                                        LEFT JOIN filho ON filho.pessoa_id = pessoa.id
                                        WHERE pessoa.id = pessoa.id";

                $stmt = $con->prepare($sqlLimpaTabela);
                if($stmt->execute()){
                    foreach($pessoas['pessoas'] as $key => $pessoa){
                        $sql = 'INSERT INTO pessoa (nome) VALUES (:nome)';
                        $stmt = $con->prepare($sql);
                        $stmt->bindParam( ':nome', $pessoa['nome']);
                        if($stmt->execute()){
                            $pessoa_id = $con->lastInsertId();
    
                            if(!empty($pessoa['filhos'])){
                                foreach($pessoa['filhos'] as $filho){
                                    $sqlFilhos = 'INSERT INTO filho (pessoa_id, nome) VALUES (:pessoa_id, :nome)';
                                    $stmt = $con->prepare($sqlFilhos);
                                    $stmt->bindParam(':pessoa_id', $pessoa_id);
                                    $stmt->bindParam(':nome', $filho);
                                    $stmt->execute();
                                }
                            }
                            
                            
                        }else{
                            echo "ERROR";
                        }
                    }
                    echo "SUCESS";
                }else{
                    echo "ERROR";
                }
                } catch (PDOException $e) {
                    echo  $e->getMessage();
                }
            
        }
       

       public function ler($con){

        try {
            $con = $con;
            $stmt = $con->prepare("SELECT * FROM pessoa p ");
            $stmt->execute();
            $resPessoas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $arrayFinal = [];
            $arrayFinal['pessoas'] = [];
            foreach($resPessoas as $key => $pessoa){
                $arrayFinal['pessoas'][$key]['nome'] = $pessoa['nome'];
                $stmt = $con->prepare("SELECT nome FROM filho where pessoa_id = :id ");
                $stmt->bindParam(':id',$pessoa['id']);
                $stmt->execute();
                $resFilhos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if(!empty($resFilhos)){
                    $arrayFinal['pessoas'][$key]['filhos'] = $resFilhos;
                }else{
                    $arrayFinal['pessoas'][$key]['filhos'] = [];
                }
               
            }
            
            echo json_encode($arrayFinal);
            } catch (PDOException $e) {
                echo  $e->getMessage();
            }
        
        }

    }

?>
