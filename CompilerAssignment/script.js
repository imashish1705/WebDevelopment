
//compile btn var dec
var btnCompile = document.getElementById("btnCompile");

//textarea var
var userCode = document.getElementById("user_code");

//language id var

var langSelect = document.getElementById("lang");

//output var
var outputDisplay = document.getElementById("compile_output");
// click listner on compileBtn
btnCompile.addEventListener("click", function () {
    btnCompile.innerHTML = "loading...";
    btnCompile.disabled = true;
    sendCode(userCode.value, langSelect.value);
});

// function to send request to the server with user data
function sendCode(userCode, reqLangId) {
    var data = JSON.stringify({
        code: userCode,
        langId: reqLangId
    });
    var request = new XMLHttpRequest();
    request.open("POST", "https://codequotient.com/api/executeCode");

    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(data);
    request.addEventListener("load", function (event) {
        var response = JSON.parse(event.currentTarget.responseText);
        if(response.codeId != null){
           
            sendResponseCode(response.codeId);
        }
        if(response.error){
            outputDisplay.innerHTML = "Warning: "+response.error;
        }
    });
  
}

//function get response
function sendResponseCode(codeId){
    setTimeout(function(){
    var req = new XMLHttpRequest();
    const url = "https://codequotient.com/api/codeResult/"+codeId;

    req.open("GET",url);
    req.send();
        req.addEventListener("load",function(event){
            console.log(req)
        var output = JSON.parse(JSON.parse(event.currentTarget.responseText).data);
        
            // console.log(output.errors);
        
            if(output.output != "")
                outputDisplay.innerHTML = output.output;
            else
                outputDisplay.innerHTML = "error: "+output.errors;
            btnCompile.innerHTML = "Compile";
            btnCompile.disabled = false;

    });
    },2000);
}