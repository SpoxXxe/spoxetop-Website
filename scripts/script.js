function input_handle(display_error){
    var x = document.getElementById("frm1");
    var text = "no number";
    var num0 = Number(x.elements[0].value);
    var num1 = Number(x.elements[1].value);
    try{
        if(num0==0 || num1==0) throw "zero not allowed";
        if(isNaN(num0) || isNaN(num1)) throw "not a number";
        if(num1 > 1) num1 = num1/100;
        var text = "Profitability:" + (((num0/(1/num1))-1)*100) + "%";
    } catch (err) {
        if(display_error){
            var text = err;
        }else{
            return;
        }
    }
    document.getElementById("demo").innerHTML = text;
}