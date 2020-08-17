<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    .tr_pai{
        background: #e0dede;
    }
    .divPessoa table {
        width:100%;
    }
    .divPessoa table tr td {
        padding: 5px;
    }
    .divPessoa table tr td:first-child {
        width:70%;
        text-align:left;
    }
    .btnAddFilho{
        margin-top: 5px;
        margin-bottom: 20px;
    }

    .trFilho{
        background: #f1f1f1;
    }
    </style>
</head>
<body>
    
    <div style="margin-bottom:10px;">
    <button type="submit" id="gravar">Gravar</button>
    <button type="submit" id="ler">Ler</button>
    </div>

    <form action="" method="POST" id="form_pessoa">
        Nome: <input type="text" name="pessoa" id="pessoa">
        <button type="submit" id="incluir">Incluir</button>
    </form>
    <div  style="margin-top:20px;">
        <div style="width:350px; text-align:center; float:left; margin-right:20px;">
            <h2 style="background:#b1b1b1; margin:0px 0px 0px 0px;;">Pessoas</h2>
            <div id="tabelas">
            </div>
        </div>

        <div style="float:left">
            <form action="">
                <textarea name="json" id="json" cols="75" rows="20"></textarea>
            </form>
        </div>
        <div style="clear:both;"></div>
    </div>
    <div style="clear:both;"></div>
    <script src="main.js" type="text/javascript"></script>
</body>

</html>
